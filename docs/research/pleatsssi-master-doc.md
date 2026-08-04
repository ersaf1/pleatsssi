





**PLEATSSSI**


**MASTER TECHNICAL DOCUMENTATION**
*Official Brand Website & E-Commerce Platform*








Versi Dokumen: 2.0 (Perluasan Teknis)
Diturunkan dari: Pleatsssi Master Documentation v1.0
Untuk: Tim Pengembang (Frontend, Backend, QA, DevOps)


## **Tentang Dokumen Ini**

Dokumen ini merupakan perluasan teknis dari Pleatsssi Master Documentation v1.0. Struktur asli (PRD, Architecture, Design System, Database Schema, Development Rules) dipertahankan sepenuhnya, dan setiap bagian diperdalam dengan spesifikasi yang dapat langsung digunakan oleh tim pengembang untuk implementasi — mencakup detail skema database lengkap, spesifikasi endpoint API, component-level design system, panduan keamanan, panduan performa, dan panduan deployment.


### **Daftar Bab**


| Bab | Judul |
| --- | --- |
| Bab 1 | Product Requirements Document (PRD) |
| Bab 2 | Arsitektur Sistem |
| Bab 3 | Struktur Folder |
| Bab 4 | Skema Database |
| Bab 5 | Spesifikasi API |
| Bab 6 | Sistem Desain (Design System) |
| Bab 7 | Aturan & Standar Pengembangan |
| Bab 8 | Panduan Implementasi Keamanan |
| Bab 9 | Panduan Optimasi Performa |
| Bab 10 | Panduan Deployment |
| Bab 11 | Roadmap Fitur Masa Depan |


**CARA MENGGUNAKAN DOKUMEN INI**  Dokumen ini dirancang sebagai rujukan (reference), bukan urutan baca linear wajib. Tim frontend dapat langsung merujuk Bab 2.2, 3.1, 5, dan 6. Tim backend dapat langsung merujuk Bab 2.3–2.7, 3.2, 4, 5, dan 8. Seluruh tim disarankan membaca Bab 1 (PRD) terlebih dahulu untuk memahami konteks produk secara menyeluruh.


# **DAFTAR ISI**




# **BAB 1 — PRODUCT REQUIREMENTS DOCUMENT (PRD)**


## **1.1 Ringkasan Eksekutif**

Pleatsssi adalah brand fashion wanita asal Indonesia yang saat ini menjual produk melalui Instagram dan marketplace pihak ketiga. Dokumen ini menguraikan kebutuhan produk, arsitektur teknis, skema database, spesifikasi API, sistem desain, serta standar pengembangan untuk membangun Pleatsssi Official Website — sebuah platform e-commerce brand-owned yang menggabungkan identitas visual premium dengan pengalaman belanja yang cepat, modern, dan mudah digunakan.
Dokumen ini ditujukan terutama untuk tim pengembang (frontend engineer, backend engineer, QA, dan DevOps) sebagai rujukan tunggal (single source of truth) selama proses desain teknis dan implementasi. Setiap bagian dirancang agar cukup detail untuk langsung diterjemahkan menjadi task development, tanpa memerlukan banyak asumsi tambahan di lapangan.
**CATATAN**  Dokumen ini merupakan turunan dan perluasan dari PRD ringkas yang telah disusun sebelumnya. Struktur asli (goal, background, vision, mission, target audience, persona, customer journey, features) dipertahankan, namun setiap bagian diperdalam dengan detail teknis dan operasional yang dibutuhkan tim development.

## **1.2 Tujuan Proyek (Project Goal)**

Membangun website resmi Pleatsssi sebagai pusat identitas brand sekaligus platform penjualan online yang menghadirkan pengalaman belanja premium, modern, cepat, dan mudah digunakan.
Secara spesifik, website ini bertujuan untuk:
- Memperkuat branding — menghadirkan identitas visual dan tone brand yang konsisten di seluruh titik interaksi pelanggan, lepas dari batasan template marketplace.
- Menjual produk secara langsung — menyediakan kanal penjualan first-party yang memberi kontrol penuh atas harga, promosi, dan data transaksi.
- Meningkatkan kepercayaan pelanggan — melalui desain profesional, informasi produk yang transparan, serta proses checkout dan pembayaran yang aman.
- Mengurangi ketergantungan pada marketplace — memindahkan sebagian volume transaksi dan basis pelanggan ke kanal yang dimiliki brand secara langsung.
- Menampilkan koleksi secara lebih eksklusif — memberi ruang kurasi produk yang tidak dibatasi oleh format katalog marketplace generik.

## **1.3 Latar Belakang (Background)**

Saat ini Pleatsssi menjual produk melalui Instagram dan marketplace. Model ini efektif untuk menjangkau audiens awal, namun memiliki sejumlah keterbatasan struktural yang menjadi alasan utama pembangunan website ini:

#### **1.3.1 Branding Mengikuti Marketplace**

Tampilan halaman produk, tipografi, tata letak, dan elemen visual lainnya mengikuti desain sistem marketplace, bukan identitas Pleatsssi. Akibatnya, diferensiasi visual brand terhadap kompetitor menjadi minim.

#### **1.3.2 Tidak Memiliki Identitas Digital Sendiri**

Tanpa domain dan platform sendiri, Pleatsssi tidak memiliki "rumah digital" yang sepenuhnya merepresentasikan brand — mulai dari storytelling, katalog, hingga proses transaksi.

#### **1.3.3 Sulit Membangun Customer Experience**

Marketplace membatasi kustomisasi alur belanja, notifikasi, dan komunikasi pasca-pembelian, sehingga sulit merancang pengalaman pelanggan yang konsisten dengan nilai premium brand.

#### **1.3.4 Customer Lebih Mengingat Marketplace Dibanding Brand**

Karena transaksi terjadi di dalam ekosistem marketplace, top-of-mind pelanggan cenderung mengarah ke nama marketplace, bukan ke Pleatsssi sebagai brand.

## **1.4 Visi (Vision)**

Menjadi fashion brand Indonesia yang memiliki pengalaman belanja premium melalui website resmi — di mana setiap kunjungan, mulai dari landing page hingga after-sales, mencerminkan kualitas dan karakter brand secara konsisten.

## **1.5 Misi (Mission)**

- Menampilkan identitas brand yang profesional melalui desain visual, konten, dan interaksi yang konsisten.
- Memudahkan pelanggan membeli produk melalui alur navigasi, pencarian, dan checkout yang sederhana serta minim friksi.
- Memberikan pengalaman belanja premium lewat kecepatan situs, kualitas visual, dan detail interaksi (micro-interaction, animasi halus, dsb).
- Menampilkan katalog yang eksklusif dengan kurasi koleksi, filter yang relevan, serta storytelling produk yang khas Pleatsssi.

## **1.6 Target Audience**


| Atribut | Deskripsi |
| --- | --- |
| Gender | Perempuan |
| Usia | 20–35 Tahun |
| Aktivitas Digital | Aktif di Instagram, terbiasa berbelanja melalui aplikasi mobile |
| Preferensi Fashion | Mengikuti tren fashion terkini, menyukai desain minimalis dan elegan |
| Perilaku Belanja | Senang berbelanja online, membandingkan produk sebelum membeli |
| Prioritas | Mementingkan kualitas pakaian, bahan, dan kesesuaian ukuran |


Implikasi terhadap desain produk: karena target audiens sangat aktif di perangkat mobile dan platform visual (Instagram), website harus dirancang dengan pendekatan mobile-first, memiliki kualitas fotografi produk yang tinggi, serta waktu muat halaman yang cepat agar tidak kehilangan minat calon pembeli yang terbiasa dengan scrolling cepat.

## **1.7 User Persona**


### **1.7.1 Customer — "Sarah"**


| Atribut | Detail |
| --- | --- |
| Nama | Sarah |
| Umur | 24 Tahun |
| Pekerjaan | Karyawan Swasta |
| Perangkat Utama | Smartphone (asumsi utama), sesekali laptop saat di kantor |


Goals (Tujuan):
- Membeli outfit modern yang sesuai tren terkini.
- Checkout cepat — proses dari keranjang ke pembayaran tidak lebih dari beberapa langkah.
- Mudah memilih ukuran yang tepat tanpa perlu bertanya ke admin.
Pain Points (Hambatan saat ini):
- Sulit melihat detail produk — informasi bahan, dimensi, dan perawatan sering tidak lengkap.
- Foto kurang jelas — sudut foto terbatas, tidak ada zoom yang memadai.
- Size chart membingungkan — tidak ada panduan ukuran yang kontekstual per produk.
**IMPLIKASI DESAIN**  Detail produk harus menyediakan galeri multi-sudut dengan fitur zoom, size chart interaktif per kategori produk, serta informasi bahan dan perawatan yang terstruktur — bukan hanya deskripsi paragraf bebas.

### **1.7.2 Owner (Pemilik Brand)**

Tugas utama pada sistem:
- Upload produk baru beserta variannya (warna, ukuran, gambar).
- Mengatur harga jual dan harga diskon.
- Mengatur stok per varian produk.
- Melihat ringkasan dan detail penjualan (dashboard analitik).
- Membuat promo (banner, kupon, diskon musiman).
Owner membutuhkan akses penuh ke seluruh modul admin, termasuk laporan finansial dan pengaturan tingkat sistem yang tidak tersedia untuk role Admin biasa.

### **1.7.3 Admin (Operasional Harian)**

Tugas utama pada sistem:
- Memproses order yang masuk (verifikasi pembayaran, persiapan pengiriman).
- Mengubah status pesanan (pending → diproses → dikirim → selesai).
- Mengelola voucher/kupon yang aktif.
- Mengelola stok berdasarkan hasil packing/quality-check harian.
Admin memiliki akses operasional harian namun dibatasi dari fungsi sensitif seperti laporan finansial menyeluruh atau manajemen user berlevel Owner (lihat 5.6 Role-Based Access Control untuk detail matriks izin).

## **1.8 Customer Journey**

Alur perjalanan pelanggan berikut memetakan setiap titik interaksi dari kesadaran awal (Instagram) hingga pasca-pembelian (review). Setiap tahap disertai catatan kebutuhan teknis dan UX yang relevan untuk implementasi.

| Tahap | Deskripsi | Catatan Teknis/UX |
| --- | --- | --- |
| 1. Instagram | Titik masuk utama (traffic source) — bio link atau story swipe-up mengarah ke landing page atau halaman produk spesifik. | UTM tracking pada tautan Instagram untuk mengukur konversi per campaign. |
| 2. Landing Page | Halaman pertama yang dilihat pengunjung — hero banner, koleksi unggulan, dan value proposition brand. | Waktu muat < 2.5 detik (LCP); hero image dioptimasi (WebP/AVIF). |
| 3. Browse Collection | Pengunjung menjelajah katalog, menggunakan filter kategori/warna/ukuran/harga. | Filter harus dapat dikombinasikan dan hasilnya ter-update tanpa reload penuh (client-side fetch). |
| 4. Product Detail | Melihat detail produk: galeri gambar, deskripsi, bahan, size chart, review. | Galeri multi-gambar dengan zoom; related product di bagian bawah. |
| 5. Choose Size | Memilih ukuran dan varian warna sebelum menambahkan ke keranjang. | Validasi ketersediaan stok per kombinasi varian secara real-time. |
| 6. Add to Cart | Produk ditambahkan ke keranjang belanja. | Optimistic UI update + toast konfirmasi; cart persisten (localStorage/DB jika login). |
| 7. Checkout | Mengisi alamat pengiriman, memilih kurir, menerapkan kupon. | Form checkout single-page dengan validasi inline per field. |
| 8. Payment | Menyelesaikan pembayaran melalui Midtrans (kartu, e-wallet, VA, dsb). | Redirect/Snap popup Midtrans; webhook menangani update status otomatis. |
| 9. Tracking Order | Memantau status pesanan setelah pembayaran berhasil. | Halaman order history dengan status timeline visual. |
| 10. Receive Product | Produk diterima secara fisik oleh pelanggan. | Status otomatis/manual diubah ke "Selesai" oleh Admin atau webhook kurir (jika tersedia). |
| 11. Leave Review | Pelanggan memberikan rating dan komentar pada produk yang dibeli. | Review hanya dapat diberikan oleh pembeli terverifikasi (order status = selesai). |



## **1.9 Spesifikasi Fitur Lengkap**

Bagian ini menjabarkan setiap fitur dari daftar fitur PRD asli menjadi spesifikasi yang dapat langsung dieksekusi, mencakup deskripsi, user story, dan acceptance criteria. Detail teknis implementasi (endpoint, skema data) dirujuk ke Bab 4 (Database Schema) dan Bab 5 (API Specification).

### **1.9.1 Homepage**


#### **Hero Banner**

Banner utama full-width di bagian teratas homepage, menampilkan visual kampanye atau koleksi terbaru dengan CTA (call-to-action) menuju halaman koleksi terkait.
***User Story:*** *Sebagai pengunjung baru, saya ingin langsung melihat visual brand yang kuat saat membuka website, sehingga saya memahami identitas dan penawaran utama Pleatsssi dalam hitungan detik.*
**Acceptance Criteria:**
- Banner mendukung minimal 1 dan maksimal 5 slide (carousel) yang dapat diatur Admin/Owner.
- Setiap slide memiliki gambar, judul, subjudul opsional, dan tombol CTA dengan tautan yang dapat dikonfigurasi.
- Auto-rotate setiap 5 detik dengan kontrol manual (dot indicator + swipe/arrow).
- Gambar banner responsif (versi desktop dan mobile terpisah) dan lazy-loaded kecuali slide pertama (eager load untuk LCP).


#### **Featured Collection**

Bagian yang menyoroti koleksi kurasi tertentu (misalnya koleksi musiman) dalam bentuk grid produk.
***User Story:*** *Sebagai pengunjung, saya ingin melihat koleksi pilihan brand tanpa harus mencarinya sendiri di seluruh katalog.*
**Acceptance Criteria:**
- Menampilkan 4–8 produk dalam grid responsif (2 kolom mobile, 4 kolom desktop).
- Koleksi dapat dikonfigurasi Owner melalui admin panel (pilih produk manual atau berdasarkan tag koleksi).
- Tautan "Lihat Semua" mengarah ke halaman koleksi/kategori terkait.


#### **Best Seller**

Menampilkan produk dengan jumlah penjualan tertinggi dalam periode tertentu (misalnya 30 hari terakhir).
***User Story:*** *Sebagai pengunjung yang ragu memilih, saya ingin tahu produk apa yang paling banyak dibeli, agar saya lebih percaya diri saat memilih.*
**Acceptance Criteria:**
- Data diambil otomatis dari agregasi order_items berdasarkan jumlah unit terjual.
- Periode agregasi dapat dikonfigurasi (default 30 hari).
- Fallback: jika data penjualan kosong (situs baru), tampilkan produk terbaru sebagai pengganti.


#### **New Arrival**

Menampilkan produk yang baru ditambahkan ke katalog, diurutkan berdasarkan tanggal publish terbaru.
***User Story:*** *Sebagai pengunjung yang sering mengecek website, saya ingin cepat menemukan produk baru tanpa harus mencari di seluruh katalog.*
**Acceptance Criteria:**
- Menampilkan produk dengan status "published" diurutkan created_at DESC.
- Label "New" ditampilkan pada produk yang dipublish dalam 14 hari terakhir (dapat dikonfigurasi).


#### **Promo Banner**

Banner sekunder (biasanya di tengah halaman) untuk mempromosikan diskon, kupon, atau event tertentu.
***User Story:*** *Sebagai pengunjung, saya ingin mengetahui promo yang sedang berlangsung agar dapat memanfaatkannya sebelum berakhir.*
**Acceptance Criteria:**
- Dapat menampilkan countdown timer opsional untuk promo dengan batas waktu.
- Tautan banner dapat mengarah ke halaman koleksi, produk spesifik, atau halaman kupon.


#### **Instagram Feed**

Menampilkan grid post Instagram terbaru dari akun resmi Pleatsssi untuk memperkuat kredibilitas sosial (social proof).
***User Story:*** *Sebagai pengunjung, saya ingin melihat konten Instagram brand langsung di website agar saya yakin brand ini aktif dan memiliki audiens nyata.*
**Acceptance Criteria:**
- Menampilkan minimal 6 post terbaru dalam grid.
- Setiap thumbnail dapat diklik dan mengarah ke post asli di Instagram (tab baru).
- Jika API Instagram tidak tersedia/limit tercapai, tampilkan fallback statis (gambar terakhir yang di-cache).


#### **Newsletter**

Form pendaftaran email untuk menerima update produk dan promo.
***User Story:*** *Sebagai pengunjung yang tertarik namun belum siap membeli, saya ingin mendaftar newsletter agar tidak ketinggalan info promo berikutnya.*
**Acceptance Criteria:**
- Validasi format email di sisi client dan server.
- Mencegah duplikasi pendaftaran (unique constraint pada kolom email).
- Menampilkan pesan sukses/gagal yang jelas setelah submit.


### **1.9.2 Product**


#### **Search**

Pencarian produk berdasarkan kata kunci (nama produk, kategori, atau tag).
***User Story:*** *Sebagai pengunjung yang sudah tahu apa yang dicari, saya ingin langsung mengetik nama produk dan menemukannya tanpa perlu browsing manual.*
**Acceptance Criteria:**
- Hasil pencarian muncul sebagai suggestion dropdown setelah 2+ karakter diketik (debounce 300ms).
- Pencarian mencocokkan nama produk, deskripsi, dan nama kategori (case-insensitive).
- Halaman hasil pencarian penuh menampilkan jumlah total hasil dan dapat dikombinasikan dengan filter.


#### **Filter**

