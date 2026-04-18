export default function GizlilikPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12">
      <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
        PATİAMO Gizlilik Politikası
      </h1>

      <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        PATİAMO (“Hizmet Sağlayıcı”), köpek yürüyüş hizmetleri kapsamında kullanıcıların kişisel verilerini 6698 sayılı KVKK ve
        ilgili mevzuata uygun olarak işler.
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            1. İşlenen Veriler
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Ad, soyad</li>
            <li>Telefon numarası</li>
            <li>Konum/adres bilgisi</li>
            <li>Randevu tarih ve saat bilgileri</li>
            <li>Köpeğe ilişkin bilgiler (alerji, davranış vb.)</li>
            <li>İletişim kayıtları</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            2. Veri İşleme Amaçları
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Randevu planlama</li>
            <li>Hizmetin sunulması</li>
            <li>Müşteri iletişimi</li>
            <li>Hizmet güvenliğinin sağlanması</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            3. Hukuki Sebep
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Sözleşmenin ifası</li>
            <li>Meşru menfaat</li>
          </ul>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            4. Veri Paylaşımı
          </div>
          <p className="mt-2">
            Kişisel veriler üçüncü kişilerle paylaşılmaz. Yasal zorunluluklar hariç.
          </p>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            5. Saklama Süresi
          </div>
          <p className="mt-2">Veriler yalnızca gerekli süre boyunca saklanır.</p>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            6. Veri Güvenliği
          </div>
          <p className="mt-2">Kişisel veriler makul teknik ve idari önlemlerle korunur.</p>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            7. Haklarınız
          </div>
          <p className="mt-2">KVKK kapsamında erişim, düzeltme ve silme talep edebilirsiniz.</p>
        </section>

        <section>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            8. İletişim
          </div>
          <p className="mt-2">
            İletişim ve talepleriniz için Instagram hesabımız (@patiamo.walk) üzerinden bizimle iletişime geçebilirsiniz.
          </p>
        </section>
      </div>
    </main>
  );
}
