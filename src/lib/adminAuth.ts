import { NextRequest } from "next/server";

export function assertAdmin(req: NextRequest) {
  const expectedRaw = process.env.ADMIN_TOKEN;
  const expected = expectedRaw?.trim();
  if (!expected) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[assertAdmin] missing ADMIN_TOKEN env");
    }
    return { ok: false as const, status: 500 as const, error: "ADMIN_TOKEN not configured" };
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const parts = authHeader.split(" ").filter(Boolean);
  const scheme = parts[0];
  const token = (parts[1] ?? "").trim();
  const extra = parts.length > 2;

  if (!scheme || scheme.toLowerCase() !== "bearer" || !token || extra) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[assertAdmin] invalid auth header format", {
        hasHeader: Boolean(authHeader),
        scheme,
        tokenLen: token.length,
        partsLen: parts.length,
      });
    }
    return { ok: false as const, status: 401 as const, error: "Unauthorized" };
  }

  if (token !== expected) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[assertAdmin] token mismatch", {
        expectedLen: expected.length,
        gotLen: token.length,
        expectedPrefix: expected.slice(0, 4),
        gotPrefix: token.slice(0, 4),
      });
    }
    return { ok: false as const, status: 401 as const, error: "Unauthorized" };
  }

  return { ok: true as const };
}
