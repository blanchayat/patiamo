import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/adminAuth";
import { supabaseServiceServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    const auth = assertAdmin(req);
    if (!auth.ok) return NextResponse.json({ error: auth.error ?? "Yetkisiz işlem" }, { status: 401 });

    const supabase = supabaseServiceServer();
    const { data, error } = await supabase
      .from("bookings")
      .select("id,name,phone,date,time,duration,area,note,status,created_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: { bookings: data ?? [] } });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bir hata oluştu, lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
