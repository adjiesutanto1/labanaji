-- ==========================================================
-- SEED DATA: Authentic Banyuwangi Mosques & Study Schedules
-- ==========================================================

-- Insert Mosques
INSERT INTO public.mosques (id, name, slug, image_url, address, latitude, longitude, takmir_name, takmir_phone, routine_info)
VALUES
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c01',
    'Masjid Agung Baiturrahman Banyuwangi',
    'masjid-agung-baiturrahman-banyuwangi',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    'Jl. Jenderal Sudirman No. 1, Temenggungan, Kec. Banyuwangi, Kabupaten Banyuwangi',
    -8.2104000,
    114.3685000,
    'H. Ahmad Fauzi, S.Ag.',
    '081234567891',
    'Kajian rutin setiap malam Ahad dan Ba''da Subuh hari Ahad.'
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c02',
    'Masjid Muhammad Cheng Hoo Banyuwangi',
    'masjid-muhammad-cheng-hoo-banyuwangi',
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    'Jl. Jenderal Sudirman No. 88, Giri, Kec. Giri, Kabupaten Banyuwangi',
    -8.1965000,
    114.3721000,
    'Ust. Bambang Sutrisno',
    '081398765432',
    'Kajian tematik muamalah dan tafsir setiap malam Kamis.'
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c03',
    'Masjid Besar At-Taqwa Giri',
    'masjid-besar-at-taqwa-giri',
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    'Jl. Hayam Wuruk No. 45, Giri, Kec. Giri, Kabupaten Banyuwangi',
    -8.2045000,
    114.3540000,
    'H. M. Ridwan',
    '082155443322',
    'Kajian Fiqih Ibadah setiap malam Senin.'
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c04',
    'Masjid Al-Hadi Lateng',
    'masjid-al-hadi-lateng',
    'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    'Jl. Basuki Rahmat No. 12, Lateng, Kec. Banyuwangi, Kabupaten Banyuwangi',
    -8.2012000,
    114.3735000,
    'Ust. Syarifuddin, Lc.',
    '085233445566',
    'Kajian Sirah Nabawiyah & Tazkiyatun Nufus setiap malam Rabu.'
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c05',
    'Masjid Al-Ikhlas Rogojampi',
    'masjid-al-ikhlas-rogojampi',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    'Jl. Raya Jember No. 10, Rogojampi, Kabupaten Banyuwangi',
    -8.3021000,
    114.2987000,
    'H. Nurhadi',
    '081987654321',
    'Kajian Pemuda & Keluarga Muslim setiap malam Sabtu.'
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c06',
    'Masjid Jami'' Baitul Muttaqin Genteng',
    'masjid-jami-baitul-muttaqin-genteng',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    'Jl. Gajah Mada No. 15, Genteng, Kabupaten Banyuwangi',
    -8.3612000,
    114.1523000,
    'Ust. H. Mansyur',
    '081290876543',
    'Kajian Bulanan Ulama Banyuwangi & Fiqih Kontemporer.'
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert Initial Studies
INSERT INTO public.studies (id, mosque_id, title, slug, speaker, poster_url, description, study_date, start_time)
VALUES
  (
    'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d01',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c01',
    'Kajian Fiqih Muamalah: Meraih Keberkahan Rezeki di Era Digital',
    'kajian-fiqih-muamalah-meraih-keberkahan-rezeki',
    'Ustadz Dr. H. Abdurrahman, M.E.I.',
    'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=800&q=80',
    'Membahas prinsip-prinsip transaksi syariah, etika jual beli modern, pinjaman online, dan cara menjemput rezeki yang halal dan barakah untuk masyarakat Banyuwangi.',
    CURRENT_DATE,
    'Ba''da Isya (19.30 WIB)'
  ),
  (
    'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d02',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c02',
    'Tafsir Surat Al-Kahfi: Menjaga Iman di Tengah Fitnah Akhir Zaman',
    'tafsir-surat-al-kahfi-menjaga-iman',
    'Ustadz Ahmad Zaki Mubarak, Lc.',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80',
    'Kajian mendalam tafsir ayat-ayat pilihan dalam Surat Al-Kahfi, menggali hikmah kisah pemuda kahfi dan petunjuk bagi generasi muda.',
    CURRENT_DATE,
    'Ba''da Maghrib (18.15 WIB)'
  ),
  (
    'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d03',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c03',
    'Kajian Akhlak & Adab Menuntut Ilmu dalam Islam',
    'kajian-akhlak-adab-menuntut-ilmu',
    'Ustadz Muhammad Syukron, S.Pd.I.',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    'Membahas kitab Ta''lim Muta''allim tentang pentingnya adab kepada guru, orang tua, serta ketulusan niat dalam menuntut ilmu syar''i.',
    CURRENT_DATE + INTERVAL '1 day',
    '19.30 WIB'
  ),
  (
    'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d04',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c04',
    'Sirah Nabawiyah: Keteladanan Rasulullah dalam Membangun Masyarakat Madani',
    'sirah-nabawiyah-keteladanan-rasulullah',
    'Ustadz Syarifuddin, Lc.',
    'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    'Mengenal sejarah perjuangan Nabi Muhammad SAW dan para sahabat di Madinah, meneladani kehangatan persaudaraan Muhajirin dan Anshar.',
    CURRENT_DATE + INTERVAL '2 days',
    'Ba''da Isya (19.30 WIB)'
  ),
  (
    'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d05',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c05',
    'Kajian Khusus Pemuda: Menjadi Generasi Tangguh Berakhlak Qur''ani',
    'kajian-khusus-pemuda-generasi-tangguh',
    'Ustadz Hanif Al-Habsyi, M.Pd.',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    'Diskusi interaktif pemuda Banyuwangi tentang tantangan masa muda, produktivitas, dan peran pemuda memakmurkan masjid.',
    CURRENT_DATE + INTERVAL '3 days',
    '19.45 WIB'
  ),
  (
    'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d06',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c06',
    'Kajian Fiqih Kontemporer: Hukum Waris & Pembagian Harta Keluarga',
    'kajian-fiqih-kontemporer-hukum-waris',
    'K.H. Mukhtar Syafa''at',
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
    'Penjelasan tuntas hukum faraidh (waris Islam) dengan studi kasus modern agar keluarga muslim terhindar dari sengketa.',
    CURRENT_DATE + INTERVAL '5 days',
    'Ba''da Subuh (05.00 WIB)'
  )
ON CONFLICT (slug) DO NOTHING;
