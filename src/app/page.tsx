import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "./Reveal";
import WalkRoutesSection from "./WalkRoutesSection";
import FooterDogWalkingEntry from "./FooterDogWalkingEntry";

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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/paw-pattern.png"
          alt=""
          width={80}
          height={80}
          className="absolute left-3 top-10 h-12 w-12 opacity-[0.08] rotate-[-14deg] sm:left-8 sm:top-14 sm:h-16 sm:w-16"
        />
        <Image
          src="/paw-pattern.png"
          alt=""
          width={90}
          height={90}
          className="absolute bottom-10 left-6 h-10 w-10 opacity-[0.07] rotate-[12deg] sm:bottom-16 sm:left-12 sm:h-14 sm:w-14"
        />

        <Image
          src="/paw-pattern.png"
          alt=""
          width={110}
          height={110}
          className="absolute right-6 top-16 hidden h-20 w-20 opacity-[0.06] rotate-[18deg] sm:block"
        />
        <Image
          src="/paw-pattern.png"
          alt=""
          width={90}
          height={90}
          className="absolute left-10 top-1/2 hidden h-14 w-14 -translate-y-1/2 opacity-[0.05] rotate-[-8deg] sm:block"
        />
        <Image
          src="/paw-pattern.png"
          alt=""
          width={100}
          height={100}
          className="absolute right-10 top-[56%] hidden h-16 w-16 -translate-y-1/2 opacity-[0.07] rotate-[6deg] sm:block"
        />
        <Image
          src="/paw-pattern.png"
          alt=""
          width={120}
          height={120}
          className="absolute bottom-10 right-12 hidden h-24 w-24 opacity-[0.06] rotate-[-16deg] sm:block"
        />
      </div>

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
              <div>PATİAMO</div>
              <div className="mt-1 text-[11px] font-normal" style={{ color: "var(--primary-strong)", opacity: 0.72 }}>
                Her adımda güven.
              </div>
            </div>
            <div className="sm:text-center" style={{ color: "var(--text-muted)" }}>
              &copy; 2026
            </div>
            <div className="space-y-2 sm:text-right" style={{ color: "var(--text-muted)" }}>
              <div>Web experience by Nurhayat Yılmaz</div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 sm:justify-end">
                <Link href="/gizlilik" className="transition hover:brightness-75">
                  Gizlilik Politikası
                </Link>
                <Link href="/kullanim-kosullari" className="transition hover:brightness-75">
                  Kullanım Koşulları
                </Link>
                <Link href="/hizmet-kosullari" className="transition hover:brightness-75">
                  Hizmet Koşulları
                </Link>
              </div>
              <div>
                <a
                  href="https://www.instagram.com/patiamo.walk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center transition hover:brightness-75"
                >
                  @patiamo.walk
                </a>
              </div>
            </div>
          </div>
          <div className="mt-3 text-center sm:text-left">
            <FooterDogWalkingEntry />
          </div>
        </div>
      </footer>
    </div>
  );
}
