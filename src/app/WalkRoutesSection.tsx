"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type LocationKey = "nisantasi" | "bebek" | "emirgan";

type LocationConfig = {
  key: LocationKey;
  title: string;
  description: string;
  mapSrc: string;
  photos: string[];
};

export default function WalkRoutesSection() {
  const locations = useMemo<LocationConfig[]>(
    () => [
      {
        key: "nisantasi",
        title: "Nişantaşı",
        description: "Sakin sokaklar ve kısa park molalarıyla şehir içi premium rota.",
        mapSrc: "/nisantasi-map.png",
        photos: ["/nisantasi-1.png", "/nisantasi-2.png"],
      },
      {
        key: "bebek",
        title: "Bebek",
        description: "Deniz havası, ferah yürüyüş ve kontrollü tempo.",
        mapSrc: "/bebek-map.png",
        photos: ["/bebek-1.png", "/bebek-2.png"],
      },
      {
        key: "emirgan",
        title: "Emirgan",
        description: "Yeşil alan yoğun, enerjiyi dengeli atan keyifli park rotası.",
        mapSrc: "/emirgan-map.png",
        photos: ["/emirgan-1.png", "/emirgan-2.png"],
      },
    ],
    [],
  );

  const [openKey, setOpenKey] = useState<LocationKey | null>(null);

  return (
    <section className="relative z-10 mt-12">
      <div className="mb-6">
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--text)", letterSpacing: "0.02em" }}
        >
          Örnek Yürüyüş Rotaları 🐾
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {locations.map((loc) => {
          const isOpen = openKey === loc.key;
          return (
            <div key={loc.key} className="sm:col-span-1">
              <button
                type="button"
                onClick={() => setOpenKey((k) => (k === loc.key ? null : loc.key))}
                className="group w-full rounded-3xl p-4 text-left shadow-sm transition"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div
                  className="overflow-hidden rounded-2xl"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <Image
                    src={loc.mapSrc}
                    alt={`${loc.title} yürüyüş haritası`}
                    width={800}
                    height={600}
                    className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {loc.title}
                    </div>
                    <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      {loc.description}
                    </div>
                  </div>

                  <div
                    className="mt-0.5 inline-flex h-7 items-center justify-center rounded-full px-2 text-[11px] font-medium"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                  >
                    {isOpen ? "Kapat" : "Görüntüle"}
                  </div>
                </div>

                <div
                  className="mt-3 text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Gerçek yürüyüş görüntüleri
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div
        className="mt-5 overflow-hidden rounded-3xl shadow-sm"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{ gridTemplateRows: openKey ? "1fr" : "0fr" }}
        >
          <div className="min-h-0">
            {openKey ? (
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  {locations
                    .find((l) => l.key === openKey)!
                    .photos.map((src) => (
                      <div
                        key={src}
                        className="group overflow-hidden rounded-2xl shadow-sm"
                        style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
                      >
                        <Image
                          src={src}
                          alt="Yürüyüş fotoğrafı"
                          width={900}
                          height={700}
                          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] sm:h-52"
                        />
                      </div>
                    ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