Kombinasi filter kategori, warna, ukuran, dan rentang harga pada halaman katalog/pencarian.
***User Story:*** *Sebagai pengunjung, saya ingin mempersempit pilihan produk berdasarkan kriteria spesifik agar tidak perlu scroll seluruh katalog.*
**Acceptance Criteria:**
- Filter dapat dikombinasikan (misalnya kategori=dress + warna=hitam + ukuran=M).
- State filter tercermin di URL query params agar dapat dibagikan/bookmark.
- Jumlah hasil produk pada setiap opsi filter ditampilkan (misalnya "Hitam (12)").


#### **Category**

Navigasi produk berdasarkan kategori (misalnya Dress, Blouse, Outer, Rok).
***User Story:*** *Sebagai pengunjung, saya ingin menjelajah produk berdasarkan jenis pakaian yang saya cari.*
**Acceptance Criteria:**
- Kategori mendukung struktur hierarkis (kategori utama dan sub-kategori) — lihat skema tabel categories di Bab 4.
- Halaman kategori menampilkan breadcrumb navigasi.


#### **Color**

Varian warna produk yang dapat dipilih pada halaman detail dan digunakan sebagai filter.
***User Story:*** *Sebagai pengunjung, saya ingin melihat produk yang sama dalam warna berbeda tanpa harus membuka halaman terpisah.*
**Acceptance Criteria:**
- Swatch warna ditampilkan sebagai lingkaran kecil dengan warna aktual atau pola tekstur.
- Memilih warna memperbarui galeri gambar produk sesuai varian (jika gambar per-varian tersedia).


#### **Size**

Varian ukuran produk (S, M, L, XL, dsb) dengan validasi ketersediaan stok.
***User Story:*** *Sebagai pengunjung, saya ingin tahu ukuran mana saja yang masih tersedia sebelum menambahkan ke keranjang.*
**Acceptance Criteria:**
- Ukuran yang stoknya habis ditampilkan namun dalam keadaan disabled (strikethrough) — bukan dihilangkan.
- Size chart terkait kategori produk dapat diakses melalui link/modal pada bagian pemilihan ukuran.


#### **Price**

Menampilkan harga jual, harga coret (jika diskon), dan persentase diskon.
***User Story:*** *Sebagai pengunjung, saya ingin segera tahu apakah produk sedang diskon dan berapa besar penghematannya.*
**Acceptance Criteria:**
- Jika discount > 0, tampilkan harga asli (strikethrough) dan harga setelah diskon secara berdampingan.
- Badge persentase diskon dihitung otomatis dari price dan discount.


#### **Review**

Rating bintang dan komentar dari pembeli terverifikasi pada halaman detail produk.
***User Story:*** *Sebagai calon pembeli, saya ingin membaca pengalaman pembeli lain sebelum memutuskan membeli produk.*
**Acceptance Criteria:**
- Menampilkan rata-rata rating dan distribusi jumlah rating per bintang (1–5).
- Review hanya dapat ditulis oleh user dengan order berstatus "selesai" untuk produk terkait (mencegah fake review).
- Mendukung pagination/"load more" untuk daftar review panjang.


#### **Related Product**

Rekomendasi produk terkait pada halaman detail produk, berdasarkan kategori atau tag yang sama.
***User Story:*** *Sebagai pengunjung yang sedang melihat satu produk, saya ingin diberi saran produk serupa agar lebih mudah menemukan pilihan lain.*
**Acceptance Criteria:**
- Menampilkan 4–8 produk dari kategori yang sama, mengecualikan produk yang sedang dilihat.
- Jika produk dalam kategori yang sama tidak cukup, lengkapi dengan produk populer lain sebagai fallback.



### **1.9.3 Shopping**


#### **Cart**

Keranjang belanja yang menyimpan produk beserta varian dan jumlah yang dipilih pengguna.
***User Story:*** *Sebagai pengunjung, saya ingin mengumpulkan beberapa produk sebelum checkout sekaligus, dan dapat mengubah jumlah/menghapus item dengan mudah.*
**Acceptance Criteria:**
- Cart untuk guest disimpan di localStorage; setelah login, cart guest digabungkan (merge) dengan cart milik akun.
- Perubahan jumlah item memicu validasi stok real-time (tidak dapat melebihi stok tersedia).
- Subtotal dihitung dan diperbarui otomatis setiap ada perubahan item.


#### **Checkout**

Proses pengisian alamat pengiriman, metode pengiriman, dan ringkasan pesanan sebelum pembayaran.
***User Story:*** *Sebagai pembeli, saya ingin proses checkout singkat dan jelas, tanpa langkah yang bertele-tele.*
**Acceptance Criteria:**
- Form checkout dalam satu halaman (single-page checkout) dengan section: alamat, metode pengiriman, ringkasan, kupon.
- Validasi inline per field (misalnya nomor telepon, kode pos) sebelum submit.
- Menampilkan estimasi ongkos kirim berdasarkan kurir dan alamat tujuan.


#### **Coupon**

Penerapan kode kupon/voucher untuk mendapatkan potongan harga pada saat checkout.
***User Story:*** *Sebagai pembeli yang memiliki kode promo, saya ingin memasukkan kode tersebut dan langsung melihat potongan harganya.*
**Acceptance Criteria:**
- Validasi kupon mencakup: masa berlaku, minimum pembelian, kuota penggunaan, dan status aktif.
- Pesan error spesifik ditampilkan jika kupon tidak valid (misalnya "Kupon sudah kedaluwarsa" vs "Minimum belanja belum tercapai").
- Diskon dari kupon ditampilkan sebagai baris terpisah pada ringkasan order (bukan digabung ke harga produk).


#### **Wishlist**

Daftar produk yang ditandai untuk dibeli/dipantau di lain waktu.
***User Story:*** *Sebagai pengunjung, saya ingin menyimpan produk yang saya suka tanpa harus membelinya sekarang.*
**Acceptance Criteria:**
- Wishlist memerlukan login (tidak tersedia untuk guest, berbeda dengan cart).
- Toggle ikon hati pada product card dan halaman detail untuk menambah/menghapus dari wishlist.
- Halaman wishlist menampilkan status stok terkini setiap produk yang disimpan.


#### **Order Tracking**

Halaman untuk memantau status pesanan yang sedang berjalan.
***User Story:*** *Sebagai pembeli, saya ingin tahu sejauh mana proses pesanan saya tanpa harus menghubungi admin.*
**Acceptance Criteria:**
- Status order mengikuti alur: Pending → Diproses → Dikirim → Selesai (atau Dibatalkan) — lihat 4.6 untuk enum status detail.
- Timeline visual menampilkan tahap yang sudah dan belum dilalui beserta timestamp.
- Nomor resi (jika tersedia) ditampilkan dengan tautan ke halaman pelacakan kurir eksternal.


### **1.9.4 User**


#### **Register**

Pendaftaran akun baru menggunakan email/password atau Google Login.
***User Story:*** *Sebagai pengunjung baru, saya ingin membuat akun dengan cepat agar dapat menyimpan alamat dan melacak pesanan saya.*
**Acceptance Criteria:**
- Validasi password minimum (lihat 8.1 Aturan Validasi Password).
- Verifikasi email dikirim setelah registrasi (opsional untuk MVP, direkomendasikan untuk versi lanjutan).
- Registrasi via Google Login otomatis mengisi nama dan email dari profil Google.


#### **Login**

Masuk ke akun menggunakan email/password atau Google Login.
***User Story:*** *Sebagai pengguna terdaftar, saya ingin masuk dengan cepat untuk melanjutkan belanja atau melihat riwayat pesanan.*
**Acceptance Criteria:**
- Rate limiting pada endpoint login untuk mencegah brute-force (lihat Bab 8 — Security).
- Pesan error generik ("Email atau password salah") — tidak membedakan apakah email tidak terdaftar atau password salah, demi keamanan.


#### **Profile**

Halaman untuk melihat dan mengubah data pribadi pengguna (nama, email, nomor telepon, foto).
***User Story:*** *Sebagai pengguna, saya ingin memperbarui data diri saya agar informasi kontak selalu akurat.*
**Acceptance Criteria:**
- Perubahan email memerlukan verifikasi ulang (jika verifikasi email diaktifkan).
- Upload foto profil dibatasi ukuran dan format file (lihat 8.5 — Validasi Upload File).


#### **Address**

Manajemen alamat pengiriman (dapat menyimpan lebih dari satu alamat).
***User Story:*** *Sebagai pengguna yang sering mengirim ke lokasi berbeda, saya ingin menyimpan beberapa alamat dan memilih salah satu saat checkout.*
**Acceptance Criteria:**
- Mendukung penanda "alamat utama" (default address) yang otomatis terpilih saat checkout.
- Validasi field alamat: nama penerima, telepon, provinsi, kota, kecamatan, kode pos, detail alamat.


#### **Order History**

Daftar seluruh pesanan yang pernah dibuat pengguna beserta statusnya.
***User Story:*** *Sebagai pengguna, saya ingin melihat riwayat pembelian saya, termasuk pesanan yang sudah lama selesai.*
**Acceptance Criteria:**
- Mendukung filter berdasarkan status order dan rentang tanggal.
- Setiap item riwayat dapat diklik untuk melihat detail lengkap order.



### **1.9.5 Admin**


#### **Dashboard**

Ringkasan metrik utama: total penjualan, jumlah order, produk terlaris, dan grafik tren penjualan.
***User Story:*** *Sebagai Owner/Admin, saya ingin melihat kondisi bisnis secara sekilas begitu masuk ke panel admin.*
**Acceptance Criteria:**
- Menampilkan filter rentang tanggal (hari ini, 7 hari, 30 hari, custom range).
- Grafik tren penjualan menggunakan library chart (misalnya Recharts) dengan data harian.
- Kartu ringkasan menampilkan: total revenue, total order, order pending, produk stok rendah.


#### **Product Management**

CRUD (create, read, update, delete) produk beserta varian, gambar, harga, dan stok.
***User Story:*** *Sebagai Owner, saya ingin menambahkan produk baru lengkap dengan foto dan variannya secara efisien.*
**Acceptance Criteria:**
- Form produk mendukung multi-upload gambar dengan preview dan opsi drag-to-reorder.
- Manajemen varian (kombinasi warna x ukuran) dengan stok per kombinasi.
- Soft delete produk (bukan hard delete) agar data historis order tetap konsisten.


#### **Category**

CRUD kategori dan sub-kategori produk.
***User Story:*** *Sebagai Owner, saya ingin mengelola struktur kategori agar katalog tetap terorganisir.*
**Acceptance Criteria:**
- Kategori dengan produk terkait tidak dapat dihapus langsung — sistem menampilkan peringatan dan meminta pemindahan produk terlebih dahulu.


#### **Orders**

Melihat daftar order masuk, detail order, dan mengubah status order.
***User Story:*** *Sebagai Admin, saya ingin memproses order secara efisien tanpa harus membuka banyak halaman.*
**Acceptance Criteria:**
- Filter berdasarkan status, tanggal, dan metode pembayaran.
- Perubahan status order tercatat dalam log (siapa yang mengubah dan kapan) — lihat 4.9 order_status_logs.


#### **Customers**

Melihat daftar pelanggan terdaftar beserta ringkasan aktivitas belanja mereka.
***User Story:*** *Sebagai Owner, saya ingin mengenali pelanggan loyal berdasarkan riwayat transaksi mereka.*
**Acceptance Criteria:**
- Menampilkan total order dan total belanja per pelanggan.
- Admin dapat melihat detail namun tidak dapat mengubah data pribadi pelanggan secara langsung.


#### **Reports**

Laporan penjualan, produk terlaris, dan performa kupon dalam rentang waktu tertentu.
***User Story:*** *Sebagai Owner, saya ingin mengekspor laporan penjualan untuk keperluan pembukuan/analisis bisnis.*
**Acceptance Criteria:**
- Mendukung ekspor laporan ke format CSV/Excel.
- Laporan dapat difilter berdasarkan kategori produk dan rentang tanggal.


#### **Banner**

Manajemen banner untuk hero section dan promo banner homepage.
***User Story:*** *Sebagai Owner, saya ingin mengganti banner promosi tanpa perlu bantuan developer.*
**Acceptance Criteria:**
- Mendukung penjadwalan banner (tanggal mulai dan berakhir tayang).
- Preview banner sebelum dipublikasikan.


#### **Coupons**

Manajemen kode kupon: nominal/persentase diskon, syarat minimum, masa berlaku, dan kuota.
***User Story:*** *Sebagai Owner, saya ingin membuat kupon promo dengan syarat spesifik untuk kampanye marketing tertentu.*
**Acceptance Criteria:**
- Mendukung dua tipe diskon: nominal tetap (fixed amount) dan persentase.
- Validasi agar kode kupon unik dan tidak bentrok dengan kupon aktif lain.



# **BAB 2 — ARSITEKTUR SISTEM**


## **2.1 Gambaran Umum Arsitektur**

Pleatsssi menggunakan arsitektur decoupled (terpisah) antara frontend dan backend, berkomunikasi melalui REST API. Pendekatan ini dipilih karena memberikan fleksibilitas deployment independen, memungkinkan frontend di-hosting pada platform edge/CDN (Vercel) untuk performa optimal, sementara backend berjalan pada VPS dengan kontrol penuh atas environment (Docker).

| Layer | Teknologi | Peran |
| --- | --- | --- |
| Frontend | React + TypeScript + Vite + Tailwind CSS | Antarmuka pengguna (customer-facing) dan admin panel |
| Backend | Laravel 12 (REST API) | Business logic, autentikasi, validasi, orkestrasi data |
| Database | PostgreSQL | Penyimpanan data relasional utama |
| Storage | Supabase Storage | Penyimpanan file (gambar produk, banner, foto profil) |
| Auth | Email/Password + Google OAuth | Autentikasi pengguna |
| Payment | Midtrans (Snap) | Gateway pembayaran |
| Deployment (FE) | Vercel | Hosting frontend dengan CDN global |
| Deployment (BE) | Docker di VPS | Hosting backend API |


### **2.1.1 Alur Data**

Alur data antar layer arsitektur digambarkan secara deskriptif sebagai berikut:
- Client (browser/mobile) mengakses aplikasi React yang di-hosting di Vercel melalui CDN edge terdekat.
- Aplikasi React melakukan HTTP request (via service layer) ke Laravel API yang berjalan pada Docker container di VPS.
- Laravel API memvalidasi request, menjalankan business logic melalui Service/Repository layer, lalu berinteraksi dengan PostgreSQL untuk operasi data.
- Untuk operasi file (upload gambar produk, dsb), Laravel API berkomunikasi dengan Supabase Storage melalui SDK/HTTP client, dan menyimpan URL hasil upload ke PostgreSQL.
- Untuk proses pembayaran, Laravel API membuat transaksi ke Midtrans dan mengembalikan Snap token/redirect URL ke frontend. Midtrans mengirimkan notifikasi status pembayaran secara asynchronous melalui webhook ke endpoint khusus di Laravel API.
- Response API dikembalikan ke frontend dalam format JSON terstandarisasi (lihat 5.1 Format Response API).

## **2.2 Frontend Architecture**


### **2.2.1 Tech Stack Frontend**


| Teknologi | Versi/Catatan | Fungsi |
| --- | --- | --- |
| React | 18.x / 19.x | Library UI berbasis komponen |
| TypeScript | Strict mode aktif | Type safety di seluruh codebase |
| Vite | Build tool | Dev server cepat (HMR) dan bundling produksi |
| Tailwind CSS | Utility-first CSS | Styling konsisten dengan design token brand |
| React Router | Client-side routing | Navigasi antar halaman tanpa reload penuh |
| TanStack Query | Server state management | Caching, refetching, dan sinkronisasi data API |
| Zustand / Context API | Client state management | State lokal seperti cart, UI toggle, filter aktif |
| React Hook Form + Zod | Form handling & validasi | Validasi form sisi client yang konsisten dengan backend |
| Axios | HTTP client | Komunikasi dengan Laravel API melalui service layer |

**REKOMENDASI**  TanStack Query direkomendasikan untuk seluruh data yang berasal dari server (produk, order, dsb) agar caching dan invalidasi otomatis konsisten, sementara Zustand/Context digunakan khusus untuk state UI murni seperti status modal terbuka/tertutup atau filter yang belum di-submit.

### **2.2.2 Prinsip Konfigurasi Build**

Konfigurasi Vite proyek menetapkan path alias (@/ mengarah ke folder src/) agar import antar file tidak berantakan dengan relative path panjang, serta memisahkan bundle produksi menjadi beberapa chunk (vendor React terpisah dari library data-fetching) agar browser dapat meng-cache masing-masing chunk secara independen antar deployment. Pada mode development, request ke /api diteruskan (proxy) ke backend lokal agar frontend dan backend dapat dikembangkan bersamaan tanpa masalah CORS.

### **2.2.3 Pemetaan Design Token ke Tailwind**

Warna, radius, spacing, durasi animasi, dan tipografi dari Design System (Bab 6) dipetakan langsung ke konfigurasi tema Tailwind sebagai satu sumber kebenaran, bukan ditulis sebagai nilai hardcoded berulang di setiap komponen. Dengan pendekatan ini, perubahan token brand di masa depan (misalnya penyesuaian warna aksen) cukup dilakukan di satu tempat dan otomatis konsisten di seluruh aplikasi.

### **2.2.4 Service Layer Pattern (Frontend)**

