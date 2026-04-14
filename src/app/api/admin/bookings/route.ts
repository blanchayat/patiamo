import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/adminAuth";
import { supabaseServiceServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("ADMIN_TOKEN exists:", !!process.env.ADMIN_TOKEN);
      console.log("AUTH HEADER exists:", !!req.headers.get("authorization"));
    }
    const auth = assertAdmin(req);
    if (process.env.NODE_ENV !== "production") {
      console.log("AUTH RESULT:", auth);
    }
    if (!auth.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[api/admin/bookings][GET] auth failed", { status: auth.status ?? 401, error: auth.error });
      }
      return NextResponse.json({ error: auth.error ?? "Unauthorized" }, { status: auth.status ?? 401 });
    }

    const supabase = supabaseServiceServer();
    const { data, error } = await supabase
      .from("bookings")
      .select("id,name,phone,date,time,duration,area,note,allergy_status,allergy_note,status,created_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: { bookings: data ?? [] } });
  } catch (e) {
    console.error("[api/admin/bookings][GET] error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bir hata oluştu, lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("ADMIN_TOKEN exists:", !!process.env.ADMIN_TOKEN);
      console.log("AUTH HEADER exists:", !!req.headers.get("authorization"));
    }
    const auth = assertAdmin(req);
    if (process.env.NODE_ENV !== "production") {
      console.log("AUTH RESULT:", auth);
    }
    if (!auth.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[api/admin/bookings][DELETE] auth failed", { status: auth.status ?? 401, error: auth.error });
      }
      return NextResponse.json({ error: auth.error ?? "Unauthorized" }, { status: auth.status ?? 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim();
    if (!id) {
      return NextResponse.json({ error: "id zorunludur" }, { status: 400 });
    }

    const supabase = supabaseServiceServer();
    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[api/admin/bookings][DELETE] error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bir hata oluştu, lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
