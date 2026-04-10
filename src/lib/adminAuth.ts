import { NextRequest } from "next/server";

export function assertAdmin(req: NextRequest) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return { ok: false as const, error: "ADMIN_TOKEN yapılandırılmamış" };
  }

  const token = req.headers.get("x-admin-token");
  if (!token || token !== expected) {
    return { ok: false as const, error: "Yetkisiz işlem" };
  }

  return { ok: true as const };
}