Seluruh komunikasi dengan API wajib melalui service layer (lihat aturan "Semua API melalui service layer" pada Bab 7), dengan pola sebagai berikut:
- Satu instance HTTP client terpusat dikonfigurasi dengan base URL dari environment variable dan timeout standar, digunakan oleh seluruh service — bukan membuat instance baru di setiap file.
- Request interceptor menyisipkan token autentikasi (Bearer token) secara otomatis ke setiap request yang memerlukan login, sehingga komponen tidak perlu menangani header secara manual.
- Response interceptor memantau status 401 (token kedaluwarsa/tidak valid) secara terpusat untuk memicu proses re-autentikasi atau redirect ke halaman login.
- Setiap domain data (produk, cart, order, dsb) memiliki file service tersendiri yang mengekspos fungsi-fungsi bertipe jelas (misalnya productService.list(), productService.detail()), memetakan langsung ke endpoint terkait pada Bab 5.

## **2.3 Backend Architecture**


### **2.3.1 Tech Stack Backend**


| Komponen | Detail |
| --- | --- |
| Framework | Laravel 12 (PHP 8.3+) |
| Arsitektur API | RESTful, versioned (/api/v1/...) |
| Autentikasi API | Laravel Sanctum (token-based, cocok untuk SPA + mobile) |
| ORM | Eloquent |
| Validasi | Form Request classes per endpoint |
| Queue | Laravel Queue (database/redis driver) untuk job asinkron (email, webhook processing) |
| Cache | Redis (direkomendasikan) atau file cache untuk skala kecil |
| Testing | PHPUnit / Pest untuk unit dan feature test |


### **2.3.2 Layered Architecture (Backend)**

Backend mengikuti pola layered architecture untuk memisahkan tanggung jawab dan memudahkan pengujian:

| Layer | Tanggung Jawab | Lokasi (Folder) |
| --- | --- | --- |
| Controller | Menerima request, memanggil Service, mengembalikan Response. Tidak berisi business logic. | app/Http/Controllers/Api |
| Form Request | Validasi input request sebelum mencapai Controller. | app/Http/Requests |
| Service | Business logic inti (misalnya proses checkout, kalkulasi diskon). | app/Services |
| Repository | Abstraksi query database, memisahkan Eloquent dari Service. | app/Repositories |
| Model | Representasi tabel database dan relasi Eloquent. | app/Models |
| Resource | Transformasi Model menjadi JSON response terstandarisasi. | app/Http/Resources |
| Job | Proses asinkron (kirim email, proses webhook). | app/Jobs |
| Policy | Otorisasi akses berbasis role/ownership. | app/Policies |

Contoh alur satu request "Checkout" melewati layer-layer di atas:
- Controller menerima request yang sudah tervalidasi oleh Form Request (memastikan alamat, kurir, dan format data lain sudah benar sebelum diproses lebih lanjut).
- Controller meneruskan data tervalidasi ke Service checkout, tanpa mengetahui detail implementasi di dalamnya.
- Service checkout menghitung subtotal, menerapkan kupon (jika ada) melalui Service kupon terpisah, memvalidasi ketersediaan stok melalui Repository produk, lalu membuat record order melalui Repository order — seluruhnya dibungkus dalam satu database transaction agar tidak ada perubahan data yang "setengah jadi" jika salah satu langkah gagal.
- Service checkout memanggil Service Midtrans untuk membuat transaksi pembayaran dan mendapatkan Snap token.
- Controller mengembalikan response terstandarisasi (melalui Resource) yang menyertakan snap_token untuk diproses lebih lanjut oleh frontend.

## **2.4 Database — PostgreSQL**

PostgreSQL dipilih sebagai database utama karena keandalannya dalam menjaga integritas data relasional (ACID compliance), dukungan tipe data lanjutan (JSONB untuk data semi-terstruktur seperti snapshot alamat pada order), serta performa query yang baik untuk beban baca yang didominasi oleh katalog produk dan pencarian.
Skema lengkap seluruh tabel, kolom, tipe data, dan relasi dijabarkan secara rinci pada Bab 4 — Database Schema.

## **2.5 Storage — Supabase Storage**

Seluruh file (gambar produk, banner, foto profil pengguna) disimpan di Supabase Storage, bukan di server aplikasi, agar backend tetap stateless dan mudah di-scale secara horizontal.

### **2.5.1 Struktur Bucket**


| Bucket | Akses | Isi |
| --- | --- | --- |
| product-images | Public read | Gambar produk dan varian |
| banners | Public read | Gambar hero banner dan promo banner |
| avatars | Public read (per file, nama ter-obfuscate) | Foto profil pengguna |
| reviews | Public read | Foto yang dilampirkan pengguna pada review (fitur lanjutan) |


### **2.5.2 Alur Upload File**

- Frontend meminta signed upload URL dari Laravel API (bukan upload langsung dari client ke Supabase) agar validasi tipe/ukuran file tetap terjadi di backend.
- Laravel API memvalidasi metadata file (ekstensi, ukuran maksimum — lihat 8.5), lalu menggunakan Supabase SDK/HTTP API untuk mengunggah file dari server.
- Setelah upload berhasil, Laravel API menyimpan public URL hasil upload ke kolom terkait (misalnya product_images.image_url).
- Response dikembalikan ke frontend dengan URL final gambar untuk ditampilkan.
**CATATAN KEAMANAN**  Upload difilter berdasarkan MIME type asli file (bukan hanya ekstensi nama file) untuk mencegah upload file berbahaya yang disamarkan sebagai gambar.

## **2.6 Autentikasi**


### **2.6.1 Email/Password Authentication**

Menggunakan Laravel Sanctum untuk autentikasi berbasis token, cocok untuk arsitektur SPA yang terpisah dari backend.
Alur registrasi dan login:
- User mengisi form registrasi (nama, email, password, konfirmasi password).
- Frontend mengirim data registrasi ke endpoint pendaftaran (lihat 5.3).
- Backend memvalidasi (email unik, password memenuhi kebijakan — lihat 8.1), meng-hash password dengan bcrypt, dan membuat record users.
- Backend membuat Sanctum token dan mengembalikannya bersama data user.
- Frontend menyimpan token (memory + httpOnly cookie direkomendasikan untuk refresh token, atau localStorage dengan mitigasi XSS ketat untuk access token — lihat 8.2).
- Untuk login, alur serupa namun memverifikasi password yang dikirim terhadap hash tersimpan.

### **2.6.2 Google Login (OAuth 2.0)**

Menggunakan Laravel Socialite di sisi backend untuk menangani pertukaran token OAuth dengan Google.
- Frontend mengarahkan user ke endpoint redirect Google (lihat 5.3), yang meneruskan ke halaman consent Google.
- Setelah user menyetujui, Google mengarahkan kembali ke endpoint callback dengan authorization code.
- Backend menukar code dengan access token Google, mengambil profil user (email, nama, foto).
- Backend mencari user berdasarkan email: jika sudah ada, login user tersebut; jika belum, buat user baru dengan google_id tersimpan dan password null/random (user ini hanya dapat login via Google kecuali mengatur password secara manual di halaman profil).
- Backend membuat Sanctum token dan mengembalikan redirect ke frontend dengan token (melalui query param sementara atau postMessage, lalu segera disimpan dan URL dibersihkan).

## **2.7 Payment — Midtrans**

Midtrans Snap digunakan sebagai payment gateway karena mendukung berbagai metode pembayaran populer di Indonesia (kartu kredit, e-wallet, virtual account, dsb) dalam satu integrasi.

### **2.7.1 Alur Pembayaran**

- Setelah order dibuat (status: pending), backend memanggil Midtrans Snap API untuk membuat transaksi, mengirimkan order_id, gross_amount, dan item_details.
- Midtrans mengembalikan snap_token, yang diteruskan backend ke frontend.
- Frontend memanggil Snap.js untuk menampilkan popup pembayaran Midtrans menggunakan snap_token tersebut.
- User menyelesaikan pembayaran melalui metode pilihannya di dalam popup Midtrans.
- Midtrans mengirimkan HTTP notification (webhook) secara asynchronous ke endpoint webhook Laravel dengan status transaksi.
- Backend memvalidasi signature notifikasi (lihat 2.7.2), lalu memperbarui payment_status dan status pada tabel orders serta payments.
- Jika pembayaran berhasil, backend memicu job asinkron untuk mengirim email konfirmasi ke user.

### **2.7.2 Validasi Signature Webhook**

Setiap notifikasi dari Midtrans wajib divalidasi menggunakan signature key untuk memastikan request benar-benar berasal dari Midtrans, bukan pihak ketiga yang mencoba memalsukan status pembayaran. Signature dihitung dengan menggabungkan order_id, status_code, gross_amount, dan server key rahasia, lalu di-hash menggunakan SHA-512. Hasil hash tersebut dibandingkan dengan signature_key yang dikirim Midtrans pada payload menggunakan perbandingan constant-time (agar tidak rentan terhadap timing attack) — bukan perbandingan string biasa.
**PENTING**  Webhook handler HARUS menolak request (HTTP 403) jika signature tidak valid, dan TIDAK BOLEH mengubah status order berdasarkan payload yang gagal validasi signature, sekalipun payload tersebut tampak "sukses".

### **2.7.3 Status Mapping Midtrans**


| Status Midtrans | Payment Status Internal | Aksi Sistem |
| --- | --- | --- |
| capture / settlement | paid | Update order.status → processing, kirim email konfirmasi |
| pending | pending | Tidak ada perubahan, tunggu notifikasi berikutnya |
| deny | failed | Update order.status → cancelled, kembalikan stok (restock) |
| expire | expired | Update order.status → cancelled, kembalikan stok (restock) |
| cancel | cancelled | Update order.status → cancelled, kembalikan stok (restock) |
| refund | refunded | Update order.status → refunded, catat di log |



## **2.8 Deployment Topology**


### **2.8.1 Frontend — Vercel**

- Setiap push ke branch main memicu production deployment otomatis.
- Setiap pull request memicu preview deployment dengan URL unik untuk keperluan review.
- Environment variables (VITE_API_BASE_URL, VITE_GOOGLE_CLIENT_ID, dsb) dikonfigurasi melalui dashboard Vercel, dipisahkan antara Production dan Preview.
- Vercel menyediakan CDN global secara otomatis, sehingga aset statis (JS, CSS, gambar hasil build) dilayani dari edge node terdekat pengguna.

### **2.8.2 Backend — Docker di VPS**

Backend Laravel di-containerize menggunakan Docker agar environment konsisten antara development, staging, dan production. Image aplikasi dibangun dari base PHP-FPM dengan ekstensi yang dibutuhkan (koneksi PostgreSQL dan pemrosesan file zip), dependency Composer diinstal dalam mode produksi (tanpa package development), dan konfigurasi/route Laravel di-cache di dalam image untuk mempercepat waktu boot.
Susunan container yang dijalankan bersama (melalui Docker Compose) terdiri dari empat layanan:
- app — container aplikasi Laravel (PHP-FPM), menyimpan folder storage sebagai volume persisten agar file yang di-generate (log, cache) tidak hilang saat container di-restart.
- nginx — reverse proxy yang menerima traffic HTTP/HTTPS dari luar dan meneruskannya ke container app.
- db — instance PostgreSQL dengan volume persisten terpisah, agar data tidak hilang saat container di-rebuild.
- redis — digunakan untuk cache dan queue backend.
Seluruh kredensial (database, layanan pihak ketiga) disuntikkan melalui file environment variable, tidak pernah ditulis langsung ke dalam image.

### **2.8.3 Reverse Proxy & SSL**

Nginx bertindak sebagai reverse proxy di depan container Laravel (PHP-FPM), menangani terminasi SSL (melalui Let’s Encrypt/Certbot) dan meneruskan request ke aplikasi. Seluruh traffic HTTP diarahkan otomatis (redirect) ke HTTPS agar tidak ada komunikasi yang tidak terenkripsi ke backend.

### **2.8.4 CI/CD (Rekomendasi)**

Pipeline CI/CD sederhana menggunakan GitHub Actions untuk backend, memastikan setiap perubahan diuji sebelum di-deploy:
- Trigger: push ke branch main atau merge pull request.
- Install dependency dan jalankan test suite backend secara otomatis.
- Jika seluruh test lolos, build image Docker terbaru dan simpan ke registry (misalnya GitHub Container Registry).
- Terhubung ke VPS melalui SSH menggunakan kredensial yang disimpan sebagai secret CI (bukan hardcoded), lalu tarik image terbaru dan jalankan rolling update pada container yang sedang berjalan.
- Jalankan migrasi database secara otomatis sebagai bagian akhir dari proses deploy.


# **BAB 3 — STRUKTUR FOLDER**

Struktur folder berikut memperluas struktur dasar dari PRD asli (src/components, features, hooks, pages, services, types, lib, assets) menjadi struktur lengkap yang mencakup frontend maupun backend, beserta penjelasan fungsi setiap folder.

## **3.1 Struktur Folder Frontend**

pleatsssi-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/            # Gambar statis (logo, ilustrasi)
│   │   └── fonts/              # Font lokal (jika tidak via Google Fonts)
│   │
│   ├── components/             # Komponen UI generik, dapat dipakai ulang
│   │   ├── ui/                 # Primitif: Button, Input, Badge, Modal, dsb
│   │   ├── layout/              # Navbar, Footer, Sidebar (admin)
│   │   └── common/               # ProductCard, PriceTag, RatingStars, dsb
│   │
│   ├── features/                # Modul per domain bisnis (feature-based)
│   │   ├── auth/
│   │   │   ├── components/       # LoginForm, RegisterForm, GoogleButton
│   │   │   ├── hooks/            # useLogin, useRegister
│   │   │   └── types.ts
│   │   ├── product/
│   │   │   ├── components/       # ProductGallery, SizeSelector, ReviewList
│   │   │   ├── hooks/            # useProductDetail, useProductFilter
│   │   │   └── types.ts
│   │   ├── cart/
│   │   │   ├── components/       # CartDrawer, CartItem
│   │   │   ├── hooks/            # useCart
│   │   │   └── store.ts          # Zustand store khusus cart
│   │   ├── checkout/
│   │   │   ├── components/       # AddressForm, ShippingSelector, CouponInput
│   │   │   └── hooks/            # useCheckout
│   │   ├── order/
│   │   │   ├── components/       # OrderTimeline, OrderCard
│   │   │   └── hooks/            # useOrderHistory, useOrderDetail
│   │   ├── wishlist/
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── product-management/
│   │       ├── order-management/
│   │       ├── customer-management/
│   │       ├── reports/
│   │       ├── banner-management/
│   │       └── coupon-management/
│   │
│   ├── hooks/                    # Hooks lintas-fitur (bukan spesifik satu domain)
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── pages/                     # Komponen halaman (dipetakan ke route)
│   │   ├── HomePage.tsx
│   │   ├── CollectionPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── OrderHistoryPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboardPage.tsx
│   │       ├── AdminProductListPage.tsx
│   │       └── ...
│   │
│   ├── routes/                     # Konfigurasi React Router
│   │   ├── index.tsx
│   │   ├── PrivateRoute.tsx         # Guard untuk halaman yang butuh login
│   │   └── AdminRoute.tsx            # Guard untuk halaman admin (role check)
│   │
│   ├── services/                     # Service layer — SATU-SATUNYA titik akses API
│   │   ├── api.ts                     # Axios instance + interceptor
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── category.service.ts
│   │   ├── cart.service.ts
│   │   ├── checkout.service.ts
│   │   ├── order.service.ts
│   │   ├── wishlist.service.ts
│   │   ├── review.service.ts
│   │   ├── user.service.ts
│   │   └── admin/
│   │       ├── admin-product.service.ts
│   │       ├── admin-order.service.ts
│   │       └── ...
│   │
│   ├── types/                         # Definisi TypeScript (interface, type)
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   └── api.ts                      # Tipe generik untuk response API
│   │
│   ├── lib/                             # Utilitas murni, tidak bergantung React
│   │   ├── formatCurrency.ts
│   │   ├── formatDate.ts
│   │   └── validators.ts
│   │
│   ├── store/                            # Global state (jika terpisah dari features)
│   │   └── authStore.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                          # Tailwind base + custom global style
│
├── .env.example
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts

### **3.1.1 Penjelasan Prinsip Struktur Frontend**

- components/ vs features/: components/ berisi elemen UI murni tanpa pengetahuan tentang domain bisnis (misalnya Button tidak tahu apa itu "produk"). features/ berisi komponen yang secara eksplisit terikat pada satu domain bisnis (misalnya ProductGallery tahu bentuk data produk).
- services/ sebagai satu-satunya titik akses API: komponen dan hooks TIDAK BOLEH memanggil axios/fetch secara langsung. Semua request harus melalui fungsi di services/, agar endpoint, header, dan error handling terpusat.
- routes/ terpisah dari pages/: pages/ berisi tampilan, routes/ berisi konfigurasi path dan guard akses (PrivateRoute, AdminRoute), sehingga logika proteksi route tidak tercampur dengan logika tampilan.


## **3.2 Struktur Folder Backend (Laravel)**

