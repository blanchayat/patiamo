import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/adminAuth";
import { supabaseServiceServer } from "@/lib/supabaseServer";
import { isValidTimeSlot } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const auth = assertAdmin(req);
    if (!auth.ok) return NextResponse.json({ error: auth.error ?? "Yetkisiz işlem" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    console.log("[api/admin/availability][GET] date:", date);

    const supabase = supabaseServiceServer();
    const q = supabase.from("availability").select("id,date,time,is_available");
    const { data, error } = date
      ? await q.eq("date", date).order("time")
      : await q.order("date").order("time");

    if (error) {
      console.log("[api/admin/availability][GET] supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.log("[api/admin/availability][GET] rows:", data?.length ?? 0);
    return NextResponse.json({ success: true, data: { slots: data ?? [] } });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bir hata oluştu, lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = assertAdmin(req);
    if (!auth.ok) return NextResponse.json({ error: auth.error ?? "Yetkisiz işlem" }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });

    const date = String(body.date ?? "").trim();
    const time = String(body.time ?? "").trim();
    const isAvailable = body.is_available === false ? false : true;

    console.log("[api/admin/availability][POST] payload:", { date, time, is_available: isAvailable });

    if (!date) return NextResponse.json({ error: "Tarih zorunludur" }, { status: 400 });
    if (!time || !isValidTimeSlot(time)) return NextResponse.json({ error: "Saat geçersiz" }, { status: 400 });

    const supabase = supabaseServiceServer();
    const { data, error } = await supabase
      .from("availability")
      .upsert(
        {
          date,
          time,
          is_available: isAvailable,
        },
        { onConflict: "date,time" },
      )
      .select("id,date,time,is_available")
      .single();

    if (error) {
      console.log("[api/admin/availability][POST] supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.log("[api/admin/availability][POST] upsert result:", data);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Slot eklenemedi." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = assertAdmin(req);
    if (!auth.ok) return NextResponse.json({ error: auth.error ?? "Yetkisiz işlem" }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });

    const id = String(body.id ?? "").trim();
    const isAvailable = Boolean(body.is_available);

    console.log("[api/admin/availability][PATCH] id/is_available:", { id, is_available: isAvailable });

    if (!id) return NextResponse.json({ error: "id zorunludur" }, { status: 400 });

    const supabase = supabaseServiceServer();
    const { data, error } = await supabase
      .from("availability")
      .update({ is_available: isAvailable })
      .eq("id", id)
      .select("id,date,time,is_available")
      .single();

    if (error) {
      console.log("[api/admin/availability][PATCH] supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bir hata oluştu, lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = assertAdmin(req);
    if (!auth.ok) return NextResponse.json({ error: auth.error ?? "Yetkisiz işlem" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log("[api/admin/availability][DELETE] id:", id);

    if (!id) return NextResponse.json({ error: "id zorunludur" }, { status: 400 });

    const supabase = supabaseServiceServer();
    const { error } = await supabase.from("availability").delete().eq("id", id);

    if (error) {
      console.log("[api/admin/availability][DELETE] supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bir hata oluştu, lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
