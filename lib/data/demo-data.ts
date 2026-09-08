import { Mosque, Study } from '@/lib/supabase/types'
import { getTodayDateString, formatDateToYYYYMMDD } from '@/lib/utils'

export const DEMO_MOSQUES: Mosque[] = [
  {
    id: 'm-1',
    name: 'Masjid Agung Baiturrahman Banyuwangi',
    slug: 'masjid-agung-baiturrahman-banyuwangi',
    image_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    address: 'Jl. Jenderal Sudirman No. 1, Temenggungan, Kec. Banyuwangi, Kabupaten Banyuwangi',
    latitude: -8.2104,
    longitude: 114.3685,
    takmir_name: 'H. Ahmad Fauzi, S.Ag.',
    takmir_phone: '081234567891',
    routine_info: 'Kajian rutin setiap malam Ahad dan Ba\'da Subuh hari Ahad.',
  },
  {
    id: 'm-2',
    name: 'Masjid Muhammad Cheng Hoo Banyuwangi',
    slug: 'masjid-muhammad-cheng-hoo-banyuwangi',
    image_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    address: 'Jl. Jenderal Sudirman No. 88, Giri, Kec. Giri, Kabupaten Banyuwangi',
    latitude: -8.1965,
    longitude: 114.3721,
    takmir_name: 'Ust. Bambang Sutrisno',
    takmir_phone: '081398765432',
    routine_info: 'Kajian tematik muamalah dan tafsir setiap malam Kamis.',
  },
  {
    id: 'm-3',
    name: 'Masjid Besar At-Taqwa Giri',
    slug: 'masjid-besar-at-taqwa-giri',
    image_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    address: 'Jl. Hayam Wuruk No. 45, Giri, Kec. Giri, Kabupaten Banyuwangi',
    latitude: -8.2045,
    longitude: 114.3540,
    takmir_name: 'H. M. Ridwan',
    takmir_phone: '082155443322',
    routine_info: 'Kajian Fiqih Ibadah setiap malam Senin.',
  },
  {
    id: 'm-4',
    name: 'Masjid Al-Hadi Lateng',
    slug: 'masjid-al-hadi-lateng',
    image_url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    address: 'Jl. Basuki Rahmat No. 12, Lateng, Kec. Banyuwangi, Kabupaten Banyuwangi',
    latitude: -8.2012,
    longitude: 114.3735,
    takmir_name: 'Ust. Syarifuddin, Lc.',
    takmir_phone: '085233445566',
    routine_info: 'Kajian Sirah Nabawiyah & Tazkiyatun Nufus setiap malam Rabu.',
  },
  {
    id: 'm-5',
    name: 'Masjid Al-Ikhlas Rogojampi',
    slug: 'masjid-al-ikhlas-rogojampi',
    image_url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    address: 'Jl. Raya Jember No. 10, Rogojampi, Kabupaten Banyuwangi',
    latitude: -8.3021,
    longitude: 114.2987,
    takmir_name: 'H. Nurhadi',
    takmir_phone: '081987654321',
    routine_info: 'Kajian Pemuda & Keluarga Muslim setiap malam Sabtu.',
  },
  {
    id: 'm-6',
    name: 'Masjid Jami\' Baitul Muttaqin Genteng',
    slug: 'masjid-jami-baitul-muttaqin-genteng',
    image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    address: 'Jl. Gajah Mada No. 15, Genteng, Kabupaten Banyuwangi',
    latitude: -8.3612,
    longitude: 114.1523,
    takmir_name: 'Ust. H. Mansyur',
    takmir_phone: '081290876543',
    routine_info: 'Kajian Bulanan Ulama Banyuwangi & Fiqih Kontemporer.',
  },
]

// Helper to generate dynamic dates relative to today
function getDateOffset(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return formatDateToYYYYMMDD(date)
}