pleatsssi-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── V1/
│   │   │       │   ├── Auth/
│   │   │       │   │   ├── LoginController.php
│   │   │       │   │   ├── RegisterController.php
│   │   │       │   │   └── GoogleAuthController.php
│   │   │       │   ├── ProductController.php
│   │   │       │   ├── CategoryController.php
│   │   │       │   ├── CartController.php
│   │   │       │   ├── CheckoutController.php
│   │   │       │   ├── OrderController.php
│   │   │       │   ├── WishlistController.php
│   │   │       │   ├── ReviewController.php
│   │   │       │   ├── UserController.php
│   │   │       │   ├── AddressController.php
│   │   │       │   └── Admin/
│   │   │       │       ├── DashboardController.php
│   │   │       │       ├── ProductManagementController.php
│   │   │       │       ├── OrderManagementController.php
│   │   │       │       ├── CustomerController.php
│   │   │       │       ├── ReportController.php
│   │   │       │       ├── BannerController.php
│   │   │       │       └── CouponController.php
│   │   │       └── Webhook/
│   │   │           └── MidtransWebhookController.php
│   │   │
│   │   ├── Requests/
│   │   │   ├── Auth/
│   │   │   │   ├── RegisterRequest.php
│   │   │   │   └── LoginRequest.php
│   │   │   ├── StoreProductRequest.php
│   │   │   ├── UpdateProductRequest.php
│   │   │   ├── StoreCheckoutRequest.php
│   │   │   └── ...
│   │   │
│   │   ├── Resources/
│   │   │   ├── ProductResource.php
│   │   │   ├── ProductCollection.php
│   │   │   ├── OrderResource.php
│   │   │   ├── UserResource.php
│   │   │   └── ...
│   │   │
│   │   └── Middleware/
│   │       ├── EnsureUserIsAdmin.php
│   │       ├── EnsureUserIsOwner.php
│   │       └── ForceJsonResponse.php
│   │
│   ├── Models/
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── ProductVariant.php
│   │   ├── ProductImage.php
│   │   ├── Category.php
│   │   ├── Order.php
│   │   ├── OrderItem.php
│   │   ├── OrderStatusLog.php
│   │   ├── Payment.php
│   │   ├── Wishlist.php
│   │   ├── Review.php
│   │   ├── Coupon.php
│   │   ├── Address.php
│   │   └── Banner.php
│   │
│   ├── Services/
│   │   ├── ProductService.php
│   │   ├── CheckoutService.php
│   │   ├── CouponService.php
│   │   ├── MidtransService.php
│   │   ├── SupabaseStorageService.php
│   │   └── ReportService.php
│   │
│   ├── Repositories/
│   │   ├── ProductRepository.php
│   │   ├── OrderRepository.php
│   │   └── ...
│   │
│   ├── Policies/
│   │   ├── ProductPolicy.php
│   │   ├── OrderPolicy.php
│   │   └── ReviewPolicy.php
│   │
│   ├── Jobs/
│   │   ├── SendOrderConfirmationEmail.php
│   │   ├── ProcessMidtransNotification.php
│   │   └── RestockCancelledOrder.php
│   │
│   └── Providers/
│       └── AppServiceProvider.php
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   │   ├── CategorySeeder.php
│   │   ├── ProductSeeder.php
│   │   └── DatabaseSeeder.php
│   └── factories/
│
├── routes/
│   ├── api.php
│   └── web.php
│
├── config/
│   ├── services.php              # Kredensial Midtrans, Google, Supabase
│   └── sanctum.php
│
├── tests/
│   ├── Feature/
│   │   ├── Auth/
│   │   ├── Product/
│   │   └── Checkout/
│   └── Unit/
│
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── composer.json

### **3.2.1 Penjelasan Prinsip Struktur Backend**

- Versioning API di level folder (Api/V1/): memudahkan penambahan Api/V2/ di masa depan tanpa mematahkan kontrak API versi lama.
- Controllers/Admin/ terpisah dari Controllers/ biasa: memperjelas batas endpoint yang memerlukan middleware EnsureUserIsAdmin atau EnsureUserIsOwner.
- Services/ vs Repositories/: Service berisi logika bisnis (apa yang harus terjadi), Repository berisi logika akses data (bagaimana mengambil/menyimpan data). Controller tidak boleh memanggil Model/Eloquent secara langsung untuk query kompleks — harus melalui Repository.
- Webhook/ terpisah dari V1/: endpoint webhook Midtrans tidak menggunakan autentikasi Sanctum biasa (karena dipanggil oleh server Midtrans, bukan user), sehingga dikelompokkan terpisah dengan middleware validasi signature tersendiri.


# **BAB 4 — SKEMA DATABASE**

Bab ini memperluas skema database ringkas dari PRD asli menjadi definisi lengkap setiap tabel, termasuk tipe data, constraint (primary key, foreign key, unique, nullable), default value, dan index yang direkomendasikan. Seluruh tabel menggunakan PostgreSQL sebagai target database.
**KONVENSI**  Seluruh tabel menggunakan primary key bertipe UUID (bukan auto-increment integer) untuk menghindari enumerasi ID yang mudah ditebak pada endpoint publik, serta memudahkan penggabungan data lintas-lingkungan (dev/staging/production) di masa depan.

## **4.1 Diagram Relasi (Deskriptif)**

Relasi antar tabel utama (sesuai PRD asli, diperluas dengan tabel tambahan yang diperlukan untuk implementasi penuh):
- users 1—N orders, users 1—N wishlist, users 1—N reviews, users 1—N addresses
- categories 1—N products (dengan dukungan self-referencing untuk sub-kategori)
- products 1—N product_images, products 1—N product_variants, products 1—N reviews
- product_variants 1—N order_items (setiap item order merujuk pada kombinasi varian spesifik)
- orders 1—N order_items, orders 1—1 payments, orders 1—N order_status_logs
- coupons 1—N orders (order dapat merujuk kupon yang digunakan, nullable)


## **4.2 Definisi Tabel**


### **4.2.1 users**

Menyimpan seluruh akun pengguna: customer, admin, dan owner, dibedakan melalui kolom role.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK | Identifier unik pengguna |
| name | VARCHAR(150) | NOT NULL | Nama lengkap pengguna |
| email | VARCHAR(150) | NOT NULL, UNIQUE | Alamat email, dipakai untuk login |
| password | VARCHAR(255) | NULLABLE | Hash bcrypt; nullable jika user hanya login via Google |
| phone | VARCHAR(20) | NULLABLE | Nomor telepon |
| role | ENUM | NOT NULL, DEFAULT 'customer' | Nilai: 'customer', 'admin', 'owner' |
| google_id | VARCHAR(100) | NULLABLE, UNIQUE | ID akun Google jika login via OAuth |
| avatar_url | TEXT | NULLABLE | URL foto profil di Supabase Storage |
| email_verified_at | TIMESTAMP | NULLABLE | Waktu verifikasi email |
| created_at | TIMESTAMP | NOT NULL | Waktu pembuatan akun |
| updated_at | TIMESTAMP | NOT NULL | Waktu pembaruan terakhir |


- Index: UNIQUE(email), UNIQUE(google_id).
- Kolom password wajib di-hash menggunakan bcrypt (cost factor minimal 12) — lihat Bab 8.


### **4.2.2 categories**

Menyimpan kategori produk, mendukung struktur hierarkis melalui self-referencing foreign key parent_id.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK | Identifier unik kategori |
| parent_id | UUID | NULLABLE, FK → categories.id | Kategori induk (null jika kategori utama) |
| name | VARCHAR(100) | NOT NULL | Nama kategori |
| slug | VARCHAR(120) | NOT NULL, UNIQUE | Slug URL-friendly |
| image_url | TEXT | NULLABLE | Gambar ikon/thumbnail kategori |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Status tampil/tidak di storefront |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 | Urutan tampil kategori |
| created_at | TIMESTAMP | NOT NULL |  |
| updated_at | TIMESTAMP | NOT NULL |  |


- Index: UNIQUE(slug), INDEX(parent_id).


### **4.2.3 products**

Menyimpan data induk produk. Detail varian (warna/ukuran/stok) disimpan terpisah pada product_variants agar mendukung kombinasi varian dengan stok independen.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK | Identifier unik produk |
| category_id | UUID | NOT NULL, FK → categories.id | Kategori produk |
| name | VARCHAR(200) | NOT NULL | Nama produk |
| slug | VARCHAR(220) | NOT NULL, UNIQUE | Slug URL-friendly |
| description | TEXT | NULLABLE | Deskripsi lengkap produk |
| material | VARCHAR(200) | NULLABLE | Informasi bahan (mengatasi pain point "detail produk sulit dilihat") |
| care_instructions | TEXT | NULLABLE | Panduan perawatan produk |
| price | NUMERIC(12,2) | NOT NULL | Harga jual dasar |
| discount | NUMERIC(5,2) | NOT NULL, DEFAULT 0 | Persentase diskon (0–100) |
| status | ENUM | NOT NULL, DEFAULT 'draft' | Nilai: 'draft', 'published', 'archived' |
| size_chart_id | UUID | NULLABLE, FK → size_charts.id | Referensi size chart kategori terkait |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete timestamp |
| created_at | TIMESTAMP | NOT NULL |  |
| updated_at | TIMESTAMP | NOT NULL |  |


- Index: UNIQUE(slug), INDEX(category_id), INDEX(status), INDEX(deleted_at).
- Kolom stock pada PRD asli dipindahkan ke tabel product_variants karena stok idealnya per kombinasi warna+ukuran, bukan per produk induk — lihat 4.2.5.
- Menggunakan SoftDeletes (deleted_at) agar produk yang dihapus tidak menghilangkan riwayat pada order_items yang sudah ada.


### **4.2.4 product_variants**

Menyimpan kombinasi spesifik warna dan ukuran untuk setiap produk, beserta stok independen per kombinasi. Tabel ini diperlukan agar fitur "Color" dan "Size" pada PRD dapat divalidasi stoknya secara akurat.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK | Identifier unik varian |
| product_id | UUID | NOT NULL, FK → products.id | Produk induk |
| color | VARCHAR(50) | NOT NULL | Nama warna (misalnya "Hitam") |
| color_hex | VARCHAR(7) | NULLABLE | Kode hex untuk swatch warna, misalnya "#111111" |
| size | VARCHAR(20) | NOT NULL | Ukuran (S, M, L, XL, dsb) |
| sku | VARCHAR(60) | NOT NULL, UNIQUE | Kode SKU unik kombinasi varian |
| stock | INTEGER | NOT NULL, DEFAULT 0 | Jumlah stok tersedia untuk kombinasi ini |
| created_at | TIMESTAMP | NOT NULL |  |
| updated_at | TIMESTAMP | NOT NULL |  |


- Index: UNIQUE(sku), UNIQUE(product_id, color, size), INDEX(product_id).
- Constraint CHECK(stock >= 0) direkomendasikan di level database untuk mencegah stok negatif akibat race condition (lihat 8.6 — Penanganan Race Condition Stok).


### **4.2.5 product_images**

Menyimpan galeri gambar produk, mendukung banyak gambar per produk dan opsional per varian warna.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| product_id | UUID | NOT NULL, FK → products.id |  |
| variant_id | UUID | NULLABLE, FK → product_variants.id | Jika diisi, gambar spesifik untuk varian warna tertentu |
| image_url | TEXT | NOT NULL | URL gambar di Supabase Storage |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 | Urutan tampil dalam galeri |
| is_primary | BOOLEAN | NOT NULL, DEFAULT false | Gambar utama yang tampil di product card |
| created_at | TIMESTAMP | NOT NULL |  |


- Index: INDEX(product_id), INDEX(variant_id).


### **4.2.6 size_charts**

Menyimpan data ukuran per kategori produk untuk mengatasi pain point "size chart membingungkan" pada persona Sarah.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| category_id | UUID | NOT NULL, FK → categories.id |  |
| name | VARCHAR(100) | NOT NULL | Misalnya "Size Chart Dress" |
| chart_data | JSONB | NOT NULL | Data tabel ukuran dalam format terstruktur (lihat contoh di bawah) |
| created_at | TIMESTAMP | NOT NULL |  |


Contoh struktur chart_data (JSONB):
{
  "unit": "cm",
  "columns": ["Size", "Lingkar Dada", "Lingkar Pinggang", "Panjang"],
  "rows": [
    ["S", "84-88", "66-70", "95"],
    ["M", "89-93", "71-75", "96"],
    ["L", "94-98", "76-80", "97"]
  ]
}


### **4.2.7 orders**

Menyimpan data pesanan pelanggan. Kolom shipping_address disimpan sebagai snapshot JSONB (bukan hanya foreign key ke addresses) agar perubahan/penghapusan alamat di masa depan tidak mengubah data historis order.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| user_id | UUID | NOT NULL, FK → users.id |  |
| order_number | VARCHAR(30) | NOT NULL, UNIQUE | Nomor order yang ditampilkan ke user (misalnya "PLT-20260802-0001") |
| status | ENUM | NOT NULL, DEFAULT 'pending' | Nilai: 'pending', 'processing', 'shipped', 'completed', 'cancelled' |
| payment_status | ENUM | NOT NULL, DEFAULT 'pending' | Nilai: 'pending', 'paid', 'failed', 'expired', 'refunded' |
| subtotal | NUMERIC(12,2) | NOT NULL | Jumlah sebelum diskon dan ongkir |
| discount_amount | NUMERIC(12,2) | NOT NULL, DEFAULT 0 | Nominal potongan dari kupon |
| shipping_cost | NUMERIC(12,2) | NOT NULL, DEFAULT 0 |  |
| total | NUMERIC(12,2) | NOT NULL | subtotal - discount_amount + shipping_cost |
| coupon_id | UUID | NULLABLE, FK → coupons.id |  |
| shipping_address | JSONB | NOT NULL | Snapshot alamat pengiriman saat order dibuat |
| courier | VARCHAR(50) | NULLABLE | Nama kurir (JNE, SiCepat, dsb) |
| tracking_number | VARCHAR(100) | NULLABLE | Nomor resi pengiriman |
| notes | TEXT | NULLABLE | Catatan tambahan dari pembeli |
| created_at | TIMESTAMP | NOT NULL |  |
| updated_at | TIMESTAMP | NOT NULL |  |


- Index: UNIQUE(order_number), INDEX(user_id), INDEX(status), INDEX(payment_status), INDEX(created_at).


### **4.2.8 order_items**

Menyimpan item-item dalam satu order. Harga dan nama produk disalin (snapshot) ke tabel ini agar riwayat order tidak berubah meskipun harga/nama produk berubah di kemudian hari.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| order_id | UUID | NOT NULL, FK → orders.id |  |
| product_variant_id | UUID | NOT NULL, FK → product_variants.id |  |
| product_name | VARCHAR(200) | NOT NULL | Snapshot nama produk saat order dibuat |
| variant_label | VARCHAR(100) | NOT NULL | Snapshot label varian, misalnya "Hitam / M" |
| price | NUMERIC(12,2) | NOT NULL | Snapshot harga satuan saat order dibuat |
| quantity | INTEGER | NOT NULL |  |
| subtotal | NUMERIC(12,2) | NOT NULL | price * quantity |
| created_at | TIMESTAMP | NOT NULL |  |


- Index: INDEX(order_id), INDEX(product_variant_id).
- Constraint CHECK(quantity > 0).


### **4.2.9 order_status_logs**

Mencatat riwayat perubahan status order, termasuk siapa (admin/sistem) yang melakukan perubahan — kebutuhan dari fitur Admin "Orders" pada 1.9.5.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| order_id | UUID | NOT NULL, FK → orders.id |  |
| from_status | VARCHAR(20) | NULLABLE | Status sebelumnya |
| to_status | VARCHAR(20) | NOT NULL | Status baru |
| changed_by | UUID | NULLABLE, FK → users.id | Null jika perubahan otomatis oleh sistem/webhook |
| note | TEXT | NULLABLE |  |
| created_at | TIMESTAMP | NOT NULL |  |


- Index: INDEX(order_id).


### **4.2.10 payments**

Menyimpan detail transaksi pembayaran dari Midtrans, termasuk payload mentah untuk keperluan audit.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| order_id | UUID | NOT NULL, FK → orders.id, UNIQUE | Relasi 1—1 dengan orders |
| payment_method | VARCHAR(50) | NULLABLE | Misalnya "credit_card", "gopay", "bank_transfer" |
| midtrans_transaction_id | VARCHAR(100) | NULLABLE, UNIQUE |  |
| status | VARCHAR(30) | NOT NULL | Status mentah dari Midtrans (lihat 2.7.3) |
| gross_amount | NUMERIC(12,2) | NOT NULL |  |
| raw_payload | JSONB | NULLABLE | Payload lengkap notifikasi untuk audit/debugging |
| paid_at | TIMESTAMP | NULLABLE |  |
| created_at | TIMESTAMP | NOT NULL |  |
| updated_at | TIMESTAMP | NOT NULL |  |


- Index: UNIQUE(order_id), UNIQUE(midtrans_transaction_id).



### **4.2.11 wishlist**

Menyimpan produk yang disimpan pengguna untuk dipantau/dibeli nanti.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| user_id | UUID | NOT NULL, FK → users.id |  |
| product_id | UUID | NOT NULL, FK → products.id |  |
| created_at | TIMESTAMP | NOT NULL |  |


- Index: UNIQUE(user_id, product_id) — mencegah duplikasi item wishlist yang sama.


### **4.2.12 reviews**

Menyimpan rating dan komentar pengguna terhadap produk yang telah dibeli.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| user_id | UUID | NOT NULL, FK → users.id |  |
| product_id | UUID | NOT NULL, FK → products.id |  |
| order_item_id | UUID | NOT NULL, FK → order_items.id, UNIQUE | Memastikan review terikat pada pembelian nyata (mencegah fake review) |
| rating | SMALLINT | NOT NULL | Nilai 1–5 |
| comment | TEXT | NULLABLE |  |
| created_at | TIMESTAMP | NOT NULL |  |
| updated_at | TIMESTAMP | NOT NULL |  |


- Index: INDEX(product_id), UNIQUE(order_item_id).
- Constraint CHECK(rating BETWEEN 1 AND 5).


### **4.2.13 addresses**

