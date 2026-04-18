export default function KullanimKosullariPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12">
      <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
        PATİAMO Kullanım Koşulları
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            1. Hizmet Tanımı
          </div>
          <p className="mt-2">
            PATİAMO, Bebek, Nişantaşı ve Emirgan bölgelerinde birebir köpek yürüyüş hizmeti sunar.
          </p>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            2. Kullanıcı Yükümlülükleri
          </div>
          <p className="mt-2">Kullanıcı:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Doğru ve eksiksiz bilgi vermekle yükümlüdür</li>
            <li>Köpeğin sağlık ve davranış durumunu açıkça beyan etmelidir</li>
            <li>Risk oluşturabilecek durumları gizlememelidir</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            3. Sorumluluk
          </div>
          <p className="mt-2">Eksik veya yanlış beyan sonucu oluşabilecek durumlardan kullanıcı sorumludur.</p>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            4. Hizmet Reddi
          </div>
          <p className="mt-2">Aşağıdaki durumlarda hizmet reddedilebilir:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Agresif davranış</li>
            <li>Güvenlik riski</li>
            <li>Yanlış beyan</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            5. Fikri Mülkiyet
          </div>
          <p className="mt-2">Site içeriği ve marka unsurları PATİAMO’ya aittir.</p>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            6. Değişiklik
          </div>
          <p className="mt-2">Koşullar önceden bildirilmeden güncellenebilir.</p>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            7. İletişim
          </div>
          <p className="mt-2">
            İletişim ve talepleriniz için Instagram hesabımız (@patiamo.walk) üzerinden bizimle iletişime geçebilirsiniz.
          </p>
        </section>
      </div>
    </main>
  );
}