export function getInitialDemoStudies(): Study[] {
  const today = getTodayDateString()
  const tomorrow = getDateOffset(1)
  const in2Days = getDateOffset(2)
  const in3Days = getDateOffset(3)
  const in5Days = getDateOffset(5)

  return [
    {
      id: 's-1',
      mosque_id: 'm-1',
      title: 'Kajian Fiqih Muamalah: Meraih Keberkahan Rezeki di Era Digital',
      slug: 'kajian-fiqih-muamalah-meraih-keberkahan-rezeki',
      speaker: 'Ustadz Dr. H. Abdurrahman, M.E.I.',
      poster_url: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=800&q=80',
      description: 'Membahas prinsip-prinsip transaksi syariah, etika jual beli modern, pinjaman online, dan cara menjemput rezeki yang halal dan barakah untuk masyarakat Banyuwangi.',
      study_date: today,
      start_time: 'Ba\'da Isya (19.30 WIB)',
      mosque: DEMO_MOSQUES[0],
    },
    {
      id: 's-2',
      mosque_id: 'm-2',
      title: 'Tafsir Surat Al-Kahfi: Menjaga Iman di Tengah Fitnah Akhir Zaman',
      slug: 'tafsir-surat-al-kahfi-menjaga-iman',
      speaker: 'Ustadz Ahmad Zaki Mubarak, Lc.',
      poster_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80',
      description: 'Kajian mendalam tafsir ayat-ayat pilihan dalam Surat Al-Kahfi, menggali hikmah kisah pemuda kahfi dan petunjuk bagi generasi muda.',
      study_date: today,
      start_time: 'Ba\'da Maghrib (18.15 WIB)',
      mosque: DEMO_MOSQUES[1],
    },
    {
      id: 's-3',
      mosque_id: 'm-3',
      title: 'Kajian Akhlak & Adab Menuntut Ilmu dalam Islam',
      slug: 'kajian-akhlak-adab-menuntut-ilmu',
      speaker: 'Ustadz Muhammad Syukron, S.Pd.I.',
      poster_url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
      description: 'Membahas kitab Ta\'lim Muta\'allim tentang pentingnya adab kepada guru, orang tua, serta ketulusan niat dalam menuntut ilmu syar\'i.',
      study_date: tomorrow,
      start_time: '19.30 WIB',
      mosque: DEMO_MOSQUES[2],
    },
    {
      id: 's-4',
      mosque_id: 'm-4',
      title: 'Sirah Nabawiyah: Keteladanan Rasulullah dalam Membangun Masyarakat Madani',
      slug: 'sirah-nabawiyah-keteladanan-rasulullah',
      speaker: 'Ustadz Syarifuddin, Lc.',
      poster_url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
      description: 'Mengenal sejarah perjuangan Nabi Muhammad SAW dan para sahabat di Madinah, meneladani kehangatan persaudaraan Muhajirin dan Anshar.',
      study_date: in2Days,
      start_time: 'Ba\'da Isya (19.30 WIB)',
      mosque: DEMO_MOSQUES[3],
    },
    {
      id: 's-5',
      mosque_id: 'm-5',
      title: 'Kajian Khusus Pemuda: Menjadi Generasi Tangguh Berakhlak Qur\'ani',
      slug: 'kajian-khusus-pemuda-generasi-tangguh',
      speaker: 'Ustadz Hanif Al-Habsyi, M.Pd.',
      poster_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      description: 'Diskusi interaktif pemuda Banyuwangi tentang tantangan masa muda, produktivitas, dan peran pemuda memakmurkan masjid.',
      study_date: in3Days,
      start_time: '19.45 WIB',
      mosque: DEMO_MOSQUES[4],
    },
    {
      id: 's-6',
      mosque_id: 'm-6',
      title: 'Kajian Fiqih Kontemporer: Hukum Waris & Pembagian Harta Keluarga',
      slug: 'kajian-fiqih-kontemporer-hukum-waris',
      speaker: 'K.H. Mukhtar Syafa\'at',
      poster_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
      description: 'Penjelasan tuntas hukum faraidh (waris Islam) dengan studi kasus modern agar keluarga muslim terhindar dari sengketa.',
      study_date: in5Days,
      start_time: 'Ba\'da Subuh (05.00 WIB)',
      mosque: DEMO_MOSQUES[5],
    },
  ]
}