Menyimpan alamat pengiriman pengguna, mendukung lebih dari satu alamat tersimpan.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| user_id | UUID | NOT NULL, FK → users.id |  |
| label | VARCHAR(50) | NULLABLE | Misalnya "Rumah", "Kantor" |
| recipient_name | VARCHAR(150) | NOT NULL |  |
| phone | VARCHAR(20) | NOT NULL |  |
| province | VARCHAR(100) | NOT NULL |  |
| city | VARCHAR(100) | NOT NULL |  |
| district | VARCHAR(100) | NOT NULL |  |
| postal_code | VARCHAR(10) | NOT NULL |  |
| detail | TEXT | NOT NULL | Nama jalan, nomor rumah, patokan |
| is_default | BOOLEAN | NOT NULL, DEFAULT false |  |
| created_at | TIMESTAMP | NOT NULL |  |
| updated_at | TIMESTAMP | NOT NULL |  |


- Index: INDEX(user_id).
- Business rule (di level aplikasi): hanya boleh ada satu is_default = true per user_id — ditegakkan melalui Service layer, bukan constraint database.


### **4.2.14 coupons**

Menyimpan kode kupon/voucher promo.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| code | VARCHAR(30) | NOT NULL, UNIQUE |  |
| type | ENUM | NOT NULL | Nilai: 'fixed', 'percentage' |
| value | NUMERIC(12,2) | NOT NULL | Nominal (jika fixed) atau persentase (jika percentage) |
| min_purchase | NUMERIC(12,2) | NOT NULL, DEFAULT 0 | Minimum subtotal agar kupon berlaku |
| max_discount | NUMERIC(12,2) | NULLABLE | Batas maksimum potongan untuk tipe percentage |
| quota | INTEGER | NULLABLE | Total kuota penggunaan; null = tidak terbatas |
| used_count | INTEGER | NOT NULL, DEFAULT 0 |  |
| starts_at | TIMESTAMP | NOT NULL |  |
| expires_at | TIMESTAMP | NOT NULL |  |
| is_active | BOOLEAN | NOT NULL, DEFAULT true |  |
| created_at | TIMESTAMP | NOT NULL |  |
| updated_at | TIMESTAMP | NOT NULL |  |


- Index: UNIQUE(code).


### **4.2.15 banners**

Menyimpan konten hero banner dan promo banner pada homepage.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| type | ENUM | NOT NULL | Nilai: 'hero', 'promo' |
| title | VARCHAR(150) | NULLABLE |  |
| subtitle | VARCHAR(255) | NULLABLE |  |
| image_url_desktop | TEXT | NOT NULL |  |
| image_url_mobile | TEXT | NOT NULL |  |
| cta_label | VARCHAR(50) | NULLABLE |  |
| cta_url | VARCHAR(255) | NULLABLE |  |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 |  |
| starts_at | TIMESTAMP | NULLABLE |  |
| ends_at | TIMESTAMP | NULLABLE |  |
| is_active | BOOLEAN | NOT NULL, DEFAULT true |  |
| created_at | TIMESTAMP | NOT NULL |  |


- Index: INDEX(type), INDEX(is_active).


### **4.2.16 newsletter_subscribers**

Menyimpan email pelanggan yang mendaftar newsletter pada homepage.

| Kolom | Tipe | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | UUID | PK |  |
| email | VARCHAR(150) | NOT NULL, UNIQUE |  |
| subscribed_at | TIMESTAMP | NOT NULL |  |


- Index: UNIQUE(email).



## **4.3 Ringkasan Relasi Foreign Key**


| Tabel Anak | Kolom FK | Tabel Induk | On Delete |
| --- | --- | --- | --- |
| categories | parent_id | categories | SET NULL |
| products | category_id | categories | RESTRICT |
| products | size_chart_id | size_charts | SET NULL |
| product_variants | product_id | products | CASCADE |
| product_images | product_id | products | CASCADE |
| product_images | variant_id | product_variants | CASCADE |
| orders | user_id | users | RESTRICT |
| orders | coupon_id | coupons | SET NULL |
| order_items | order_id | orders | CASCADE |
| order_items | product_variant_id | product_variants | RESTRICT |
| order_status_logs | order_id | orders | CASCADE |
| payments | order_id | orders | CASCADE |
| wishlist | user_id | users | CASCADE |
| wishlist | product_id | products | CASCADE |
| reviews | user_id | users | RESTRICT |
| reviews | product_id | products | CASCADE |
| addresses | user_id | users | CASCADE |


Catatan: RESTRICT digunakan pada relasi yang menjadi bukti transaksi historis (orders.user_id, order_items.product_variant_id, reviews.user_id) agar data transaksi tidak dapat kehilangan referensinya akibat penghapusan data induk. CASCADE digunakan pada data turunan murni yang tidak bernilai historis independen (misalnya product_variants ikut terhapus jika produk induknya dihapus permanen).

## **4.4 Urutan Migrasi (Migration Order)**

Karena banyak tabel memiliki foreign key silang, migrasi Laravel harus dijalankan dalam urutan berikut agar tidak terjadi error "relation does not exist":
- users
- categories (self-referencing, parent_id ditambahkan setelah tabel dibuat atau menggunakan nullable + foreign key terpisah)
- size_charts
- products
- product_variants
- product_images
- addresses
- coupons
- orders
- order_items
- order_status_logs
- payments
- wishlist
- reviews
- banners
- newsletter_subscribers

## **4.5 Catatan Implementasi Migrasi**

Beberapa constraint pada skema di atas perlu perhatian khusus saat diterjemahkan menjadi migration, karena tidak selalu otomatis dibuat oleh tooling ORM standar:
- Composite unique constraint pada product_variants (kombinasi product_id + color + size) wajib dibuat eksplisit, agar tidak mungkin ada dua varian dengan kombinasi warna dan ukuran yang identik untuk satu produk.
- CHECK constraint stock >= 0 pada product_variants sebaiknya ditegakkan di level database (bukan hanya validasi aplikasi), sebagai lapisan pertahanan terakhir terhadap stok negatif akibat race condition — lihat pembahasan detail pada 8.6.1.
- CHECK constraint rating BETWEEN 1 AND 5 pada reviews dan quantity > 0 pada order_items sebaiknya turut ditegakkan di level database dengan alasan yang sama.
- Seluruh foreign key mengikuti perilaku on-delete yang telah dirinci pada tabel 4.3 (CASCADE, RESTRICT, atau SET NULL sesuai konteks masing-masing relasi).


# **BAB 5 — SPESIFIKASI API**


## **5.1 Format Response Standar**

Seluruh endpoint API mengikuti format response terstandarisasi berikut, agar penanganan response di frontend dapat digeneralisasi melalui service layer.
Response sukses:
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message"
}
Response gagal:
{
  "success": false,
  "message": "Ringkasan error",
  "errors": {
    "email": ["Email sudah terdaftar."]
  }
}
Response list dengan pagination:
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 143,
    "last_page": 8
  }
}

## **5.2 Konvensi Umum**

- Base URL: https://api.pleatsssi.com/api/v1
- Autentikasi: header Authorization: Bearer {token} untuk endpoint yang memerlukan login.
- Semua request/response body berformat JSON, kecuali endpoint upload file yang menggunakan multipart/form-data.
- Tanggal/waktu menggunakan format ISO 8601 (contoh: "2026-08-02T10:30:00Z").
- Nilai uang dikirim sebagai numeric string tanpa simbol mata uang, misalnya "349000.00".


## **5.3 Auth Endpoints**

**POST**  **/auth/register**
**Auth:** *Publik*
Mendaftarkan akun customer baru menggunakan email dan password.
**Request Body:**
{
  "name": "Sarah Amelia",
  "email": "sarah@example.com",
  "password": "P@ssw0rd123",
  "password_confirmation": "P@ssw0rd123"
}
**Response Body:**
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "name": "Sarah Amelia", "email": "sarah@example.com", "role": "customer" },
    "token": "1|abcdef123456..."
  }
}

| Status | Kondisi |
| --- | --- |
| 201 | Registrasi berhasil |
| 422 | Validasi gagal (email sudah terdaftar, password lemah, dsb) |


**POST**  **/auth/login**
**Auth:** *Publik*
Login menggunakan email dan password.
**Request Body:**
{
  "email": "sarah@example.com",
  "password": "P@ssw0rd123"
}
**Response Body:**
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "name": "Sarah Amelia", "role": "customer" },
    "token": "1|abcdef123456..."
  }
}

| Status | Kondisi |
| --- | --- |
| 200 | Login berhasil |
| 422 | Email atau password salah |
| 429 | Terlalu banyak percobaan (rate limit) |


**GET**  **/auth/google/redirect**
**Auth:** *Publik*
Mengarahkan browser ke halaman consent Google OAuth.

| Status | Kondisi |
| --- | --- |
| 302 | Redirect ke Google |


**GET**  **/auth/google/callback**
**Auth:** *Publik*
Callback yang dipanggil Google setelah user menyetujui akses. Membuat/mencari user, lalu redirect ke frontend dengan token sementara.

| Status | Kondisi |
| --- | --- |
| 302 | Redirect ke frontend dengan token |
| 401 | Gagal autentikasi Google |


**POST**  **/auth/logout**
**Auth:** *Wajib login*
Mencabut token akses yang sedang digunakan.
**Response Body:**
{ "success": true, "message": "Berhasil keluar." }

| Status | Kondisi |
| --- | --- |
| 200 | Logout berhasil |


**GET**  **/auth/me**
**Auth:** *Wajib login*
Mengambil data user yang sedang login, digunakan untuk inisialisasi state auth di frontend.
**Response Body:**
{
  "success": true,
  "data": { "id": "uuid", "name": "Sarah Amelia", "email": "sarah@example.com", "role": "customer" }
}

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |
| 401 | Token tidak valid/kedaluwarsa |



## **5.4 Product Endpoints**

**GET**  **/products**
**Auth:** *Publik*
Mengambil daftar produk dengan dukungan pencarian, filter, sort, dan pagination.
**Response Body:**
// Query params: search, category, color, size, min_price, max_price, sort, page, per_page
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Pleated Midi Dress",
      "slug": "pleated-midi-dress",
      "price": "349000.00",
      "discount": 10,
      "primary_image": "https://.../image.jpg",
      "is_new": true
    }
  ],
  "meta": { "current_page": 1, "per_page": 20, "total": 84, "last_page": 5 }
}

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**GET**  **/products/{slug}**
**Auth:** *Publik*
Mengambil detail lengkap satu produk beserta varian, gambar, dan ringkasan rating.
**Response Body:**
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Pleated Midi Dress",
    "description": "...",
    "material": "Katun premium 220gsm",
    "care_instructions": "...",
    "price": "349000.00",
    "discount": 10,
    "images": [{ "url": "...", "is_primary": true }],
    "variants": [{ "id": "uuid", "color": "Hitam", "color_hex": "#111111", "size": "M", "stock": 12 }],
    "size_chart": { "unit": "cm", "columns": [ ... ], "rows": [ ... ] },
    "rating_summary": { "average": 4.6, "total_reviews": 38, "distribution": { "5": 28, "4": 7, "3": 2, "2": 1, "1": 0 } }
  }
}

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |
| 404 | Produk tidak ditemukan |


**GET**  **/products/{slug}/related**
**Auth:** *Publik*
Mengambil produk terkait berdasarkan kategori yang sama.
**Response Body:**
{ "success": true, "data": [ { "id": "uuid", "name": "...", "price": "..." } ] }

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**GET**  **/products/{slug}/reviews**
**Auth:** *Publik*
Mengambil daftar review sebuah produk (paginated).
**Response Body:**
{
  "success": true,
  "data": [
    { "id": "uuid", "user_name": "Sarah A.", "rating": 5, "comment": "Bahannya adem...", "created_at": "2026-07-20T10:00:00Z" }
  ],
  "meta": { "current_page": 1, "per_page": 10, "total": 38, "last_page": 4 }
}

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**GET**  **/categories**
**Auth:** *Publik*
Mengambil struktur kategori (termasuk sub-kategori) untuk navigasi dan filter.
**Response Body:**
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Dress", "slug": "dress", "children": [] }
  ]
}

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |




## **5.5 Cart Endpoints**

**CATATAN**  Untuk guest (belum login), manajemen cart dilakukan sepenuhnya di client (localStorage) — endpoint di bawah digunakan setelah user login, termasuk untuk proses merge cart guest ke akun.
**GET**  **/cart**
**Auth:** *Wajib login*
Mengambil isi keranjang belanja milik user.
**Response Body:**
{
  "success": true,
  "data": {
    "items": [
      { "id": "uuid", "product_variant_id": "uuid", "product_name": "...", "variant_label": "Hitam / M", "price": "349000.00", "quantity": 2, "stock_available": 12 }
    ],
    "subtotal": "698000.00"
  }
}

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**POST**  **/cart/items**
**Auth:** *Wajib login*
Menambahkan item ke keranjang.
**Request Body:**
{ "product_variant_id": "uuid", "quantity": 1 }
**Response Body:**
{ "success": true, "data": { "id": "uuid", "quantity": 1 } }

| Status | Kondisi |
| --- | --- |
| 201 | Item ditambahkan |
| 422 | Stok tidak mencukupi |


**PATCH**  **/cart/items/{id}**
**Auth:** *Wajib login*
Mengubah jumlah item di keranjang.
**Request Body:**
{ "quantity": 3 }
**Response Body:**
{ "success": true, "data": { "id": "uuid", "quantity": 3 } }

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |
| 422 | Stok tidak mencukupi |


**DELETE**  **/cart/items/{id}**
**Auth:** *Wajib login*
Menghapus item dari keranjang.
**Response Body:**
{ "success": true, "message": "Item dihapus dari keranjang." }

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**POST**  **/cart/merge**
**Auth:** *Wajib login*
Menggabungkan cart guest (dikirim dari localStorage) ke cart akun setelah login.
**Request Body:**
{ "items": [ { "product_variant_id": "uuid", "quantity": 2 } ] }
**Response Body:**
{ "success": true, "message": "Keranjang berhasil digabungkan." }

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |



## **5.6 Checkout & Order Endpoints**

**POST**  **/checkout**
**Auth:** *Wajib login*
Membuat order baru dari isi keranjang, menerapkan kupon (jika ada), dan menghasilkan Snap token Midtrans.
**Request Body:**
{
  "address_id": "uuid",
  "courier": "JNE",
  "coupon_code": "PLEATS10",
  "notes": "Tolong dibungkus rapi"
}
**Response Body:**
{
  "success": true,
  "data": {
    "order": { "id": "uuid", "order_number": "PLT-20260802-0001", "total": "628000.00", "status": "pending" },
    "snap_token": "66e4fa55-...-midtrans"
  }
}

| Status | Kondisi |
| --- | --- |
| 201 | Order berhasil dibuat |
| 422 | Stok tidak mencukupi / kupon tidak valid |
| 409 | Keranjang kosong |


**GET**  **/orders**
**Auth:** *Wajib login*
Mengambil riwayat order milik user, mendukung filter status dan rentang tanggal.
**Response Body:**
{
  "success": true,
  "data": [
    { "id": "uuid", "order_number": "PLT-20260802-0001", "status": "processing", "total": "628000.00", "created_at": "..." }
  ],
  "meta": { "current_page": 1, "per_page": 10, "total": 6, "last_page": 1 }
}

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**GET**  **/orders/{id}**
**Auth:** *Wajib login (pemilik order)*
Mengambil detail lengkap satu order, termasuk item, status timeline, dan info pembayaran.
**Response Body:**
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "PLT-20260802-0001",
    "status": "shipped",
    "items": [ { "product_name": "...", "variant_label": "Hitam / M", "quantity": 2, "price": "349000.00" } ],
    "status_timeline": [
      { "status": "pending", "at": "2026-08-01T09:00:00Z" },
      { "status": "processing", "at": "2026-08-01T10:15:00Z" },
      { "status": "shipped", "at": "2026-08-02T08:00:00Z" }
    ],
    "tracking_number": "JNE1234567890"
  }
}

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |
| 403 | Order bukan milik user ini |
| 404 | Order tidak ditemukan |



## **5.7 Webhook Endpoint**

**POST**  **/webhooks/midtrans**
**Auth:** *Signature Midtrans (bukan Sanctum)*
Menerima notifikasi status pembayaran dari Midtrans. Wajib memvalidasi signature_key sebelum memproses payload (lihat 2.7.2).
**Request Body:**
{
  "order_id": "PLT-20260802-0001",
  "transaction_status": "settlement",
  "status_code": "200",
  "gross_amount": "628000.00",
  "signature_key": "..."
}
**Response Body:**
{ "success": true }

| Status | Kondisi |
| --- | --- |
| 200 | Notifikasi diproses |
| 403 | Signature tidak valid |
| 404 | Order tidak ditemukan |



## **5.8 Wishlist Endpoints**

**GET**  **/wishlist**
**Auth:** *Wajib login*
Mengambil daftar produk di wishlist user.
**Response Body:**
{ "success": true, "data": [ { "id": "uuid", "product": { "id": "uuid", "name": "...", "price": "...", "in_stock": true } } ] }

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**POST**  **/wishlist**
**Auth:** *Wajib login*
Menambahkan produk ke wishlist.
**Request Body:**
{ "product_id": "uuid" }
**Response Body:**
{ "success": true, "message": "Ditambahkan ke wishlist." }

| Status | Kondisi |
| --- | --- |
| 201 | Berhasil |
| 409 | Produk sudah ada di wishlist |


**DELETE**  **/wishlist/{product_id}**
**Auth:** *Wajib login*
Menghapus produk dari wishlist.
**Response Body:**
{ "success": true, "message": "Dihapus dari wishlist." }

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |



## **5.9 Review Endpoints**

**POST**  **/reviews**
**Auth:** *Wajib login (pembeli terverifikasi)*
Membuat review untuk produk yang sudah dibeli dan order-nya berstatus selesai.
**Request Body:**
{ "order_item_id": "uuid", "rating": 5, "comment": "Bahannya adem dan jahitannya rapi." }
**Response Body:**
{ "success": true, "data": { "id": "uuid", "rating": 5 } }

