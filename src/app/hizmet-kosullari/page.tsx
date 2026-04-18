export default function HizmetKosullariPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12">
      <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
        PATİAMO Hizmet Koşulları
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            1. Hizmet Kapsamı
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Köpekler belirtilen konumdan alınır ve yürüyüş sonrası aynı konuma teslim edilir</li>
            <li>Hizmet birebir sunulur</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            2. Davranış ve Güvenlik
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Köpeğin agresiflik durumu önceden bildirilmelidir</li>
            <li>Riskli durumlarda hizmet durdurulabilir</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            3. Sağlık ve Acil Durum
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Sağlık durumu önceden bildirilmelidir</li>
            <li>Acil durumlarda müdahale yapılabilir</li>
            <li>Veteriner masrafları kullanıcıya aittir</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            4. Teslim ve Erişim
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Aynı konumdan alım ve teslim yapılır</li>
            <li>Kullanıcı erişilebilir olmalıdır</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            5. Randevu ve İptal
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Randevular planlanan saatlerde gerçekleştirilir</li>
            <li>Hizmet sağlayıcı gerekli durumlarda plan değişikliği yapabilir</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            6. Hava Koşulları
          </div>
          <p className="mt-2">Aşırı hava şartlarında yürüyüş süresi kısaltılabilir veya ertelenebilir.</p>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            7. Fotoğraf ve Konum Paylaşımı
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Yürüyüş sırasında konum paylaşımı yapılabilir</li>
            <li>Yürüyüş sonrası foto/video paylaşılabilir</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            8. Fiyatlandırma
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Hizmet ücretleri site üzerinde belirtilir</li>
            <li>30 ve 60 dakika seçenekleri sunulur</li>
            <li>Fiyatlar güncellenebilir</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            9. Ödeme
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Ödeme hizmet tamamlandıktan sonra nakit olarak alınır</li>
            <li>Hizmet öncesi ödeme talep edilmez</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            10. Sorumluluk
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Hizmet makul özenle sunulur</li>
            <li>Beyan edilmeyen durumlarda sorumluluk kullanıcıya aittir</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            11. Hizmet Reddi
          </div>
          <p className="mt-2">Aşağıdaki durumlarda hizmet reddedilebilir:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Agresif davranış</li>
            <li>Güvenlik riski</li>
            <li>Yanlış bilgi</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            12. İletişim
          </div>
          <p className="mt-2">
            İletişim ve talepleriniz için Instagram hesabımız (@patiamo.walk) üzerinden bizimle iletişime geçebilirsiniz.
          </p>
        </section>
      </div>
    </main>
  );
}
