import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "./Reveal";
import WalkRoutesSection from "./WalkRoutesSection";

function Paw({ className, style }: { className: string; style: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M20 27c3 0 6-4 6-8s-3-7-6-7-6 3-6 7 3 8 6 8Zm24 0c3 0 6-4 6-8s-3-7-6-7-6 3-6 7 3 8 6 8ZM14 37c3 0 5-3 5-6s-2-6-5-6-5 3-5 6 2 6 5 6Zm36 0c3 0 5-3 5-6s-2-6-5-6-5 3-5 6 2 6 5 6ZM32 56c8 0 16-6 16-13 0-6-5-10-16-10S16 37 16 43c0 7 8 13 16 13Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col" style={{ background: "var(--background)" }}>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.1,
          backgroundImage: "url('/paw-pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "130px 130px",
        }}
      />
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-6">
        <Link href="/" className="flex items-center gap-4" aria-label="PATİAMO ana sayfa">
          <Image
            src="/logo.png"
            alt="PATİAMO"
            width={400}
            height={160}
            priority
            className="h-24 w-auto sm:h-28"
          />
        </Link>
        <Link
          href="/randevu"
          className="inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-medium text-white shadow-sm transition hover:brightness-95"
          style={{ background: "var(--primary-strong)" }}
        >
          Randevu Oluştur
        </Link>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 pb-14">
        <section
          className="relative z-10 mt-8 animate-fadeInUp overflow-hidden rounded-3xl p-6 shadow-sm sm:p-10"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Paw
            className="pointer-events-none absolute -left-6 -top-6 h-14 w-14"
            style={{ color: "var(--primary-strong)", opacity: 0.08 }}
          />
          <div
            className="pointer-events-none absolute -right-16 -top-12 h-56 w-56 rounded-full"
            style={{ background: "var(--primary)", opacity: 0.12 }}
          />
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: "var(--text)" }}>
              Premium Köpek Gezdirme & Pet Bakım
            </h1>
            <p className="mt-4" style={{ color: "var(--text-muted)" }}>
              Şehir içinde güvenilir, sakin ve birebir ilgilenmeye odaklı bir hizmet. Uygun gün ve saati seçin,
              randevu talebinizi iletin.
            </p>
            <div className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
              Randevu ile çalışılır • Sınırlı sayıda köpek kabul edilir
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/randevu"
                className="inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-medium text-white shadow-sm transition hover:brightness-95"
                style={{ background: "var(--primary-strong)" }}
              >
                Randevu Oluştur
              </Link>
            </div>
          </div>
        </section>

        <section className="relative z-10 mt-10">
          <Paw
            className="pointer-events-none absolute -right-4 -top-4 hidden h-12 w-12 sm:block"
            style={{ color: "var(--primary-strong)", opacity: 0.06 }}
          />
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text)" }}>
              Nasıl Çalışır?
            </h2>
          </div>
          <div className="relative">
            <div
              className="pointer-events-none absolute left-8 right-8 top-8 hidden h-px sm:block"
              style={{ background: "var(--border)" }}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Uygun gün ve saati seçin",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9ZM6 6a1 1 0 0 0-1 1v1h14V7a1 1 0 0 0-1-1H6Z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Randevu talebinizi oluşturun",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V8h4.5L14 3.5ZM8 11a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H8Zm0 4a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2H8Z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Onay sonrası sizinle iletişime geçelim",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M20 3H4a2 2 0 0 0-2 2v14l4-3h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 11H5.3L4 15V5h16v9Z"
                      />
                    </svg>
                  ),
                },
              ].map((s, idx) => (
                <div
                  key={s.title}
                  className="relative flex h-full flex-col rounded-2xl p-5 shadow-sm"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl"
                      style={{ background: "rgba(217, 154, 130, 0.18)", color: "var(--primary-strong)" }}
                    >
                      {s.icon}
                    </div>
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#8B5C2A] text-[#FAF3EA] font-bold text-sm mr-3 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                        {s.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 mt-14">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight" style={{ color: "var(--text)", letterSpacing: "0.02em" }}>
              Hizmet Bilgileri
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal delayMs={0}>
              <div
                className="group relative overflow-hidden rounded-3xl shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:shadow-md"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
                  style={{ background: "var(--primary)", opacity: 0.12 }}
                />
                <Paw
                  className="pointer-events-none absolute -left-6 -bottom-6 h-16 w-16"
                  style={{ color: "var(--primary-strong)", opacity: 0.06 }}
                />
                <div className="p-4 sm:p-5">
                  <div className="mb-3 text-xs font-medium tracking-[0.12em] uppercase" style={{ color: "var(--primary-strong)" }}>
                    Örnek Yürüyüş Raporu
                  </div>
                  <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid var(--border)" }}>
                    <Image
                      src="/report-example.png"
                      alt="Örnek yürüyüş raporu"
                      width={1200}
                      height={900}
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={120}>
              <div
                className="group relative rounded-3xl p-6 shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:shadow-md"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <Paw
                  className="pointer-events-none absolute -right-4 -top-4 hidden h-14 w-14 sm:block"
                  style={{ color: "var(--primary-strong)", opacity: 0.05 }}
                />
                <div className="text-lg font-semibold tracking-tight" style={{ color: "var(--text)", letterSpacing: "0.01em" }}>
                  Hizmet Kapsamı
                </div>
                <div className="mt-4 space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--primary-strong)" }} />
                    <span>Planlı randevu sistemi ile düzenli ve kontrollü yürüyüş hizmeti</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--primary-strong)" }} />
                    <span>Her yürüyüş sonrası fotoğraflı bilgilendirme ve kısa rapor paylaşımı</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--primary-strong)" }} />
                    <span>Canlı konum ile şeffaf takip imkânı</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--primary-strong)" }} />
                    <span>Birebir ilgilenmeye odaklı, sakin ve güvenli yürüyüş yaklaşımı</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--primary-strong)" }} />
                    <span>Hizmet, küçük ve orta boy köpekler için planlanmaktadır</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--primary-strong)" }} />
                    <span>Nişantaşı, Bebek ve Emirgan çevresinde hizmet verilmektedir</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <WalkRoutesSection />

        <section className="relative z-10 mt-12">
          <div
            className="rounded-3xl p-6 shadow-sm sm:p-8"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  Randevu akışına geçmek için
                </div>
                <div className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                  Uygun tarih ve saatleri görüntüleyin, talebinizi iletin.
                </div>
              </div>
              <Link
                href="/randevu"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl px-6 text-sm font-medium text-white shadow-sm transition hover:brightness-95 sm:w-auto"
                style={{ background: "var(--primary-strong)" }}
              >
                Randevu Oluştur
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10" style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto w-full max-w-5xl px-5 py-6">
          <div className="grid gap-2 text-center text-xs sm:grid-cols-3 sm:items-center sm:text-left">
            <div className="font-medium" style={{ color: "var(--text)" }}>
              PATİAMO
            </div>
            <div className="sm:text-center" style={{ color: "var(--text-muted)" }}>
              &copy; 2026
            </div>
            <div className="sm:text-right" style={{ color: "var(--text-muted)" }}>
              Web experience by Nurhayat Yılmaz
            </div>
          </div>
          <div className="mt-3 text-center sm:text-left">
            <Link
              href="/admin"
              className="text-xs transition hover:brightness-75"
              style={{ color: "var(--text-muted)" }}
            >
              Yönetici Girişi
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
