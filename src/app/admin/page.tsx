"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Slot = { id: string; date: string; time: string; is_available: boolean };
type Booking = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  duration: string;
  area: string;
  note: string | null;
  allergy_status?: string | null;
  allergy_note?: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
};

async function safeReadJson(res: Response): Promise<any | null> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  try {
    const txt = await res.text();
    if (!txt) return null;
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

function toBooleanAvailability(v: unknown): boolean {
  if (v === true || v === "true") return true;
  if (v === false || v === "false") return false;
  return Boolean(v);
}

function sanitizeAdminToken(input: string) {
  const v = (input ?? "").trim();
  if (!v) return "";
  const lowered = v.toLowerCase();
  if (lowered.startsWith("bearer ")) return v.slice(7).trim();
  return v;
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginValue, setLoginValue] = useState("");
  const [loginError, setLoginError] = useState("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("09:00");
  const [isAvailable, setIsAvailable] = useState(true);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  async function verifyToken(t: string): Promise<{ ok: boolean; status?: number }> {
    const v = sanitizeAdminToken(t);
    if (!v) return { ok: false, status: 401 };
    try {
      if (process.env.NODE_ENV !== "production") {
        console.log("[admin][verifyToken] token", { len: v.length, prefix: v.slice(0, 4) });
        console.log("[admin][verifyToken] header", { authorization: `Bearer ${v}`.slice(0, 16) + "…" });
      }
      const res = await fetch(`/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${v}` },
        cache: "no-store",
      });
      return { ok: res.ok, status: res.status };
    } catch {
      return { ok: false, status: 500 };
    }
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_token");
      if (stored && stored.trim()) {
        const v = sanitizeAdminToken(stored);
        setToken(v);
        verifyToken(v).then((result) => {
          if (result.ok) {
            setIsAuthed(true);
          } else {
            setIsAuthed(false);
            setToken("");
            try {
              localStorage.removeItem("admin_token");
            } catch {
              // ignore
            }
          }
        });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const v = token.trim();
      if (isAuthed && v) localStorage.setItem("admin_token", v);
      else localStorage.removeItem("admin_token");
    } catch {
      // ignore
    }
  }, [token, isAuthed]);

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [sRes, bRes] = await Promise.all([
        fetch(`/api/admin/availability?date=${encodeURIComponent(date)}`, { headers, cache: "no-store" }),
        fetch(`/api/admin/bookings`, { headers, cache: "no-store" }),
      ]);

      const sJson = await safeReadJson(sRes);
      const bJson = await safeReadJson(bRes);

      if (!sRes.ok) {
        throw new Error(sJson?.error ?? "Slotlar alınamadı.");
      }
      if (!bRes.ok) {
        throw new Error(bJson?.error ?? "Talepler alınamadı.");
      }

      const slotsData = sJson?.data?.slots ?? sJson?.slots ?? [];
      setSlots(slotsData);
      const bookingsData = bJson?.data?.bookings ?? bJson?.bookings ?? [];
      setBookings(bookingsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteBooking(id: string) {
    setError("");
    if (!token.trim()) {
      setError("Admin token girmen gerekiyor.");
      return;
    }
    const ok = window.confirm("Silmek istediğinize emin misiniz?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/bookings?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers,
      });
      const json = await safeReadJson(res);
      if (!res.ok) {
        setError(json?.error ?? "Silme işlemi başarısız.");
        return;
      }
      await loadAll();
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  }

  async function completeBooking(id: string) {
    setError("");
    if (!token.trim()) {
      setError("Admin token girmen gerekiyor.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/bookings/${encodeURIComponent(id)}/complete`, {
        method: "POST",
        headers,
      });
      const json = await safeReadJson(res);
      if (!res.ok) {
        setError(json?.error ?? "Tamamlama işlemi başarısız.");
        return;
      }
      if (!json) {
        setError("Sunucudan geçerli yanıt alınamadı.");
        return;
      }
      await loadAll();
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  }

  useEffect(() => {
    if (!isAuthed) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, token, date]);

  useEffect(() => {
    if (!loginOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLoginOpen(false);
        setLoginError("");
        setLoginValue("");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loginOpen]);

  async function submitLogin() {
    const v = sanitizeAdminToken(loginValue);
    setLoginError("");
    if (!v) return;

    setLoading(true);
    setError("");
    try {
      if (process.env.NODE_ENV !== "production") {
        console.log("[admin][submitLogin] entered token", { len: v.length, prefix: v.slice(0, 4) });
      }
      const result = await verifyToken(v);
      if (!result.ok) {
        setIsAuthed(false);
        setToken("");
        try {
          localStorage.removeItem("admin_token");
        } catch {
          // ignore
        }
        if (result.status === 401) setLoginError("Geçersiz kod");
        else setLoginError("Sunucu hatası");
        setLoginValue("");
        setSlots([]);
        setBookings([]);
        return;
      }

      setToken(v);
      setIsAuthed(true);
      setLoginOpen(false);
      setLoginValue("");
      setLoginError("");
      await loadAll();
    } finally {
      setLoading(false);
    }
  }

  async function addSlot() {
    setError("");
    if (!token.trim()) {
      setError("Admin token girmen gerekiyor.");
      return;
    }
    try {
      const isAvailableBool = toBooleanAvailability(isAvailable);
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { ...headers, "content-type": "application/json" },
        body: JSON.stringify({ date, time, is_available: isAvailableBool }),
      });
      const json = await safeReadJson(res);
      if (!res.ok) {
        setError(json?.error ?? "Slot eklenemedi.");
        return;
      }
      if (!json) {
        setError("Sunucudan geçerli yanıt alınamadı.");
        return;
      }
      await loadAll();
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  }

  async function toggleSlot(s: Slot) {
    setError("");
    if (!token.trim()) {
      setError("Admin token girmen gerekiyor.");
      return;
    }
    try {
      const nextAvailability = !toBooleanAvailability(s.is_available);
      const res = await fetch("/api/admin/availability", {
        method: "PATCH",
        headers: { ...headers, "content-type": "application/json" },
        body: JSON.stringify({ id: s.id, is_available: nextAvailability }),
      });
      const json = await safeReadJson(res);
      if (!res.ok) {
        setError(json?.error ?? "Slot güncellenemedi.");
        return;
      }
      if (!json) {
        setError("Sunucudan geçerli yanıt alınamadı.");
        return;
      }
      await loadAll();
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  }

  async function deleteSlot(id: string) {
    setError("");
    if (!token.trim()) {
      setError("Admin token girmen gerekiyor.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/availability?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers,
      });
      const json = await safeReadJson(res);
      if (!res.ok) {
        setError(json?.error ?? "Slot silinemedi.");
        return;
      }
      if (!json) {
        setError("Sunucudan geçerli yanıt alınamadı.");
        return;
      }
      await loadAll();
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  }

  async function confirmBooking(id: string) {
    setError("");
    if (!token.trim()) {
      setError("Admin token girmen gerekiyor.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/bookings/${encodeURIComponent(id)}/confirm`, {
        method: "POST",
        headers,
      });
      const json = await safeReadJson(res);
      if (!res.ok) {
        setError(json?.error ?? "Onay işlemi başarısız.");
        return;
      }
      if (!json) {
        setError("Sunucudan geçerli yanıt alınamadı.");
        return;
      }
      await loadAll();
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  }

  async function cancelBooking(id: string) {
    setError("");
    if (!token.trim()) {
      setError("Admin token girmen gerekiyor.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/bookings/${encodeURIComponent(id)}/cancel`, {
        method: "POST",
        headers,
      });
      const json = await safeReadJson(res);
      if (!res.ok) {
        setError(json?.error ?? "İptal işlemi başarısız.");
        return;
      }
      if (!json) {
        setError("Sunucudan geçerli yanıt alınamadı.");
        return;
      }
      await loadAll();
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  }

  return (
    <div
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10"
      style={{ background: "var(--background)" }}
    >
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-sm transition hover:brightness-75" style={{ color: "var(--text-muted)" }}>
          ← Ana sayfa
        </Link>
        <button
          type="button"
          onClick={() => {
            setLoginOpen(true);
            setLoginError("");
            setLoginValue("");
          }}
          className="h-9 rounded-2xl px-3 text-xs font-medium shadow-sm transition hover:brightness-95"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          Dog Walking
        </button>
      </header>

      <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
        Yönetim
      </h1>
      <p className="mt-2" style={{ color: "var(--text-muted)" }}>
        Uygun saatleri yönetin ve talepleri onaylayın/iptal edin.
      </p>

      {isAuthed ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section
            className="rounded-2xl p-5 shadow-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                Uygun Saatler
              </div>
              {loading ? (
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Yükleniyor…
                </div>
              ) : null}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs" style={{ color: "var(--text-muted)" }}>
                  Tarih
                </label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-2xl px-3 py-2 outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs" style={{ color: "var(--text-muted)" }}>
                  Saat
                </label>
                <input
                  type="time"
                  className="mt-1 w-full rounded-2xl px-3 py-2 outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs" style={{ color: "var(--text-muted)" }}>
                  Durum
                </label>
                <select
                  className="mt-1 w-full rounded-2xl bg-transparent px-3 py-2 outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  value={isAvailable ? "true" : "false"}
                  onChange={(e) => setIsAvailable(e.target.value === "true")}
                >
                  <option value="true">Müsait</option>
                  <option value="false">Kapalı</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={addSlot}
              className="mt-4 h-11 w-full rounded-2xl text-sm font-medium text-white shadow-sm transition hover:brightness-95"
              style={{ background: "var(--primary-strong)" }}
            >
              Slot Ekle / Güncelle
            </button>

            <div className="mt-5 divide-y rounded-2xl" style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
              {slots.length === 0 ? (
                <div className="p-4 text-sm" style={{ color: "var(--text-muted)" }}>
                  Bu tarih için slot yok.
                </div>
              ) : (
                slots.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                        {s.time}
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {s.is_available ? "Müsait" : "Kapalı"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSlot(s)}
                        className="h-9 rounded-2xl px-3 text-xs font-medium shadow-sm transition hover:brightness-95"
                        style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                      >
                        {s.is_available ? "Kapat" : "Aç"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSlot(s.id)}
                        className="h-9 rounded-2xl px-3 text-xs font-medium shadow-sm transition hover:brightness-95"
                        style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section
            className="rounded-2xl p-5 shadow-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                Randevular
              </div>
              <button
                type="button"
                onClick={loadAll}
                className="h-9 rounded-2xl px-3 text-xs font-medium shadow-sm transition hover:brightness-95"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
              >
                Yenile
              </button>
            </div>

            {(() => {
              const pending = bookings.filter((b) => b.status === "pending");
              const confirmed = bookings.filter((b) => b.status === "confirmed");
              const completed = bookings.filter((b) => b.status === "completed");

              const renderCard = (b: Booking, variant: "pending" | "confirmed" | "completed") => {
                const showConfirm = variant === "pending";
                const showComplete = variant === "confirmed";
                const showCancel = variant !== "completed";
                const completedBadge = variant === "completed";

                return (
                  <div key={b.id} className="rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                          {b.name}
                        </div>
                        <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                          {b.date} • {b.time} • {b.duration} • {b.area}
                        </div>
                        <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                          {b.phone}
                        </div>
                        <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                          {b.allergy_note && String(b.allergy_note).trim() ? `Alerji: ${String(b.allergy_note).trim()}` : "Alerji: Yok"}
                        </div>
                        {b.note ? (
                          <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                            Not: {b.note}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-start gap-2">
                        {completedBadge ? (
                          <div
                            className="rounded-2xl px-3 py-1 text-xs font-medium"
                            style={{ background: "rgba(63, 107, 86, 0.12)", border: "1px solid rgba(63, 107, 86, 0.22)", color: "var(--text)" }}
                          >
                            Tamamlandı
                          </div>
                        ) : (
                          <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                            {b.status}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteBooking(b.id)}
                          className="h-8 w-8 rounded-2xl shadow-sm transition hover:brightness-95"
                          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                          aria-label="Sil"
                          title="Sil"
                        >
                          <svg viewBox="0 0 24 24" className="mx-auto h-4 w-4" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M9 3a1 1 0 0 0-1 1v1H5a1 1 0 1 0 0 2h1v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7h1a1 1 0 1 0 0-2h-3V4a1 1 0 0 0-1-1H9Zm1 2h4v1h-4V5Zm-1 5a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1Zm6 0a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0v-8a1 1 0 0 1 1-1Z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      {showConfirm ? (
                        <button
                          type="button"
                          onClick={() => confirmBooking(b.id)}
                          className="h-9 flex-1 rounded-2xl px-3 text-xs font-medium text-white shadow-sm transition hover:brightness-95"
                          style={{ background: "var(--primary-strong)" }}
                        >
                          Onayla
                        </button>
                      ) : null}

                      {showComplete ? (
                        <button
                          type="button"
                          onClick={() => completeBooking(b.id)}
                          className="h-9 flex-1 rounded-2xl px-3 text-xs font-medium shadow-sm transition hover:brightness-95"
                          style={{ background: "rgba(63, 107, 86, 0.12)", border: "1px solid rgba(63, 107, 86, 0.25)", color: "var(--text)" }}
                        >
                          Tamamlandı
                        </button>
                      ) : null}

                      {showCancel ? (
                        <button
                          type="button"
                          onClick={() => cancelBooking(b.id)}
                          className="h-9 flex-1 rounded-2xl px-3 text-xs font-medium shadow-sm transition hover:brightness-95"
                          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                        >
                          İptal
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              };

              return (
                <div className="mt-4 space-y-6">
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                      Bekleyen Talepler
                    </div>
                    <div className="mt-3 space-y-3">
                      {pending.length === 0 ? (
                        <div
                          className="rounded-2xl p-4 text-sm"
                          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                        >
                          Bekleyen talep yok.
                        </div>
                      ) : (
                        pending.map((b) => renderCard(b, "pending"))
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                      Onaylanan Randevular
                    </div>
                    <div className="mt-3 space-y-3">
                      {confirmed.length === 0 ? (
                        <div
                          className="rounded-2xl p-4 text-sm"
                          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                        >
                          Onaylanmış randevu yok.
                        </div>
                      ) : (
                        confirmed.map((b) => renderCard(b, "confirmed"))
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                      Tamamlanan Randevular
                    </div>
                    <div className="mt-3 space-y-3">
                      {completed.length === 0 ? (
                        <div
                          className="rounded-2xl p-4 text-sm"
                          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                        >
                          Tamamlanan randevu yok.
                        </div>
                      ) : (
                        completed.map((b) => renderCard(b, "completed"))
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>
        </div>
      ) : (
        <div
          className="mt-10 rounded-2xl p-8 text-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          <div className="text-sm"> </div>
        </div>
      )}

      {error ? (
        <div className="mt-6 rounded-2xl p-4 text-sm" style={{ background: "rgba(217, 154, 130, 0.18)", color: "var(--text)" }}>
          {error}
        </div>
      ) : null}

      {loginOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          style={{ background: "rgba(20, 16, 12, 0.35)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setLoginOpen(false);
              setLoginError("");
              setLoginValue("");
            }
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-5 shadow-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                Yönetici girişi
              </div>
              <button
                type="button"
                className="h-9 rounded-2xl px-3 text-xs font-medium transition hover:brightness-95"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                onClick={() => {
                  setLoginOpen(false);
                  setLoginError("");
                  setLoginValue("");
                }}
              >
                Kapat
              </button>
            </div>

            <input
              type="password"
              className="mt-4 w-full rounded-2xl px-4 py-3 outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              value={loginValue}
              onChange={(e) => {
                setLoginValue(e.target.value);
                setLoginError("");
              }}
              placeholder="Yönetici kodu"
              autoFocus
            />

            {loginError ? (
              <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                {loginError}
              </div>
            ) : null}

            <button
              type="button"
              onClick={submitLogin}
              disabled={loading}
              className="mt-4 h-11 w-full rounded-2xl text-sm font-medium text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "var(--primary-strong)" }}
            >
              Giriş Yap
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
