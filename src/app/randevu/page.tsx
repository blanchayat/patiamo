"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Slot = { id: string; date: string; time: string; is_available: boolean };

function formatDateISO(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function RandevuPage() {
  const [selectedDate, setSelectedDate] = useState<string>(formatDateISO(new Date()));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [duration, setDuration] = useState<"30 dk" | "60 dk" | "">("");
  const [area, setArea] = useState<"Nişantaşı" | "Bebek" | "Emirgan" | "">("");
  const [note, setNote] = useState("");
  const [allergyStatus, setAllergyStatus] = useState<"none" | "has">("none");
  const [allergyNote, setAllergyNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const orderedSlots = useMemo(() => slots, [slots]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingSlots(true);
      setError("");
      setSelectedTime("");
      try {
        const res = await fetch(
          `/api/availability?date=${encodeURIComponent(selectedDate)}&include_unavailable=1`,
          {
            cache: "no-store",
          },
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? "Slotlar alınamadı");
        if (!cancelled) setSlots(json.slots ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Bir hata oluştu");
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  async function submit() {
    setSubmitting(true);
    setError("");

    try {
      if (allergyStatus === "has" && !allergyNote.trim()) {
        throw new Error("Alerji bilgisini yazınız");
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          date: selectedDate,
          time: selectedTime,
          duration,
          area,
          note,
          allergy_note: allergyStatus === "has" ? allergyNote.trim() : null,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Talep gönderilemedi");

      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center px-5" style={{ background: "#F4E1C6" }}>
        <Image
          src="/stars.png"
          alt=""
          width={70}
          height={70}
          className="star-float pointer-events-none absolute left-4 top-6 h-10 w-10 opacity-60 sm:left-8 sm:top-10 sm:h-12 sm:w-12"
          aria-hidden="true"
        />
        <Image
          src="/stars.png"
          alt=""
          width={70}
          height={70}
          className="star-float star-float-delay-1 pointer-events-none absolute right-4 top-8 h-9 w-9 opacity-60 sm:right-10 sm:top-12 sm:h-11 sm:w-11"
          aria-hidden="true"
        />
        <Image
          src="/stars.png"
          alt=""
          width={70}
          height={70}
          className="star-float star-float-delay-2 pointer-events-none absolute bottom-10 left-6 hidden h-10 w-10 opacity-60 sm:block sm:bottom-12 sm:left-12 sm:h-12 sm:w-12"
          aria-hidden="true"
        />

        <div
          className="w-full max-w-md rounded-3xl p-7 text-center shadow-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
            Talebiniz alındı 🐾
          </h1>
          <p className="mt-3" style={{ color: "var(--text-muted)" }}>
            Randevu talebiniz alınmıştır. Onay için sizinle iletişime geçilecektir.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex h-11 w-full items-center justify-center rounded-2xl px-5 text-sm font-medium text-white shadow-sm transition hover:brightness-95"
              style={{ background: "var(--primary-strong)" }}
            >
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10" style={{ background: "var(--background)" }}>
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-sm transition hover:brightness-75" style={{ color: "var(--text-muted)" }}>
          ← Ana sayfa
        </Link>
        <Link href="/" aria-label="PATİAMO" className="flex items-center">
          <Image
            src="/logo.png"
            alt="PATİAMO"
            width={180}
            height={72}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </header>

      <div className="mb-6">
        <div className="mb-4 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="PATİAMO"
            width={240}
            height={96}
            className="h-12 w-auto sm:h-14"
          />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-center" style={{ color: "var(--text)" }}>
          Randevu Oluştur
        </h1>
        <p className="mt-2 text-center" style={{ color: "var(--text-muted)" }}>
          Tarih seçin, uygun saatleri görün ve talebinizi iletin.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
        <section
          className="self-start space-y-4 rounded-2xl p-4 shadow-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div>
            <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text)" }}>
              İlk yürüyüşe özel fiyatlar
            </h2>
            <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Tanışma fırsatı
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow" style={{ border: "1px solid var(--border)" }}>
            <img src="/pricing.png" alt="Fiyatlandırma" className="w-full h-auto object-cover" />
          </div>

          <div
            className="flex flex-col gap-3 rounded-2xl p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                Aylık paket
              </div>
              <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                Sabit walker · Aylık rapor özeti · Sınırlı kontenjan
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl px-5 text-sm font-medium text-white shadow-sm transition hover:brightness-95"
              style={{ background: "var(--primary-strong)" }}
            >
              İletişime geçin
            </Link>
          </div>
        </section>

        <div className="space-y-6">
          <section
            className="rounded-2xl p-5 shadow-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <label className="block text-sm font-medium" style={{ color: "var(--text)" }}>
              Tarih
            </label>
            <input
              type="date"
              className="mt-2 w-full rounded-2xl px-4 py-3 outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  Uygun Saatler
                </div>
                {loadingSlots ? (
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Yükleniyor…
                  </div>
                ) : null}
              </div>

              {orderedSlots.length === 0 && !loadingSlots ? (
                <div
                  className="mt-3 rounded-2xl p-4 text-sm"
                  style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
                >
                  Bu tarih için uygun saat bulunamadı.
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {orderedSlots.map((s) => {
                    const t = s.time;
                    const selected = t === selectedTime;
                    const unavailable = s.is_available !== true;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          if (unavailable) return;
                          setSelectedTime(t);
                        }}
                        disabled={unavailable}
                        className="relative h-12 rounded-2xl px-3 text-sm font-medium shadow-sm transition"
                        style={
                          unavailable
                            ? {
                                background: "var(--surface-2)",
                                color: "var(--text-muted)",
                                border: "1px solid var(--border)",
                                textDecoration: "line-through",
                                opacity: 0.65,
                                cursor: "not-allowed",
                              }
                            : selected
                              ? { background: "var(--primary-strong)", color: "#fff", border: "1px solid var(--primary-strong)" }
                              : { background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }
                        }
                      >
                        {t}
                        {unavailable ? (
                          <span
                            className="pointer-events-none absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ background: "rgba(200, 90, 90, 0.16)", color: "rgba(120, 45, 45, 0.95)", border: "1px solid rgba(200, 90, 90, 0.22)" }}
                          >
                            Kontenjan doldu
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section
            className="rounded-2xl p-5 shadow-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Bilgiler
            </div>

            <div className="mt-4 grid gap-4">
              <div>
                <label className="block text-sm" style={{ color: "var(--text-muted)" }}>
                  Ad Soyad
                </label>
                <input
                  className="mt-2 w-full rounded-2xl px-4 py-3 outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                />
              </div>

              <div>
                <label className="block text-sm" style={{ color: "var(--text-muted)" }}>
                  Telefon Numarası
                </label>
                <input
                  className="mt-2 w-full rounded-2xl px-4 py-3 outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="05XXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm" style={{ color: "var(--text-muted)" }}>
                  Yürüyüş süresi
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {(["30 dk", "60 dk"] as const).map((d) => {
                    const selected = duration === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className="h-12 rounded-2xl text-sm font-medium shadow-sm transition"
                        style={
                          selected
                            ? { background: "var(--primary-strong)", color: "#fff", border: "1px solid var(--primary-strong)" }
                            : { background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }
                        }
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm" style={{ color: "var(--text-muted)" }}>
                  Bölge
                </label>
                <select
                  className="mt-2 w-full rounded-2xl bg-transparent px-4 py-3 outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  value={area}
                  onChange={(e) => setArea(e.target.value as any)}
                >
                  <option value="">Seçiniz</option>
                  <option value="Nişantaşı">Nişantaşı</option>
                  <option value="Bebek">Bebek</option>
                  <option value="Emirgan">Emirgan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm" style={{ color: "var(--text-muted)" }}>
                  Alerji durumu
                </label>
                <div className="mt-2 space-y-2">
                  <label
                    className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  >
                    <input
                      type="radio"
                      name="allergy"
                      checked={allergyStatus === "none"}
                      onChange={() => {
                        setAllergyStatus("none");
                        setAllergyNote("");
                      }}
                    />
                    Alerji yok
                  </label>

                  <label
                    className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  >
                    <input
                      type="radio"
                      name="allergy"
                      checked={allergyStatus === "has"}
                      onChange={() => setAllergyStatus("has")}
                    />
                    Var
                  </label>
                </div>

                {allergyStatus === "has" ? (
                  <textarea
                    className="mt-3 w-full resize-none rounded-2xl px-4 py-3 outline-none"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                    value={allergyNote}
                    onChange={(e) => setAllergyNote(e.target.value)}
                    rows={3}
                    placeholder="Varsa alerji bilgisini yazınız"
                  />
                ) : null}
              </div>

              <div>
                <label className="block text-sm" style={{ color: "var(--text-muted)" }}>
                  Ek not
                </label>
                <textarea
                  className="mt-2 w-full resize-none rounded-2xl px-4 py-3 outline-none"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  placeholder="Varsa özel notunuz"
                />
              </div>
            </div>

            {error ? (
              <div
                className="mt-4 rounded-2xl p-4 text-sm"
                style={{ background: "rgba(217, 154, 130, 0.18)", color: "var(--text)" }}
              >
                {error}
              </div>
            ) : null}

            <button
              type="button"
              disabled={submitting || !selectedTime}
              onClick={submit}
              className="mt-5 h-12 w-full rounded-2xl text-sm font-medium text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: "var(--primary-strong)" }}
            >
              {submitting ? "Gönderiliyor…" : "Randevu Talebi Gönder"}
            </button>

            <div className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
              Seçili tarih/saat: {selectedDate} {selectedTime ? `• ${selectedTime}` : ""}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