| Status | Kondisi |
| --- | --- |
| 201 | Review berhasil dibuat |
| 403 | Order belum selesai / bukan pembeli produk ini |
| 409 | Review untuk item ini sudah ada |



## **5.10 User Profile & Address Endpoints**

**GET**  **/profile**
**Auth:** *Wajib login*
Mengambil data profil user.
**Response Body:**
{ "success": true, "data": { "id": "uuid", "name": "Sarah Amelia", "email": "...", "phone": "...", "avatar_url": "..." } }

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**PUT**  **/profile**
**Auth:** *Wajib login*
Memperbarui data profil user.
**Request Body:**
{ "name": "Sarah A.", "phone": "081234567890" }
**Response Body:**
{ "success": true, "data": { "id": "uuid", "name": "Sarah A." } }

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |
| 422 | Validasi gagal |


**GET**  **/addresses**
**Auth:** *Wajib login*
Mengambil daftar alamat tersimpan user.
**Response Body:**
{ "success": true, "data": [ { "id": "uuid", "label": "Rumah", "is_default": true, "detail": "..." } ] }

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**POST**  **/addresses**
**Auth:** *Wajib login*
Menambahkan alamat baru.
**Request Body:**
{
  "label": "Kantor",
  "recipient_name": "Sarah Amelia",
  "phone": "081234567890",
  "province": "DKI Jakarta",
  "city": "Jakarta Selatan",
  "district": "Kebayoran Baru",
  "postal_code": "12180",
  "detail": "Jl. Contoh No. 10",
  "is_default": false
}
**Response Body:**
{ "success": true, "data": { "id": "uuid" } }

| Status | Kondisi |
| --- | --- |
| 201 | Berhasil |
| 422 | Validasi gagal |




## **5.11 Admin Endpoints**

**OTORISASI**  Seluruh endpoint pada bagian ini memerlukan middleware EnsureUserIsAdmin (role admin atau owner), kecuali disebutkan khusus role owner saja.

### **5.11.1 Dashboard**

**GET**  **/admin/dashboard**
**Auth:** *Admin/Owner*
Mengambil ringkasan metrik dashboard admin.
**Response Body:**
{
  "success": true,
  "data": {
    "total_revenue": "45200000.00",
    "total_orders": 312,
    "pending_orders": 8,
    "low_stock_products": 5,
    "sales_trend": [ { "date": "2026-07-27", "revenue": "3200000.00" } ]
  }
}

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |



### **5.11.2 Product Management**

**GET**  **/admin/products**
**Auth:** *Admin/Owner*
Mengambil daftar seluruh produk (termasuk draft/archived) untuk keperluan pengelolaan.

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**POST**  **/admin/products**
**Auth:** *Admin/Owner*
Membuat produk baru beserta varian.
**Request Body:**
{
  "category_id": "uuid",
  "name": "Pleated Midi Dress",
  "description": "...",
  "material": "Katun premium 220gsm",
  "price": "349000.00",
  "discount": 10,
  "status": "draft",
  "variants": [ { "color": "Hitam", "color_hex": "#111111", "size": "M", "sku": "PMD-BLK-M", "stock": 12 } ]
}
**Response Body:**
{ "success": true, "data": { "id": "uuid", "slug": "pleated-midi-dress" } }

| Status | Kondisi |
| --- | --- |
| 201 | Berhasil |
| 422 | Validasi gagal |


**PUT**  **/admin/products/{id}**
**Auth:** *Admin/Owner*
Memperbarui data produk.

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |
| 422 | Validasi gagal |


**DELETE**  **/admin/products/{id}**
**Auth:** *Admin/Owner*
Soft-delete produk (produk tidak hilang permanen, hanya disembunyikan dari storefront).

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |
| 409 | Tidak dapat dihapus jika ada order aktif yang belum selesai (kebijakan opsional) |


**POST**  **/admin/products/{id}/images**
**Auth:** *Admin/Owner*
Mengunggah gambar produk (multipart/form-data).

| Status | Kondisi |
| --- | --- |
| 201 | Berhasil |
| 422 | Format/ukuran file tidak valid |



### **5.11.3 Order Management**

**GET**  **/admin/orders**
**Auth:** *Admin/Owner*
Mengambil daftar seluruh order dengan filter status, tanggal, metode pembayaran.

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**PATCH**  **/admin/orders/{id}/status**
**Auth:** *Admin/Owner*
Mengubah status order (tercatat di order_status_logs).
**Request Body:**
{ "status": "shipped", "tracking_number": "JNE1234567890", "note": "Dikirim via JNE REG" }
**Response Body:**
{ "success": true, "data": { "id": "uuid", "status": "shipped" } }

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |
| 422 | Transisi status tidak valid (misalnya dari "pending" langsung ke "completed") |



### **5.11.4 Customer Management**

**GET**  **/admin/customers**
**Auth:** *Admin/Owner*
Mengambil daftar customer beserta ringkasan total order dan total belanja.

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**GET**  **/admin/customers/{id}**
**Auth:** *Admin/Owner*
Mengambil detail satu customer beserta riwayat order.

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |



### **5.11.5 Reports**

**GET**  **/admin/reports/sales**
**Auth:** *Owner*
Mengambil laporan penjualan pada rentang tanggal tertentu, dapat diekspor.
**Response Body:**
{
  "success": true,
  "data": {
    "period": { "from": "2026-07-01", "to": "2026-07-31" },
    "total_revenue": "45200000.00",
    "total_orders": 132,
    "top_products": [ { "product_name": "...", "units_sold": 48 } ]
  }
}

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**GET**  **/admin/reports/sales/export**
**Auth:** *Owner*
Mengunduh laporan penjualan dalam format CSV.

| Status | Kondisi |
| --- | --- |
| 200 | File CSV dikembalikan sebagai attachment |



### **5.11.6 Banner Management**

**GET**  **/admin/banners**
**Auth:** *Admin/Owner*
Mengambil daftar seluruh banner.

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**POST**  **/admin/banners**
**Auth:** *Admin/Owner*
Membuat banner baru.
**Request Body:**
{
  "type": "hero",
  "title": "Koleksi Agustus",
  "image_url_desktop": "...",
  "image_url_mobile": "...",
  "cta_label": "Lihat Koleksi",
  "cta_url": "/collections/agustus",
  "sort_order": 1
}
**Response Body:**
{ "success": true, "data": { "id": "uuid" } }

| Status | Kondisi |
| --- | --- |
| 201 | Berhasil |



### **5.11.7 Coupon Management**

**GET**  **/admin/coupons**
**Auth:** *Admin/Owner*
Mengambil daftar kupon.

| Status | Kondisi |
| --- | --- |
| 200 | Berhasil |


**POST**  **/admin/coupons**
**Auth:** *Admin/Owner*
Membuat kupon baru.
**Request Body:**
{
  "code": "PLEATS10",
  "type": "percentage",
  "value": 10,
  "min_purchase": "200000.00",
  "max_discount": "50000.00",
  "quota": 100,
  "starts_at": "2026-08-01T00:00:00Z",
  "expires_at": "2026-08-31T23:59:59Z"
}
**Response Body:**
{ "success": true, "data": { "id": "uuid", "code": "PLEATS10" } }

| Status | Kondisi |
| --- | --- |
| 201 | Berhasil |
| 422 | Kode kupon sudah digunakan |




# **BAB 6 — SISTEM DESAIN (DESIGN SYSTEM)**


## **6.1 Brand Personality**

Lima kata kunci berikut menjadi acuan setiap keputusan desain — dari pemilihan warna hingga durasi animasi:

| Sifat | Implikasi Desain |
| --- | --- |
| Elegant | Whitespace luas, hierarki tipografi jelas, hindari elemen dekoratif berlebihan. |
| Premium | Detail halus (soft shadow, transisi mulus), material foto berkualitas tinggi, hindari elemen yang terasa "murah" (misalnya banyak warna cerah kontras). |
| Minimal | Palet warna terbatas, layout grid bersih, satu fokus visual per section. |
| Fashion | Fotografi produk sebagai elemen utama, tipografi heading berkarakter. |
| Feminine | Sudut lengkung lembut (border-radius konsisten), aksen warna hangat (accent color). |


## **6.2 Palet Warna**


| Nama Token | Hex | Penggunaan |
| --- | --- | --- |
| primary | #111111 | Teks utama, tombol primer, ikon aktif, elemen navigasi |
| secondary | #FFFFFF | Background utama section, teks di atas background gelap |
| accent | #D9C8B4 | Aksen dekoratif, border highlight, badge diskon, hover state halus |
| background | #FAFAFA | Background halaman (bukan putih murni, agar konten "mengambang" lembut) |
| gray-600 (turunan) | #6B6B6B | Teks sekunder, placeholder, deskripsi metadata |
| gray-200 (turunan) | #E5E5E5 | Border input, divider antar section |
| success (turunan) | #3D7A4E | Status "Selesai", stok tersedia, notifikasi sukses |
| warning (turunan) | #A66A2C | Status "Diproses", stok menipis, notifikasi peringatan |
| danger (turunan) | #B3261E | Status "Dibatalkan", pesan error, validasi gagal |

**CATATAN KONTRAS**  Warna turunan (gray, success, warning, danger) tidak disebutkan eksplisit pada PRD asli namun ditambahkan sebagai perluasan wajib, karena antarmuka e-commerce membutuhkan indikator status yang jelas secara visual — palet primary/secondary/accent/background saja tidak mencukupi untuk membedakan status order, validasi, dan stok.

## **6.3 Tipografi**


| Elemen | Font Family | Ukuran (Desktop) | Ukuran (Mobile) | Weight |
| --- | --- | --- | --- | --- |
| H1 (Hero) | Modern Sans Serif (heading) | 48px | 32px | 700 |
| H2 (Section Title) | Modern Sans Serif (heading) | 36px | 26px | 700 |
| H3 (Card/Subsection) | Modern Sans Serif (heading) | 24px | 20px | 600 |
| H4 (Label Group) | Inter (body) | 16px | 15px | 600 |
| Body | Inter | 16px | 15px | 400 |
| Body Small | Inter | 14px | 13px | 400 |
| Caption/Meta | Inter | 12px | 12px | 400 |
| Button Label | Inter | 15px | 14px | 600 |

Line-height: 1.5 untuk body text, 1.2 untuk heading. Letter-spacing: 0 untuk body, +0.02em untuk heading (memberi kesan lebih premium dan lega).

## **6.4 Spacing Scale**

Skala spacing dari PRD asli (8, 16, 24, 32, 48) digunakan konsisten sebagai satu-satunya sumber nilai margin/padding — nilai di luar skala ini tidak digunakan agar layout tetap rapi secara sistematis.

| Token | Nilai | Contoh Penggunaan |
| --- | --- | --- |
| space-xs | 8px | Jarak antar ikon dan label, padding badge |
| space-sm | 16px | Padding internal button, gap antar elemen form |
| space-md | 24px | Padding card, gap antar card dalam grid |
| space-lg | 32px | Margin antar section kecil, padding container mobile |
| space-xl | 48px | Margin antar section besar, padding container desktop |


## **6.5 Radius, Shadow, dan Animasi**


| Properti | Nilai | Catatan |
| --- | --- | --- |
| Border Radius | 12px | Diterapkan pada card, button, input, modal — konsisten di seluruh komponen |
| Card Shadow | Soft Shadow | 0 4px 16px rgba(17,17,17,0.06) — lembut, tidak tajam, mencerminkan sifat "premium" |
| Button Style | Rounded, Premium | Radius 12px, tanpa border tajam, transisi hover halus |
| Hover Scale | 1.02 | Diterapkan pada product card dan gambar — memberi micro-interaction tanpa berlebihan |
| Animation Duration | 300ms | Durasi standar seluruh transisi (hover, modal open/close, dropdown) |
| Animation Easing | Ease Out | Kurva easing untuk seluruh transisi, memberi kesan gerakan natural dan tidak kaku |


## **6.6 Grid & Breakpoints**


| Breakpoint | Lebar Layar | Kolom Grid | Container Padding |
| --- | --- | --- | --- |
| Mobile | < 640px | 2 kolom (produk), 1 kolom (form) | 16px |
| Tablet | 640px – 1024px | 3 kolom (produk) | 24px |
| Desktop | 1024px – 1440px | 4 kolom (produk) | 32px |
| Large Desktop | > 1440px | 4 kolom (produk), max-width 1280px terpusat | 48px |



## **6.7 Component Library**

Setiap komponen dijabarkan dengan variasi (variant), status interaktif (state), dan catatan aksesibilitas, agar developer frontend dapat mengimplementasikan tanpa perlu menebak perilaku pada setiap kondisi.

### **6.7.1 Button**

Varian: Primary, Secondary, Outline, Ghost, Danger.

