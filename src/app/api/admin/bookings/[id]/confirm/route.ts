import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/adminAuth";
import { supabaseServiceServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const auth = assertAdmin(req);
    if (!auth.ok) return NextResponse.json({ error: auth.error ?? "Yetkisiz işlem" }, { status: 401 });

    const { id } = await ctx.params;
    if (!id) return NextResponse.json({ error: "id zorunludur" }, { status: 400 });

    const supabase = supabaseServiceServer();

    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", id)
      .select("id,date,time,status")
      .single();

    if (bookingErr) return NextResponse.json({ error: bookingErr.message }, { status: 409 });

    const bookingTime = String(booking?.time ?? "");
    const bookingDate = String(booking?.date ?? "");
    const bookingTimeWithSeconds = bookingTime.length === 5 ? `${bookingTime}:00` : bookingTime;

    const { error: availabilityErr } = await supabase
      .from("availability")
      .update({ is_available: false })
      .eq("date", bookingDate)
      .in("time", [bookingTime, bookingTimeWithSeconds]);

    if (availabilityErr) return NextResponse.json({ error: availabilityErr.message }, { status: 409 });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bir hata oluştu, lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
