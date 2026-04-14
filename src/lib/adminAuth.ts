import { NextRequest } from "next/server";

export function assertAdmin(req: NextRequest) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return { ok: false as const, error: "ADMIN_TOKEN yapılandırılmamış" };
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const parts = authHeader.split(" ").filter(Boolean);
  const scheme = parts[0];
  const token = parts[1];
  const extra = parts.length > 2;

  if (!scheme || scheme.toLowerCase() !== "bearer" || !token || extra) {
    return { ok: false as const, error: "Yetkisiz işlem" };
  }

  if (token !== expected) {
    return { ok: false as const, error: "Yetkisiz işlem" };
  }

  return { ok: true as const };
}
