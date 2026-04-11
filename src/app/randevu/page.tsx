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

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const availableTimes = useMemo(() => slots.map((s) => s.time), [slots]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingSlots(true);
      setError("");
      setSelectedTime("");
      try {
        const res = await fetch(`/api/availability?date=${encodeURIComponent(selectedDate)}`, {
          cache: "no-store",
        });
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
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 py-10" style={{ background: "var(--background)" }}>
        <header className="mb-8">
          <Link
            href="/"
            className="text-sm transition"
            style={{ color: "var(--text-muted)" }}
          >
            ← Ana sayfa
          </Link>
        </header>

        <div className="relative">
          <Image
            src="/stars.png"
            alt=""
            width={80}
            height={80}
            className="star-float pointer-events-none absolute -left-3 -top-4 h-10 w-10 opacity-60 sm:-left-6 sm:-top-6 sm:h-14 sm:w-14"
            aria-hidden="true"
          />
          <Image
            src="/stars.png"
            alt=""
            width={80}
            height={80}
            className="star-float star-float-delay-1 pointer-events-none absolute -right-3 -top-5 h-12 w-12 opacity-60 sm:-right-6 sm:-top-7 sm:h-16 sm:w-16"
            aria-hidden="true"
          />
          <Image
            src="/stars.png"
            alt=""
            width={80}
            height={80}
            className="star-float star-float-delay-2 pointer-events-none absolute -bottom-5 -right-2 hidden h-12 w-12 opacity-60 sm:block sm:-bottom-7 sm:-right-4 sm:h-16 sm:w-16"
            aria-hidden="true"
          />

          <div
            className="rounded-2xl p-6 shadow-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
              Talebiniz alındı
            </h1>
            <p className="mt-3" style={{ color: "var(--text-muted)" }}>
              Randevu talebiniz alınmıştır. Onay için sizinle iletişime geçilecektir.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 py-10" style={{ background: "var(--background)" }}>
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

      <section
        className="mt-8 rounded-2xl p-5 shadow-sm"
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

          {availableTimes.length === 0 && !loadingSlots ? (
            <div className="mt-3 rounded-2xl p-4 text-sm" style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}>
              Bu tarih için uygun saat bulunamadı.
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {availableTimes.map((t) => {
                const selected = t === selectedTime;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className="h-12 rounded-2xl px-3 text-sm font-medium shadow-sm transition"
                    style={
                      selected
                        ? { background: "var(--primary-strong)", color: "#fff", border: "1px solid var(--primary-strong)" }
                        : { background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }
                    }
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section
        className="mt-6 rounded-2xl p-5 shadow-sm"
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
          <div className="mt-4 rounded-2xl p-4 text-sm" style={{ background: "rgba(217, 154, 130, 0.18)", color: "var(--text)" }}>
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
  );
}
