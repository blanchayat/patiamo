import { NextRequest, NextResponse } from "next/server";
import { supabaseAnonServer } from "@/lib/supabaseServer";
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

  if (!name) return NextResponse.json({ error: "Ad Soyad zorunludur" }, { status: 400 });
  if (!isValidTurkishPhone(phone)) {
    return NextResponse.json({ error: "Telefon numarası geçersiz" }, { status: 400 });
  }
  if (!date) return NextResponse.json({ error: "Tarih zorunludur" }, { status: 400 });
  if (!time || !isValidTimeSlot(time)) {
    return NextResponse.json({ error: "Saat geçersiz" }, { status: 400 });
  }
  if (duration !== "30 dk" && duration !== "60 dk") {
    return NextResponse.json({ error: "Süre seçiniz" }, { status: 400 });
  }
  if (area !== "Nişantaşı" && area !== "Bebek" && area !== "Emirgan") {
    return NextResponse.json({ error: "Bölge seçiniz" }, { status: 400 });
  }

  const supabase = supabaseAnonServer();

  // Prevent creating booking requests for already unavailable slots
  const { data: slot, error: slotErr } = await supabase
    .from("availability")
    .select("id,is_available")
    .eq("date", date)
    .eq("time", time)
    .maybeSingle();

  if (slotErr) {
    return NextResponse.json({ error: slotErr.message }, { status: 500 });
  }
  if (!slot || slot.is_available !== true) {
    return NextResponse.json(
      { error: "Bu saat dilimi şu anda müsait değil" },
      { status: 409 },
    );
  }

  const { error } = await supabase.from("bookings").insert({
    name,
    phone,
    date,
    time,
    duration,
    area,
    note: note || null,
    status: "pending",
  });

  if (error) {
    // Unique index may block duplicate pending/confirmed slot requests
    const msg = error.code === "23505" ? "Bu saat için zaten talep var" : error.message;
    return NextResponse.json({ error: msg }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
