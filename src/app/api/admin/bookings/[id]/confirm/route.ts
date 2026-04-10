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
    const { error } = await supabase.rpc("confirm_booking", { p_booking_id: id });

    if (error) return NextResponse.json({ error: error.message }, { status: 409 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bir hata oluştu, lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