| State | Perubahan Visual |
| --- | --- |
| Default | Background primary (#111111), teks putih, radius 12px, padding 12px 24px |
| Hover | Background sedikit lebih terang (opacity 90%) + scale 1.02, transisi 300ms ease-out |
| Active/Pressed | Scale kembali ke 0.98, tanpa transisi (respons instan agar terasa "solid") |
| Focus (keyboard) | Outline ring 2px warna accent, offset 2px — wajib terlihat jelas untuk navigasi keyboard |
| Disabled | Opacity 40%, cursor not-allowed, tidak merespons hover/klik |
| Loading | Ikon spinner menggantikan label teks, tombol tetap pada lebar yang sama (mencegah layout shift) |

- Aksesibilitas: seluruh button memiliki area sentuh minimum 44x44px pada mobile, sesuai pedoman touch target.
- Button dengan hanya ikon (icon-only) wajib memiliki aria-label deskriptif.

### **6.7.2 Input Field**


| State | Perubahan Visual |
| --- | --- |
| Default | Border 1px gray-200, radius 12px, padding 12px 16px, background putih |
| Focus | Border berubah menjadi primary, ditambah subtle ring accent |
| Filled (ada isi) | Label mengecil dan berpindah ke atas border (floating label) — opsional, tergantung pilihan pola form |
| Error | Border berubah menjadi warna danger, teks pesan error muncul di bawah input dengan warna sama |
| Disabled | Background gray-100, teks abu-abu, cursor not-allowed |
| Success (opsional) | Border/ikon centang warna success — digunakan pada field yang tervalidasi async (misalnya cek email tersedia) |


### **6.7.3 Card (Umum)**

Digunakan sebagai container dasar untuk ProductCard, dashboard summary card, dan elemen list lainnya.
- Default: background putih, radius 12px, soft shadow, padding 24px (space-md).
- Hover (jika interaktif/clickable): shadow sedikit lebih tegas + scale 1.02, transisi 300ms.
- Card non-interaktif (misalnya summary dashboard) TIDAK menggunakan hover scale, agar tidak menyesatkan pengguna mengira elemen dapat diklik.

### **6.7.4 ProductCard**

Komponen kunci pada halaman katalog, homepage, dan hasil pencarian.
- Struktur: gambar produk (rasio 3:4), badge diskon (jika ada, pojok kiri atas), nama produk (maks 2 baris, truncate dengan ellipsis), harga (dengan strikethrough jika diskon), rating ringkas (opsional).
- Hover (desktop): gambar bertransisi ke foto kedua (jika tersedia) dalam 300ms, card scale 1.02.
- Mobile: tanpa hover state (karena tidak ada mouse) — interaksi langsung mengarah ke halaman detail saat tap.
- Loading state: skeleton shimmer dengan bentuk placeholder sesuai layout final (mencegah layout shift saat data dimuat).
- Empty stock: badge "Habis" ditampilkan menimpa gambar, card tetap dapat diklik untuk melihat detail namun tombol "Tambah ke Keranjang" disabled.

### **6.7.5 SizeSelector**

- Ditampilkan sebagai grup tombol persegi (bukan dropdown) agar seluruh opsi ukuran terlihat sekaligus tanpa interaksi tambahan.
- Default: border gray-200, teks primary.
- Selected: background primary, teks putih.
- Out of stock: teks dicoret (strikethrough), opacity 40%, tetap dapat difokus namun tidak dapat dipilih — dengan tooltip "Stok habis" saat hover/fokus.
- Aksesibilitas: menggunakan elemen radio group (role="radiogroup") agar dapat dinavigasi dengan tombol panah keyboard.

### **6.7.6 Badge**


| Varian | Warna | Contoh Penggunaan |
| --- | --- | --- |
| Discount | accent background, teks primary | "-10%" pada pojok ProductCard |
| New | primary background, teks putih | "Baru" pada produk yang baru dipublish |
| Status: Success | success background (tint ringan), teks success | Status order "Selesai" |
| Status: Warning | warning background (tint ringan), teks warning | Status order "Diproses", stok menipis |
| Status: Danger | danger background (tint ringan), teks danger | Status order "Dibatalkan" |


### **6.7.7 Modal / Dialog**

- Overlay background hitam dengan opacity 50%, klik di luar modal menutup modal (kecuali modal konfirmasi destruktif — harus klik tombol eksplisit).
- Animasi masuk: fade + scale dari 0.95 ke 1.0 dalam 300ms ease-out.
- Aksesibilitas: fokus otomatis terkunci di dalam modal (focus trap), tombol Escape menutup modal, fokus kembali ke elemen pemicu setelah modal ditutup.

### **6.7.8 Toast / Notifikasi**

- Muncul dari sudut kanan atas (desktop) atau bawah layar (mobile), auto-dismiss setelah 4 detik kecuali varian error (tetap tampil hingga ditutup manual).
- Varian: Success (ikon centang, border success), Error (ikon seru, border danger), Info (ikon info, border primary).

### **6.7.9 Navbar**

- Desktop: logo kiri, menu kategori tengah, ikon search/wishlist/cart/akun kanan.
- Mobile: logo kiri, ikon cart kanan, menu hamburger membuka drawer navigasi dari sisi kiri.
- Sticky on scroll dengan background yang berubah dari transparan (di atas hero) menjadi solid putih + shadow tipis setelah discroll melewati hero.
- Badge jumlah item pada ikon cart, menggunakan warna accent agar tidak terlalu mencolok namun tetap terlihat.

### **6.7.10 Footer**

- Struktur 4 kolom (desktop): Tentang Brand, Bantuan Pelanggan, Kebijakan (privasi, retur), Ikuti Kami (sosial media).
- Mobile: kolom disusun sebagai accordion yang dapat di-expand/collapse untuk menghemat ruang vertikal.

## **6.8 Ringkasan Aksesibilitas**

- Kontras warna teks terhadap background minimal memenuhi WCAG AA (4.5:1 untuk teks normal, 3:1 untuk teks besar).
- Seluruh elemen interaktif dapat diakses dan dioperasikan melalui keyboard (Tab, Enter, Escape, Arrow keys sesuai konteks).
- Gambar produk memiliki atribut alt text deskriptif (bukan generik seperti "gambar produk"), idealnya menyertakan nama dan warna produk.
- Form menampilkan pesan error yang terhubung secara programatik ke input terkait (aria-describedby), bukan hanya secara visual.


# **BAB 7 — ATURAN & STANDAR PENGEMBANGAN**


## **7.1 Coding Style**

- TypeScript Strict Mode: tsconfig.json wajib mengaktifkan "strict": true. Tipe any dilarang kecuali pada kasus interop dengan library eksternal tanpa tipe, dan wajib diberi komentar alasan penggunaannya.
- ESLint: menggunakan konfigurasi berbasis eslint-config-airbnb-typescript atau setara, dijalankan sebagai pre-commit hook (lihat 7.5).
- Prettier: seluruh format kode (indentasi, tanda kutip, trailing comma) diserahkan ke Prettier, bukan preferensi individu — menghindari diff yang tidak relevan pada pull request. Konfigurasi standar tim: titik koma diaktifkan, tanda kutip tunggal, trailing comma di seluruh elemen multi-baris, lebar baris maksimum 100 karakter, dan indentasi 2 spasi.

## **7.2 Konvensi Penamaan**


| Elemen | Konvensi | Contoh |
| --- | --- | --- |
| Komponen React | PascalCase | ProductCard.tsx, CheckoutForm.tsx |
| Variabel & fungsi | camelCase | productList, calculateSubtotal() |
| Nama folder | kebab-case | product-detail/, order-history/ |
| Konstanta global | UPPER_SNAKE_CASE | MAX_UPLOAD_SIZE_MB, DEFAULT_PAGE_SIZE |
| Custom hook | camelCase dengan prefix "use" | useProductFilter(), useCart() |
| Tipe/Interface TS | PascalCase | interface ProductVariant { ... } |
| File service | kebab-case dengan suffix ".service" | product.service.ts |
| Kelas PHP (Laravel) | PascalCase | CheckoutService, ProductRepository |
| Method PHP | camelCase | calculateDiscount(), validateStock() |
| Kolom database | snake_case | created_at, product_variant_id |


## **7.3 Aturan Umum Pengembangan**

Aturan berikut merupakan perluasan langsung dari daftar rules pada PRD asli, masing-masing disertai penjelasan penerapan konkretnya.

#### **Jangan Hardcode Data**

Seluruh data yang berpotensi berubah (harga, teks promosi, URL, konfigurasi) wajib berasal dari database, environment variable, atau file konfigurasi terpusat — bukan ditulis langsung di dalam komponen atau controller.

#### **Semua API Melalui Service Layer**

Lihat 2.2.4 — komponen React tidak boleh memanggil axios/fetch secara langsung. Setiap domain data memiliki file service sendiri di src/services/.

#### **Gunakan Reusable Component**

Sebelum membuat komponen baru, developer wajib memeriksa apakah komponen serupa sudah ada di components/ui/ atau components/common/. Duplikasi komponen dengan fungsi identik harus dihindari dan direfaktor menjadi satu komponen dengan props yang fleksibel.

#### **Validasi Seluruh Input**

Validasi dilakukan di DUA lapisan: client (React Hook Form + Zod schema, untuk UX responsif) dan server (Laravel Form Request, sebagai sumber kebenaran final). Validasi client TIDAK PERNAH dianggap cukup — server wajib memvalidasi ulang seluruh input tanpa terkecuali.

#### **Optimasi Gambar**

Lihat detail lengkap pada Bab 9.2 — Image Optimization Pipeline.

#### **Mobile First**

Seluruh styling Tailwind ditulis dengan pendekatan mobile-first: class dasar berlaku untuk mobile, breakpoint (sm:, md:, lg:) digunakan untuk menyesuaikan tampilan pada layar lebih besar — bukan sebaliknya.

#### **Responsive**

Seluruh halaman diuji pada minimal tiga lebar viewport: 375px (mobile kecil), 768px (tablet), dan 1440px (desktop) sebelum dianggap selesai.

#### **SEO Friendly**

- Setiap halaman produk dan kategori memiliki meta title dan meta description yang dinamis (bukan statis untuk seluruh halaman).
- Menggunakan struktur heading yang semantik (satu H1 per halaman).
- Server-side rendering atau pre-rendering dipertimbangkan untuk halaman produk/kategori agar dapat di-crawl mesin pencari secara optimal (catatan: Vite SPA murni memerlukan solusi tambahan seperti prerendering jika SEO menjadi prioritas tinggi).

#### **Accessibility**

Lihat detail lengkap pada 6.8 — Ringkasan Aksesibilitas.

#### **Jangan Expose API Key**

- Seluruh API key/secret (Midtrans server key, Supabase service key) hanya disimpan di backend (.env), tidak pernah dikirim ke frontend.
- Frontend hanya menggunakan public key/client key yang memang dirancang untuk terekspos (misalnya Midtrans client key untuk Snap.js).

#### **Selalu Gunakan Environment Variable**

Lihat daftar lengkap environment variable pada 10.1.

## **7.4 Git Convention**

Format commit message mengikuti Conventional Commits, sesuai prefix yang telah ditentukan pada PRD asli:

| Prefix | Kapan Digunakan | Contoh |
| --- | --- | --- |
| feat: | Menambahkan fitur baru | feat: tambahkan filter warna pada halaman katalog |
| fix: | Memperbaiki bug | fix: perbaiki validasi stok saat checkout |
| refactor: | Perubahan struktur kode tanpa mengubah perilaku | refactor: pindahkan logika diskon ke CouponService |
| docs: | Perubahan dokumentasi | docs: perbarui spesifikasi endpoint checkout |
| style: | Perubahan format kode (bukan CSS) | style: rapikan indentasi ProductCard.tsx |
| test: | Menambah/memperbaiki test | test: tambahkan test untuk CheckoutService |


### **7.4.1 Branch Naming**

- Format: {type}/{ringkasan-singkat} — misalnya feat/product-filter, fix/cart-stock-validation.
- Branch utama: main (production), develop (integrasi staging). Seluruh fitur dikembangkan di branch turunan dari develop.

### **7.4.2 Pull Request Checklist**

- Judul PR mengikuti format commit convention.
- Deskripsi PR mencantumkan: apa yang berubah, cara pengujian manual, screenshot (untuk perubahan UI).
- Seluruh check CI (lint, test, build) harus lolos sebelum merge diizinkan.
- Minimal satu reviewer approval sebelum merge ke develop atau main.

## **7.5 Pre-commit Hook**

Menggunakan Husky + lint-staged agar lint dan format berjalan otomatis sebelum kode di-commit, mencegah kode yang tidak sesuai standar masuk ke repository. Untuk file frontend yang di-staging (.ts/.tsx), ESLint dijalankan dengan auto-fix diikuti Prettier; untuk file backend (.php), formatter Laravel Pint dijalankan secara otomatis dengan cara yang sama.

## **7.6 Strategi Testing**


| Jenis Test | Tools | Cakupan |
| --- | --- | --- |
| Unit Test (Backend) | PHPUnit / Pest | Service dan helper murni (kalkulasi diskon, validasi kupon, dsb) tanpa dependency database |
| Feature Test (Backend) | PHPUnit / Pest + Laravel Testing | Endpoint API end-to-end, termasuk autentikasi dan validasi |
| Unit Test (Frontend) | Vitest | Fungsi utilitas murni (formatCurrency, validators) |
| Component Test (Frontend) | React Testing Library | Perilaku komponen (misalnya SizeSelector menonaktifkan opsi stok habis) |
| E2E Test | Playwright / Cypress | Alur kritis: registrasi, login, tambah ke keranjang, checkout, pembayaran (mock) |

**PRIORITAS TESTING**  Untuk MVP, prioritas tertinggi diberikan pada Feature Test alur checkout (termasuk validasi stok dan kupon) dan E2E test alur pembelian utama, karena kegagalan pada area ini berdampak langsung pada pendapatan.

## **7.7 Code Review Checklist**

- Apakah perubahan mengikuti struktur folder dan layer yang telah ditetapkan (Bab 2–3)?
- Apakah seluruh input divalidasi di sisi server, bukan hanya client?
- Apakah ada query N+1 yang tidak perlu (backend) — lihat Bab 9.4?
- Apakah komponen baru sudah mobile-first dan diuji pada breakpoint utama?
- Apakah ada data sensitif (API key, password) yang secara tidak sengaja ter-commit?
- Apakah nama variabel/fungsi/komponen mengikuti konvensi pada 7.2?


# **BAB 8 — PANDUAN IMPLEMENTASI KEAMANAN**

Bab ini menjabarkan implementasi teknis dari setiap poin keamanan pada PRD asli (JWT, CSRF Protection, XSS Protection, SQL Injection Prevention, Rate Limiting, Secure Headers), ditambah beberapa area kritis lain yang relevan untuk platform e-commerce (validasi upload file, penanganan race condition stok, dan kebijakan password).

## **8.1 Kebijakan Password**


| Aturan | Nilai |
| --- | --- |
| Panjang minimum | 8 karakter |
| Kombinasi wajib | Minimal 1 huruf besar, 1 huruf kecil, 1 angka |
| Algoritma hashing | bcrypt, cost factor minimal 12 |
| Penyimpanan | Hanya hash yang disimpan; password asli tidak pernah disimpan/di-log dalam bentuk apa pun |

Aturan di atas ditegakkan sebagai validasi wajib pada form registrasi maupun ganti password — request akan ditolak dengan pesan error spesifik per aturan yang tidak terpenuhi (misalnya "Password harus mengandung huruf besar") jika salah satu syarat tidak terpenuhi.

## **8.2 Autentikasi — Token (Sanctum, setara JWT untuk SPA)**

PRD asli menyebutkan "JWT" sebagai mekanisme autentikasi. Untuk arsitektur SPA (React) yang berkomunikasi dengan Laravel API, Laravel Sanctum direkomendasikan sebagai implementasi yang lebih sesuai dibanding JWT murni, karena menyediakan mekanisme pencabutan token (revocation) yang tidak dimiliki JWT stateless secara native — sangat penting untuk fitur "Logout" yang benar-benar mencabut akses, bukan hanya menghapus token di client.
- Access token disimpan di memory aplikasi (state) untuk mengurangi risiko pencurian via XSS, dengan token disertakan pada setiap request melalui header Authorization.
- Setiap token memiliki expiry (disarankan 24 jam untuk access token biasa), memaksa re-login berkala untuk sesi yang tidak aktif dalam waktu lama.
- Endpoint logout mencabut token yang sedang aktif secara eksplisit di sisi server (server-side token revocation), bukan hanya menghapusnya di penyimpanan client — memastikan token yang sama benar-benar tidak dapat dipakai lagi setelah user logout.

## **8.3 CSRF Protection**

Karena API menggunakan token-based authentication (Sanctum, bukan session cookie untuk permintaan API), risiko CSRF klasik pada endpoint API berkurang signifikan dibanding aplikasi berbasis session. Namun, langkah berikut tetap diterapkan sebagai lapisan pertahanan tambahan:
- Endpoint yang menggunakan cookie-based session (jika ada, misalnya untuk halaman admin berbasis Blade di masa depan) wajib menyertakan CSRF token melalui middleware VerifyCsrfToken bawaan Laravel.
- SameSite=Strict/Lax diterapkan pada cookie apa pun yang digunakan aplikasi (termasuk refresh token jika disimpan sebagai httpOnly cookie).

## **8.4 XSS Protection**

- React secara default melakukan escaping otomatis pada seluruh output ke DOM, sehingga risiko XSS dari data yang dirender melalui JSX sudah tertangani pada level framework.
- Penggunaan dangerouslySetInnerHTML DILARANG kecuali untuk kasus sangat spesifik (misalnya merender deskripsi produk yang telah melalui proses sanitasi HTML di backend menggunakan library seperti HTMLPurifier) — dan wajib disertai komentar kode yang menjelaskan alasan dan proses sanitasinya.
- Backend menetapkan header Content-Security-Policy yang membatasi sumber script yang diizinkan berjalan di halaman (lihat 8.7).
- Input dari user yang disimpan dan ditampilkan kembali ke user lain (misalnya komentar review) melewati proses sanitasi/escaping sebelum disimpan ke database.

## **8.5 Validasi Upload File**

Diperlukan sebagai perluasan kritis dari poin keamanan PRD asli, karena fitur upload gambar produk dan foto profil merupakan salah satu vektor serangan paling umum jika tidak divalidasi dengan benar.

| Aturan | Detail |
| --- | --- |
| Tipe file diizinkan | image/jpeg, image/png, image/webp — divalidasi berdasarkan MIME type asli file (magic bytes), bukan hanya ekstensi nama file |
| Ukuran maksimum | 5 MB per file untuk gambar produk, 2 MB untuk foto profil |
| Dimensi minimum | Direkomendasikan minimum 800x1000px untuk gambar produk agar kualitas tampilan tetap tajam pada zoom |
| Nama file | Di-generate ulang secara acak (UUID) oleh backend saat penyimpanan — nama file asli dari user tidak pernah digunakan langsung sebagai nama file tersimpan |

Keempat aturan di atas ditegakkan sebagai validasi wajib pada setiap endpoint upload (produk maupun profil), memeriksa tipe file, ukuran, dan dimensi sebelum file diteruskan ke proses penyimpanan di Supabase Storage.

## **8.6 SQL Injection Prevention**

- Seluruh query database menggunakan Eloquent ORM atau Query Builder Laravel, yang secara otomatis melakukan parameter binding — menyisipkan variabel langsung ke dalam string SQL mentah (raw query dengan concatenation) DILARANG di seluruh codebase.
- Jika raw query benar-benar diperlukan untuk optimasi performa tertentu, wajib menggunakan parameter binding eksplisit (placeholder bertanda tanya yang diisi terpisah dari string query), tidak pernah penggabungan string secara langsung.

### **8.6.1 Penanganan Race Condition Stok**

Terkait erat dengan integritas data (bukan SQL injection secara langsung, namun sama-sama kritis untuk keandalan transaksi): pengurangan stok saat checkout rentan terhadap race condition jika dua pembeli melakukan checkout bersamaan untuk stok terakhir yang sama.
Solusinya adalah pengurangan stok dilakukan sebagai satu operasi atomik di level database: perintah update menyertakan kondisi "stok tersedia mencukupi" langsung di dalam klausanya sendiri, sehingga pengecekan ketersediaan dan pengurangan stok terjadi bersamaan dalam satu langkah database, bukan sebagai dua langkah terpisah (cek dulu, baru kurangi) yang rentan diselip transaksi lain di antaranya. Jika tidak ada baris yang ter-update (karena stok ternyata sudah tidak cukup), sistem mengetahui hal ini dan menggagalkan transaksi checkout tersebut.
**PENTING**  Pola atomic decrement ini memastikan pengurangan stok dan pengecekan ketersediaan terjadi dalam satu operasi database yang atomik, mencegah dua transaksi bersamaan sama-sama "lolos" validasi stok padahal stok sebenarnya sudah tidak mencukupi.

## **8.7 Rate Limiting**


| Endpoint / Grup | Batas | Alasan |
| --- | --- | --- |
| POST /auth/login | 5 percobaan / menit per IP | Mencegah brute-force credential |
| POST /auth/register | 10 percobaan / jam per IP | Mencegah pembuatan akun massal (spam/bot) |
| POST /reviews | 20 request / jam per user | Mencegah spam review |
| Endpoint publik umum (GET) | 120 request / menit per IP | Perlindungan dasar terhadap scraping berlebihan/DDoS ringan |
| POST /webhooks/midtrans | Tidak dibatasi rate, namun wajib validasi signature (lihat 2.7.2) | Endpoint server-to-server, dilindungi melalui signature, bukan rate limit |

Batas-batas di atas diterapkan sebagai middleware throttle pada masing-masing route, dengan response HTTP 429 (Too Many Requests) dikembalikan ke client saat batas terlampaui.

## **8.8 Secure Headers**

Header keamanan berikut diterapkan pada seluruh response API melalui middleware khusus:

| Header | Nilai | Fungsi |
| --- | --- | --- |
| X-Content-Type-Options | nosniff | Mencegah browser menebak tipe konten secara otomatis |
| X-Frame-Options | DENY | Mencegah halaman di-embed dalam iframe (clickjacking) |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | Memaksa koneksi HTTPS |
| Content-Security-Policy | default-src 'self'; script-src 'self' | Membatasi sumber resource yang dapat dijalankan |
| Referrer-Policy | strict-origin-when-cross-origin | Membatasi informasi referrer yang dikirim ke situs lain |


## **8.9 Role-Based Access Control (RBAC)**

Matriks izin akses berdasarkan role, melengkapi definisi tugas Owner dan Admin pada 1.7.

| Aksi | Customer | Admin | Owner |
| --- | --- | --- | --- |
| Melihat & membeli produk | Ya | Ya | Ya |
| Mengelola produk (CRUD) | Tidak | Ya | Ya |
| Memproses & mengubah status order | Tidak | Ya | Ya |
| Mengelola kupon & banner | Tidak | Ya | Ya |
| Melihat laporan penjualan (Reports) | Tidak | Tidak | Ya |
| Mengekspor laporan finansial | Tidak | Tidak | Ya |
| Mengelola akun Admin lain | Tidak | Tidak | Ya |

Implementasi menggunakan Laravel Policy dan middleware: seluruh route di bawah prefix /admin dilindungi oleh middleware yang memeriksa apakah role user yang sedang login termasuk "admin" atau "owner" — jika tidak, request ditolak dengan HTTP 403 sebelum mencapai Controller. Endpoint yang lebih sensitif (seperti laporan penjualan pada 5.11.5) mendapat lapisan middleware tambahan yang mengharuskan role "owner" secara spesifik, mengunci akses Admin biasa dari data finansial menyeluruh.


# **BAB 9 — PANDUAN OPTIMASI PERFORMA**

Performa situs berdampak langsung pada pengalaman pengguna yang menjadi fokus persona Sarah (checkout cepat, tanpa hambatan) sekaligus memengaruhi SEO. Bab ini menjabarkan implementasi konkret dari empat poin performa pada PRD asli.

## **9.1 Lazy Loading**

- Gambar produk di luar viewport awal (below the fold) menggunakan atribut loading="lazy" pada tag <img>, kecuali gambar pertama pada hero banner (dimuat secara eager untuk optimasi LCP — lihat 9.5).
- Komponen halaman yang berat (misalnya chart pada dashboard admin) dimuat secara dinamis hanya saat halaman tersebut benar-benar diakses, disertai skeleton placeholder selama proses pemuatan — sehingga tidak membebani bundle awal aplikasi customer-facing yang jauh lebih sering diakses.

## **9.2 Image Optimization Pipeline**

Mengingat target audiens sangat sensitif terhadap kualitas visual (persona Sarah: "foto kurang jelas" sebagai pain point) namun tetap membutuhkan kecepatan muat tinggi, pipeline berikut diterapkan untuk menyeimbangkan kualitas dan performa:
- Saat Admin/Owner mengunggah gambar produk melalui admin panel, backend memproses gambar menjadi beberapa varian ukuran (responsive images): thumbnail (400px), medium (800px), large (1600px).
- Setiap varian dikonversi ke format WebP (dengan fallback JPEG untuk kompatibilitas browser lama) sebelum disimpan ke Supabase Storage.
- Frontend menyertakan seluruh varian ukuran pada atribut responsive image (srcset/sizes) di setiap tag gambar, agar browser secara otomatis memilih dan mengunduh ukuran gambar paling sesuai dengan lebar layar perangkat pengguna, tanpa mengunduh gambar beresolusi besar yang tidak diperlukan pada layar kecil.
Pemrosesan gambar di backend dijalankan sebagai queued job (proses latar belakang), agar tidak memperlambat response saat admin mengunggah gambar produk.

## **9.3 Code Splitting**

- Vite secara otomatis melakukan code splitting per route jika komponen halaman diimpor menggunakan dynamic import (lihat contoh 9.1).
- Modul admin panel dipisahkan sepenuhnya (chunk terpisah) dari modul storefront customer-facing, karena mayoritas pengunjung (customer) tidak pernah mengakses kode admin sama sekali.
- Library besar yang jarang digunakan (misalnya library chart untuk dashboard admin) dikeluarkan dari chunk utama melalui manualChunks pada konfigurasi Vite (lihat 2.2.2).

## **9.4 Dynamic Import & Backend Query Optimization**


### **9.4.1 Mencegah N+1 Query**

Masalah performa paling umum pada aplikasi Laravel adalah N+1 query — mengambil daftar produk, lalu tanpa disadari melakukan satu query tambahan terpisah untuk setiap produk guna mengambil relasinya (gambar, varian). Untuk daftar 20 produk, pola yang salah ini dapat menghasilkan puluhan query pada satu halaman, padahal seluruh relasi tersebut semestinya dapat diambil dalam maksimal dua-tiga query total menggunakan eager loading (memuat relasi di muka bersamaan dengan data utamanya, bukan satu per satu belakangan).
- Laravel Debugbar atau Telescope digunakan pada environment development untuk memantau jumlah query per request dan mendeteksi N+1 sedini mungkin.

### **9.4.2 Database Indexing**

Seluruh kolom yang sering digunakan pada klausa WHERE, JOIN, atau ORDER BY telah diberi index pada definisi skema (lihat Bab 4) — termasuk foreign key, slug, status, dan created_at pada tabel dengan volume data besar (products, orders).

## **9.5 Caching Strategy**


| Data | Strategi Cache | Durasi/Invalidasi |
| --- | --- | --- |
| Daftar kategori | Cache Redis (backend) | Invalidasi otomatis saat ada perubahan kategori (create/update/delete) |
| Homepage sections (Best Seller, New Arrival) | Cache Redis (backend), TTL 15 menit | Invalidasi terjadwal + manual saat produk baru dipublish |
| Response GET produk/kategori (frontend) | TanStack Query cache, staleTime 5 menit | Refetch otomatis di background saat data dianggap stale |
| Aset statis (JS/CSS/gambar build) | CDN Vercel, cache-control immutable | Otomatis ter-invalidasi via content hash pada nama file setiap build baru |


## **9.6 Target Metrik Performa (Core Web Vitals)**


| Metrik | Target | Keterangan |
| --- | --- | --- |
| LCP (Largest Contentful Paint) | < 2.5 detik | Waktu render elemen konten terbesar (biasanya hero banner) |
| FID / INP (Interactivity) | < 200 ms | Waktu respons terhadap interaksi pertama pengguna |
| CLS (Cumulative Layout Shift) | < 0.1 | Stabilitas visual — dicegah melalui skeleton loading dan dimensi gambar yang ditetapkan eksplisit |
| TTFB (Time to First Byte) | < 600 ms | Waktu respons awal dari server backend |



# **BAB 10 — PANDUAN DEPLOYMENT**


## **10.1 Daftar Environment Variable**


### **10.1.1 Frontend (.env)**


| Variable | Contoh Nilai | Keterangan |
| --- | --- | --- |
| VITE_API_BASE_URL | https://api.pleatsssi.com/api/v1 | Base URL backend API |
| VITE_GOOGLE_CLIENT_ID | 123456-abc.apps.googleusercontent.com | Client ID untuk Google OAuth (jika alur diinisiasi dari frontend) |
| VITE_MIDTRANS_CLIENT_KEY | SB-Mid-client-xxxxxxx | Client key Midtrans, aman untuk diekspos ke frontend (bukan server key) |
| VITE_INSTAGRAM_USERNAME | pleatsssi.official | Digunakan untuk tautan pada bagian Instagram Feed |


### **10.1.2 Backend (.env)**


| Variable | Keterangan |
| --- | --- |
| APP_ENV | 'production', 'staging', atau 'local' |
| APP_URL | URL publik backend API |
| DB_CONNECTION | 'pgsql' |
| DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD | Kredensial koneksi PostgreSQL |
| REDIS_HOST, REDIS_PASSWORD, REDIS_PORT | Kredensial koneksi Redis (cache & queue) |
| SANCTUM_STATEFUL_DOMAINS | Domain frontend yang diizinkan (untuk konfigurasi CORS/Sanctum) |
| GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI | Kredensial OAuth Google (Socialite) |
| MIDTRANS_SERVER_KEY | Server key Midtrans — RAHASIA, tidak pernah diekspos ke frontend |
| MIDTRANS_CLIENT_KEY | Client key Midtrans (disinkronkan dengan VITE_MIDTRANS_CLIENT_KEY di frontend) |
| MIDTRANS_IS_PRODUCTION | true/false — menentukan environment Sandbox atau Production Midtrans |
| SUPABASE_URL, SUPABASE_SERVICE_KEY | Kredensial akses Supabase Storage — RAHASIA |
| MAIL_MAILER, MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD | Konfigurasi pengiriman email transaksional |

**KRITIS**  MIDTRANS_SERVER_KEY dan SUPABASE_SERVICE_KEY tidak boleh pernah muncul di kode frontend, commit history, atau log aplikasi dalam bentuk apa pun. Kedua nilai ini hanya boleh ada di environment variable backend production.

## **10.2 Langkah Deployment Frontend (Vercel)**

- Hubungkan repository GitHub proyek frontend ke akun Vercel melalui dashboard Vercel ("Import Project").
- Konfigurasi Build Command: npm run build, Output Directory: dist (default Vite).
- Tambahkan seluruh environment variable pada 10.1.1 melalui Vercel Dashboard → Settings → Environment Variables, dipisahkan antara Production, Preview, dan Development jika nilainya berbeda.
- Atur custom domain (misalnya www.pleatsssi.com) melalui Vercel Dashboard → Domains, lalu perbarui DNS record (CNAME/A record) sesuai instruksi Vercel.
- Setiap push ke branch main akan otomatis men-deploy ke production; push ke branch lain/pull request akan menghasilkan preview deployment terpisah.

## **10.3 Langkah Deployment Backend (Docker di VPS)**

- Siapkan VPS dengan Docker dan Docker Compose terinstal (Ubuntu 22.04 LTS direkomendasikan).
- Clone repository backend ke VPS, salin file environment contoh menjadi file environment aktif, isi seluruh variable sesuai 10.1.2.
- Build lalu jalankan seluruh container (app, nginx, db, redis) melalui Docker Compose.
- Jalankan migrasi database di dalam container aplikasi agar seluruh tabel pada Bab 4 tersedia di database production.
- (Opsional, untuk data awal) Jalankan seeder untuk mengisi data dasar seperti kategori produk.
- Konfigurasi Nginx untuk mengarahkan domain API (misalnya api.pleatsssi.com) ke container aplikasi.
- Terbitkan sertifikat SSL Let’s Encrypt melalui Certbot bagi domain API, lalu pastikan Nginx mengalihkan seluruh traffic HTTP ke HTTPS.
- Konfigurasi proses queue worker agar berjalan persisten di dalam container, sehingga job asinkron (email, pemrosesan webhook) tetap diproses di latar belakang.

## **10.4 Konfigurasi Nginx**

Konfigurasi Nginx untuk domain API menetapkan dua blok server: blok pertama menerima traffic HTTP biasa (port 80) dan langsung mengalihkannya (redirect) ke HTTPS; blok kedua menerima traffic HTTPS (port 443) menggunakan sertifikat SSL dari Let’s Encrypt, lalu meneruskan seluruh request PHP ke container aplikasi Laravel melalui protokol FastCGI. Dengan susunan ini, tidak ada satu pun request ke API yang diproses tanpa enkripsi.

## **10.5 CI/CD Pipeline (GitHub Actions)**

Pipeline otomatis untuk backend dijalankan setiap ada push ke branch main, terdiri dari dua tahap berurutan:
- Tahap test: checkout kode terbaru, install dependency Composer, lalu jalankan seluruh test suite. Jika ada satu saja test yang gagal, pipeline berhenti di sini dan tahap deploy tidak dijalankan.
- Tahap deploy (hanya berjalan jika tahap test lolos): terhubung ke VPS melalui SSH menggunakan kredensial yang disimpan sebagai secret CI (host, username, dan private key — tidak pernah ditulis langsung di file pipeline), lalu di sisi VPS: tarik kode terbaru, build ulang image Docker, jalankan ulang container, dan jalankan migrasi database.

## **10.6 Checklist Sebelum Go-Live**

- MIDTRANS_IS_PRODUCTION diatur ke true dan kredensial production (bukan sandbox) telah dikonfigurasi.
- Seluruh environment variable rahasia telah diverifikasi tidak muncul pada repository/commit history publik.
- SSL aktif dan valid pada domain frontend maupun backend.
- Backup otomatis database PostgreSQL telah dikonfigurasi (misalnya cron job pg_dump harian).
- Rate limiting dan secure headers (Bab 8) telah diverifikasi aktif pada environment production.
- Alur checkout-hingga-pembayaran telah diuji end-to-end menggunakan kredensial production Midtrans dengan nominal transaksi kecil.


# **BAB 11 — ROADMAP FITUR MASA DEPAN**

Sembilan fitur berikut merupakan perluasan dari daftar Future Features pada PRD asli, masing-masing disertai catatan teknis awal sebagai bahan perencanaan tim di fase pengembangan berikutnya (di luar cakupan MVP yang dijabarkan pada Bab 1–10).

### **Loyalty Program**

Sistem poin yang terkumpul setiap transaksi, dapat ditukar menjadi diskon pada pembelian berikutnya.
- Memerlukan tabel baru: loyalty_points (saldo per user) dan loyalty_transactions (riwayat perolehan/penukaran).
- Aturan perolehan poin (misalnya 1 poin per Rp10.000 belanja) dikelola sebagai konfigurasi, bukan hardcode.


### **Membership**

Tingkatan keanggotaan (misalnya Silver/Gold/Platinum) berdasarkan akumulasi belanja, memberikan benefit berbeda (diskon eksklusif, akses early-access koleksi baru).
- Berkaitan erat dengan Loyalty Program — tier dapat dihitung dari total_spend pada tabel users atau tabel agregasi terpisah.
- Memerlukan job terjadwal (scheduled job) untuk evaluasi ulang tier secara berkala.


### **AI Outfit Recommendation**

Rekomendasi kombinasi outfit berdasarkan riwayat belanja atau preferensi gaya pengguna.
- Dapat dimulai dengan pendekatan rule-based sederhana (kombinasi kategori yang sering dibeli bersamaan) sebelum beralih ke model machine learning.
- Memerlukan endpoint terpisah, kemungkinan layanan microservice tersendiri di luar Laravel API utama jika model ML kompleks.


### **Virtual Try-On**

Simulasi visual bagaimana produk terlihat saat dikenakan pengguna, menggunakan foto atau kamera real-time.
- Fitur dengan kompleksitas teknis tertinggi pada roadmap ini — kemungkinan memerlukan integrasi pihak ketiga (AR SDK) daripada dibangun sepenuhnya in-house.
- Pertimbangan performa signifikan untuk perangkat mobile kelas menengah-bawah.


### **Referral Program**

Pengguna mendapat insentif (diskon/poin) ketika mengajak pengguna baru yang berhasil melakukan pembelian.
- Memerlukan kode referral unik per user dan tabel referrals untuk melacak hubungan pengundang-diundang beserta status konversinya.


### **Gift Card**

Kartu hadiah digital dengan nominal tertentu yang dapat dibeli dan digunakan sebagai metode pembayaran (sebagian/penuh).
- Memerlukan tabel gift_cards (kode, saldo, masa berlaku) dan penyesuaian pada CheckoutService agar dapat menerima kombinasi pembayaran gift card + Midtrans.


### **Mobile App**

Aplikasi native/hybrid (iOS & Android) sebagai kanal tambahan di luar website.
- Backend API yang sudah dibangun (Bab 5) dirancang agar dapat langsung dikonsumsi ulang oleh aplikasi mobile tanpa perubahan signifikan, karena sudah bersifat headless/decoupled sejak awal.
- Autentikasi Sanctum mendukung token personal access yang sesuai untuk konteks mobile app di luar SPA.


### **Multi Language**

Dukungan bahasa selain Indonesia (misalnya Inggris) untuk menjangkau audiens internasional.
- Frontend: menggunakan library i18n (misalnya react-i18next) dengan seluruh string UI dipindahkan ke file terjemahan sejak awal, bukan hardcoded di komponen.
- Backend: kolom deskripsi produk memerlukan pendekatan translatable (tabel terjemahan terpisah atau kolom JSONB per bahasa).


### **Multi Currency**

Dukungan tampilan harga dalam mata uang selain Rupiah untuk pembeli internasional.
- Memerlukan integrasi layanan kurs (exchange rate API) dan keputusan bisnis apakah transaksi tetap diproses dalam IDR (dengan tampilan konversi estimasi) atau benar-benar multi-currency pada level pembayaran Midtrans.



## **11.1 Prioritisasi yang Disarankan**

Berdasarkan kompleksitas implementasi relatif terhadap dampak bisnis, urutan berikut disarankan sebagai panduan awal diskusi tim (bukan keputusan final — tetap memerlukan validasi bersama Owner):

| Prioritas | Fitur | Alasan |
| --- | --- | --- |
| Tinggi | Referral Program | Kompleksitas rendah, berpotensi langsung mendorong akuisisi pelanggan baru |
| Tinggi | Loyalty Program | Mendorong repeat purchase, kompleksitas teknis moderat |
| Sedang | Membership | Melengkapi Loyalty Program, memerlukan Loyalty Program berjalan lebih dulu |
| Sedang | Mobile App | Backend sudah siap, namun memerlukan investasi tim/waktu development terpisah |
| Sedang | Gift Card | Fitur bernilai jual tinggi menjelang musim tertentu (Lebaran, Natal) |
| Rendah | Multi Language & Multi Currency | Relevan hanya jika ekspansi pasar internasional menjadi prioritas bisnis |
| Rendah | AI Outfit Recommendation | Nilai tambah signifikan namun memerlukan volume data transaksi yang cukup besar terlebih dahulu agar rekomendasi akurat |
| Eksploratif | Virtual Try-On | Kompleksitas dan biaya tertinggi; disarankan riset kelayakan (feasibility study) terpisah sebelum commit development |


*— AKHIR DOKUMEN —*