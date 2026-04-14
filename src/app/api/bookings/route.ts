import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceServer } from "@/lib/supabaseServer";
import { isValidTimeSlot, isValidTurkishPhone, normalizePhone } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phoneRaw = String(body.phone ?? "");
  const phone = normalizePhone(phoneRaw);
  const date = String(body.date ?? "").trim();
  const time = String(body.time ?? "").trim();
  const duration = String(body.duration ?? "").trim();
  const area = String(body.area ?? "").trim();
  const note = String(body.note ?? "").trim();
  const allergyStatusRaw = String(body.allergy_status ?? "").trim();
  const allergyNoteRaw = body.allergy_note;
  const allergyNote = String(allergyNoteRaw ?? "").trim();
  const hasAllergyNote = allergyNote.length > 0;
  const allergyStatus = allergyStatusRaw === "has" || hasAllergyNote ? "has" : "none";

  if (!name) {
    return NextResponse.json({ error: "Ad Soyad zorunludur" }, { status: 400 });
  }

  if (!isValidTurkishPhone(phone)) {
    return NextResponse.json({ error: "Telefon numarası geçersiz" }, { status: 400 });
  }

  if (!date) {
    return NextResponse.json({ error: "Tarih zorunludur" }, { status: 400 });
  }

  if (!time || !isValidTimeSlot(time)) {
    return NextResponse.json({ error: "Saat geçersiz" }, { status: 400 });
  }

  if (duration !== "30 dk" && duration !== "60 dk") {
    return NextResponse.json({ error: "Süre seçiniz" }, { status: 400 });
  }

  if (area !== "Nişantaşı" && area !== "Bebek" && area !== "Emirgan") {
    return NextResponse.json({ error: "Bölge seçiniz" }, { status: 400 });
  }

  if (allergyStatus === "has" && !allergyNote) {
    return NextResponse.json({ error: "Alerji bilgisini yazınız" }, { status: 400 });
  }

  // Date frontend'den zaten YYYY-MM-DD formatında geliyor.
  // toISOString kullanmıyoruz çünkü timezone kaymasına neden oluyor.
  const normalizedDate = date;
  const normalizedTime = time.padStart(5, "0").trim();
  const normalizedTimeWithSeconds =
    normalizedTime.length === 5 ? `${normalizedTime}:00` : normalizedTime;

  const supabase = supabaseServiceServer();

  const { data: slotPrimary, error: slotErrPrimary } = await supabase
    .from("availability")
    .select("id,is_available,time")
    .eq("date", normalizedDate)
    .eq("time", normalizedTime)
    .maybeSingle();

  const { data: slotSecondary, error: slotErrSecondary } = slotPrimary
    ? { data: null, error: null }
    : await supabase
        .from("availability")
        .select("id,is_available,time")
        .eq("date", normalizedDate)
        .eq("time", normalizedTimeWithSeconds)
        .maybeSingle();

  const slot = slotPrimary ?? slotSecondary;
  const slotErr = slotErrPrimary ?? slotErrSecondary;
  const matchedTime = slotPrimary
    ? normalizedTime
    : slotSecondary
      ? normalizedTimeWithSeconds
      : null;

  if (slotErr) {
    return NextResponse.json({ error: slotErr.message }, { status: 500 });
  }

  if (!slot || slot.is_available !== true) {
    return NextResponse.json(
      { error: "Bu saat dilimi şu anda müsait değil" },
      { status: 409 },
    );
  }

  const { data: existingBooking, error: existingBookingErr } = await supabase
    .from("bookings")
    .select("id,status")
    .eq("date", normalizedDate)
    .in("time", [normalizedTime, normalizedTimeWithSeconds])
    .in("status", ["pending", "confirmed"])
    .maybeSingle();

  if (existingBookingErr) {
    return NextResponse.json({ error: existingBookingErr.message }, { status: 500 });
  }

  if (existingBooking) {
    return NextResponse.json({ error: "Bu saat için zaten talep var" }, { status: 409 });
  }

  const { error } = await supabase.from("bookings").insert({
    name,
    phone,
    date: normalizedDate,
    time: matchedTime ?? normalizedTime,
    duration,
    area,
    note: note || null,
    allergy_status: allergyStatus,
    allergy_note: allergyStatus === "has" ? allergyNote : null,
    status: "pending",
  });

  if (error) {
    const msg = error.code === "23505" ? "Bu saat için zaten talep var" : error.message;
    return NextResponse.json({ error: msg }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}