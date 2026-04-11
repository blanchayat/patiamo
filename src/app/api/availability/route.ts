import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const includeUnavailable = searchParams.get("include_unavailable") === "1";

    console.log("[api/availability] requested date:", date);

    if (!date) {
      return NextResponse.json({ error: "date zorunludur" }, { status: 400 });
    }

    const supabase = supabaseServiceServer();
    const q = supabase
      .from("availability")
      .select("id,date,time,is_available")
      .eq("date", date);

    const { data, error } = includeUnavailable
      ? await q.order("time", { ascending: true })
      : await q.eq("is_available", true).order("time", { ascending: true });

    if (error) {
      console.log("[api/availability] supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[api/availability] rows:", data?.length ?? 0, data);

    return NextResponse.json({ slots: data ?? [] });
  } catch (e) {
    console.log("[api/availability] unhandled error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bir hata oluştu, lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
