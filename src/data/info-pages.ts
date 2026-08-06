import type { InfoPageContent } from "@/components/InfoPage";

export const INFO_PAGES: Record<string, InfoPageContent> = {
  faq: {
    title: "FAQ",
    intro: "Pertanyaan yang sering diajukan seputar belanja di PLEATSSSI Indonesia.",
    sections: [
      {
        heading: "Bagaimana cara memesan produk?",
        paragraphs: [
          "Pilih produk yang Anda inginkan, tentukan warna dan ukuran, lalu klik \"Tambahkan ke Keranjang\". Setelah selesai berbelanja, buka tas belanja di pojok kanan atas dan lanjutkan ke pembayaran.",
        ],
      },
      {
        heading: "Apakah harga sudah termasuk pajak dan bea cukai?",
        paragraphs: [
          "Ya. Semua harga yang tertera di situs sudah termasuk pajak dan bea cukai. Tidak ada biaya tersembunyi saat pembayaran.",
        ],
      },
      {
        heading: "Metode pembayaran apa saja yang diterima?",
        paragraphs: [
          "Kami menerima kartu kredit/debit (Visa, Mastercard, JCB), transfer bank, e-wallet, dan cicilan 0% melalui Atome dengan 3 kali pembayaran.",
        ],
      },
      {
        heading: "Bagaimana cara melacak pesanan saya?",
        paragraphs: [
          "Setelah pesanan dikirim, Anda akan menerima email berisi nomor resi. Masukkan nomor resi tersebut di halaman Pengiriman & Pelacakan untuk melihat status pengiriman.",
        ],
      },
      {
        heading: "Apakah saya bisa mengubah atau membatalkan pesanan?",
        paragraphs: [
          "Perubahan atau pembatalan dapat dilakukan selama pesanan belum diproses. Segera hubungi tim layanan pelanggan kami di customer_care@ptkcg.co.id dengan mencantumkan nomor pesanan Anda.",
        ],
      },
      {
        heading: "Apakah produk dijamin asli?",
        paragraphs: [
          "Seluruh produk yang dijual di situs ini adalah produk resmi PLEATSSSI dan 100% asli.",
        ],
      },
    ],
  },
  "pengiriman-pelacakan": {
    title: "Pengiriman & Pelacakan",
    intro: "Informasi biaya, estimasi waktu pengiriman, dan cara melacak pesanan Anda.",
    sections: [
      {
        heading: "Biaya Pengiriman",
        paragraphs: [
          "Gratis pengiriman untuk area JABODETABEK. Untuk wilayah lain di Indonesia, biaya pengiriman dihitung berdasarkan tujuan dan ditampilkan saat checkout.",
          "Anda juga dapat memilih opsi ambil di toko (click & collect) tanpa biaya di toko PLEATSSSI pilihan.",
        ],
      },
      {
        heading: "Estimasi Waktu Pengiriman",
        paragraphs: [
          "JABODETABEK: 1-3 hari kerja.",
          "Pulau Jawa: 2-5 hari kerja.",
          "Luar Pulau Jawa: 5-10 hari kerja.",
          "Estimasi dihitung sejak pesanan dikonfirmasi dan tidak termasuk hari libur nasional.",
        ],
      },
      {
        heading: "Melacak Pesanan",
        paragraphs: [
          "Setelah pesanan dikirim, nomor resi akan dikirimkan ke email Anda. Gunakan nomor resi tersebut untuk melacak status pengiriman melalui situs mitra logistik kami.",
          "Jika pesanan belum tiba setelah estimasi berakhir, hubungi customer_care@ptkcg.co.id.",
        ],
      },
    ],
  },
  pengembalian: {
    title: "Pengembalian",
    intro: "Pengembalian tanpa repot dalam waktu 30 hari pemesanan.",
    sections: [
      {
        heading: "Kebijakan Pengembalian",
        paragraphs: [
          "Anda dapat mengajukan pengembalian dalam waktu 30 hari sejak tanggal penerimaan. Produk harus dalam kondisi belum digunakan, dengan label dan kemasan asli masih terpasang lengkap.",
          "Produk sale dengan diskon di atas 30% bersifat final sale dan tidak dapat dikembalikan, kecuali terdapat cacat produksi.",
        ],
      },
      {
        heading: "Cara Mengajukan Pengembalian",
        paragraphs: [
          "1. Hubungi customer_care@ptkcg.co.id dengan mencantumkan nomor pesanan dan alasan pengembalian.",
          "2. Tim kami akan mengirimkan instruksi dan label pengiriman pengembalian.",
          "3. Kirimkan produk dalam kemasan aslinya. Setelah produk kami terima dan lolos pemeriksaan, proses pengembalian dana akan dimulai.",
        ],
      },
      {
        heading: "Pengembalian Dana",
        paragraphs: [
          "Dana akan dikembalikan ke metode pembayaran awal dalam waktu 7-14 hari kerja setelah produk pengembalian lolos pemeriksaan kualitas.",
        ],
      },
      {
        heading: "Penukaran",
        paragraphs: [
          "Penukaran ukuran atau warna dapat dilakukan di toko PLEATSSSI terdekat dengan membawa bukti pembelian, selama stok tersedia.",
        ],
      },
    ],
  },
  "panduan-ukuran": {
    title: "Panduan Ukuran",
    intro: "Temukan ukuran yang paling pas untuk Anda.",
    sections: [
      {
        heading: "Ukuran Sepatu (Wanita)",
        paragraphs: [
          "EU 35 = 22.5 cm | EU 36 = 23.0 cm | EU 37 = 23.5 cm | EU 38 = 24.0 cm | EU 39 = 24.5 cm | EU 40 = 25.0 cm",
          "Ukur kaki Anda dari tumit hingga ujung jari terpanjang dalam keadaan berdiri. Jika berada di antara dua ukuran, kami sarankan memilih satu ukuran lebih besar.",
        ],
      },
      {
        heading: "Ukuran Tas",
        paragraphs: [
          "S: tas mini dan micro â€” muat ponsel, card holder, dan lipstik.",
          "M: ukuran sedang â€” muat dompet panjang, ponsel, power bank, dan botol minum kecil.",
          "XL: tote dan tas besar â€” muat laptop 13 inci, dokumen A4, dan perlengkapan harian lainnya.",
        ],
      },
      {
        heading: "One Size",
        paragraphs: [
          "Produk dengan label ONE SIZE (dompet, charm, kacamata, dan aksesori) hanya tersedia dalam satu ukuran standar. Dimensi lengkap tercantum di halaman masing-masing produk.",
        ],
      },
    ],
  },
  "hubungi-kami": {
    title: "Hubungi Kami",
    intro: "Tim layanan pelanggan kami siap membantu Anda.",
    sections: [
      {
        heading: "Layanan Pelanggan",
        paragraphs: [
          "Email: customer_care@ptkcg.co.id",
          "Jam operasional: Senin - Jumat, 09.00 - 18.00 WIB (tidak termasuk hari libur nasional).",
          "Mohon cantumkan nomor pesanan Anda agar kami dapat membantu lebih cepat.",
        ],
      },
      {
        heading: "Media Sosial",
        paragraphs: [
          "Anda juga dapat menghubungi kami melalui Instagram @pleatsssi atau Facebook PLEATSSSI Indonesia untuk pertanyaan umum seputar produk dan promo.",
        ],
      },
      {
        heading: "Kantor",
        paragraphs: [
          "PT KCG Indonesia, Jakarta Selatan, DKI Jakarta, Indonesia.",
        ],
      },
    ],
  },
  "lokasi-toko": {
    title: "Lokasi Toko",
    intro: "Kunjungi toko PLEATSSSI terdekat di kota Anda.",
    sections: [
      {
        heading: "Jakarta",
        paragraphs: [
          "Plaza Indonesia â€” Jl. M.H. Thamrin Kav. 28-30, Lantai 2. Buka setiap hari 10.00 - 22.00 WIB.",
          "Grand Indonesia â€” Jl. M.H. Thamrin No. 1, Skybridge Lantai 2. Buka setiap hari 10.00 - 22.00 WIB.",
          "Senayan City â€” Jl. Asia Afrika Lot 19, Lantai 1. Buka setiap hari 10.00 - 22.00 WIB.",
          "Pondok Indah Mall 2 â€” Jl. Metro Pondok Indah, Lantai 1. Buka setiap hari 10.00 - 22.00 WIB.",
        ],
      },
      {
        heading: "Tangerang & Bekasi",
        paragraphs: [
          "Summarecon Mall Serpong â€” Jl. Boulevard Gading Serpong, Lantai 1. Buka setiap hari 10.00 - 22.00 WIB.",
          "Summarecon Mall Bekasi â€” Jl. Boulevard Ahmad Yani, Lantai 1. Buka setiap hari 10.00 - 22.00 WIB.",
        ],
      },
      {
        heading: "Surabaya",
        paragraphs: [
          "Tunjungan Plaza 4 â€” Jl. Jend. Basuki Rachmat No. 8-12, Lantai 1. Buka setiap hari 10.00 - 22.00 WIB.",
        ],
      },
      {
        heading: "Layanan di Toko",
        paragraphs: [
          "Ambil pesanan online di toko (click & collect), penukaran ukuran, dan konsultasi gaya dengan tim kami tersedia di seluruh lokasi.",
        ],
      },
    ],
  },
  "perawatan-produk": {
    title: "Perawatan Produk",
    intro: "Panduan merawat produk PLEATSSSI agar tetap awet dan tampak baru.",
    sections: [
      {
        heading: "Tas & Dompet",
        paragraphs: [
          "Simpan tas dalam dust bag dan isi dengan kertas agar bentuknya tetap terjaga. Hindari menggantung tas dengan talinya untuk waktu yang lama.",
          "Bersihkan noda segera dengan kain lembut yang kering. Untuk bahan kulit sintetis, gunakan kain yang sedikit lembap lalu keringkan segera.",
        ],
      },
      {
        heading: "Sepatu",
        paragraphs: [
          "Bersihkan sol dan bagian atas secara berkala dengan kain lembut. Gunakan shoe tree atau isi dengan kertas untuk menjaga bentuk.",
          "Jauhkan dari air dan simpan di tempat yang kering dan sejuk, jauh dari sinar matahari langsung.",
        ],
      },
      {
        heading: "Perhiasan & Aksesori",
        paragraphs: [
          "Lepaskan sebelum mandi, berenang, atau berolahraga. Hindari kontak dengan parfum, lotion, dan bahan kimia.",
          "Simpan terpisah di dalam kotak atau kantong lembut untuk menghindari goresan.",
        ],
      },
    ],
  },
  "terms-of-use": {
    title: "Terms of Use",
    intro: "Terakhir diperbarui: 4 Agustus 2026.",
    sections: [
      {
        heading: "Penerimaan Syarat",
        paragraphs: [
          "Dengan mengakses dan menggunakan situs PLEATSSSI Indonesia, Anda menyetujui syarat dan ketentuan penggunaan ini. Jika Anda tidak menyetujui syarat ini, mohon hentikan penggunaan situs.",
        ],
      },
      {
        heading: "Akun & Keamanan",
        paragraphs: [
          "Anda bertanggung jawab menjaga kerahasiaan akun dan kata sandi Anda. Seluruh aktivitas yang terjadi melalui akun Anda menjadi tanggung jawab Anda.",
        ],
      },
      {
        heading: "Informasi Produk & Harga",
        paragraphs: [
          "Kami berupaya menampilkan warna, detail, dan harga produk seakurat mungkin. Harga yang tertera sudah termasuk pajak dan bea cukai, dan dapat berubah sewaktu-waktu tanpa pemberitahuan.",
        ],
      },
      {
        heading: "Kekayaan Intelektual",
        paragraphs: [
          "Seluruh konten situs â€” termasuk logo, teks, foto, dan desain â€” adalah milik PLEATSSSI dan dilindungi undang-undang kekayaan intelektual. Dilarang menggunakan konten tanpa izin tertulis.",
        ],
      },
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    intro: "Terakhir diperbarui: 4 Agustus 2026.",
    sections: [
      {
        heading: "Data yang Kami Kumpulkan",
        paragraphs: [
          "Kami mengumpulkan data yang Anda berikan saat berbelanja atau membuat akun, seperti nama, alamat email, nomor telepon, alamat pengiriman, dan informasi pembayaran.",
        ],
      },
      {
        heading: "Penggunaan Data",
        paragraphs: [
          "Data Anda digunakan untuk memproses pesanan, mengirimkan pembaruan status pengiriman, memberikan layanan pelanggan, dan â€” dengan persetujuan Anda â€” mengirimkan info promo dan koleksi terbaru.",
        ],
      },
      {
        heading: "Perlindungan Data",
        paragraphs: [
          "Kami menerapkan langkah keamanan teknis dan organisasi untuk melindungi data Anda dari akses tidak sah. Informasi pembayaran diproses melalui penyedia pembayaran yang terenkripsi.",
        ],
      },
      {
        heading: "Hak Anda",
        paragraphs: [
          "Anda berhak mengakses, memperbaiki, atau menghapus data pribadi Anda kapan saja melalui pengaturan akun atau dengan menghubungi customer_care@ptkcg.co.id.",
        ],
      },
    ],
  },
  "cookies-policy": {
    title: "Cookies Policy",
    intro: "Terakhir diperbarui: 4 Agustus 2026.",
    sections: [
      {
        heading: "Apa Itu Cookie",
        paragraphs: [
          "Cookie adalah file teks kecil yang disimpan di perangkat Anda saat mengunjungi situs kami. Cookie membantu situs mengingat preferensi dan aktivitas Anda.",
        ],
      },
      {
        heading: "Jenis Cookie yang Kami Gunakan",
        paragraphs: [
          "Cookie esensial: diperlukan agar situs berfungsi, misalnya untuk tas belanja dan proses checkout.",
          "Cookie preferensi: mengingat bahasa, wilayah, dan pengaturan tampilan Anda.",
          "Cookie analitik: membantu kami memahami cara pengunjung menggunakan situs agar kami dapat terus meningkatkan pengalaman belanja.",
        ],
      },
      {
        heading: "Mengelola Cookie",
        paragraphs: [
          "Anda dapat mengatur atau menghapus cookie melalui pengaturan browser. Menonaktifkan cookie esensial dapat memengaruhi fungsi tertentu, seperti tas belanja dan login.",
        ],
      },
    ],
  },
};
