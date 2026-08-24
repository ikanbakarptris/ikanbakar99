# **ROADMAP PENGEMBANGAN SISTEM IKANBAKAR99**

**Klien:** Bpk. Sutrisno (Ikan Bakar P. Tris)

**Status Awal:** Tidak ada aset digital/sosmed.

**Tujuan Utama:** Membangun sistem _online menu order_ yang valid secara operasional (Puri Delta \-\> Ungaran Timur \-\> Ungaran Barat & Sekitarnya) sambil memastikan perputaran _cashflow_ sejak Fase 1\.

## **🚀 FASE 1: VALIDASI LOKAL, CASHFLOW, & DATA GATHERING (PURI DELTA)**

**Fokus:** Meluncurkan _Landing Page_ versi MVP untuk area Puri Delta yang berfungsi ganda: sebagai mesin penghasil _cashflow_ (pemesanan) dan alat _troubleshooting/data gathering_ (riset pasar).

- \[ \] **Langkah 1.1: Setup Aset Digital Dasar & AEO (Answer Engine Optimization)**
  - \[ \] **Google Business Profile (GBP) Teroptimasi:** Gunakan teks di bawah ini untuk _Business Description_ (Mendekati limit 750 karakter, dirancang dengan formula AIDA):"Ikanbakar99: Spesialis Ikan Bakar & Ayam Bakar di Ungaran  
    Ikanbakar99 adalah penyedia sajian ikan bakar khas P. Tris yang melayani pesanan untuk area Puri Delta, Ungaran Timur, Ungaran Barat, dan sekitarnya. Kami menghadirkan hidangan segar dengan bumbu meresap sempurna untuk solusi makan praktis keluarga Anda.  
    Menu Spesial Kami:  
    • Lele Bakar & Ayam Bule Bakar  
    • Nila Bakar  
    • Gurameh Bakar  
    • Pilihan Pendamping: Sambal Terasi & Sambal Bawang  
    Kami fokus memberikan pelayanan yang cepat dan kualitas rasa yang konsisten. Pesan menu favorit Anda sekarang dan nikmati sajian istimewa langsung di meja Anda."
  - \[ \] **WhatsApp Business:** Setup khusus operasional pesanan dengan _Quick Replies_ untuk membalas form order otomatis (WhatsApp Pak Sutrisno: 082227459399).
- \[ \] **Langkah 1.2: Pembuatan Landing Page & Multi-Step Form (Lovable.dev)**
  - \[ \] **Arsitektur Multi-Halaman (_Routing_):**
    - Halaman Utama (/): _Hero Section_, _Menu Showcase_ (Menu Boom, Pilihan, Spesial), dan tombol _CTA_ lengket (_sticky_) di bagian bawah ("Pesan Sekarang") yang mengarah ke sub-halaman order.
    - Sub-Halaman Order (/order): _3-Step Wizard Form_ dengan _Progressive Profiling_.
      - _Step 1 (Order):_ Pemilihan menu (Lele Bakar Rp10k, Nila Rp17k, Ayam Bule Rp10k, Gurameh Rp30k) dan pilihan sambal (Terasi/Bawang).
      - _Step 2 (Market Research):_ Pertanyaan riset pasar ringan ("Karakteristik ikan bakar yang paling Anda suka?" & "Menu lauk/minuman apa lagi yang ingin Anda pesan di sini?").
      - _Step 3 (Checkout):_ Data pengiriman (Nama, No. WhatsApp, Alamat spesifik di Puri Delta).
  - \[ \] **UI/UX & Accessibility Rules:**
    - Skema Warna: Background Merah, Typography Utama Kuning, Aksen Hitam.
    - _Mobile-First & Thumb-Zone:_ Tombol navigasi/CTA berada di area jangkauan jempol (bagian bawah layar).
    - _Form Accessibility:_ Wajib menggunakan _Top-Aligned Labels_ (label di atas input), BUKAN _placeholder text_ yang menghilang.
    - _Progress Indicator:_ Indikator visual jelas (misal: "Langkah 1 dari 3") untuk memanfaatkan efek _sunk-cost_.
  - \[ \] **Aksi Submit:** Format data pesanan & riset menjadi _string_ rapi, lalu _redirect_ pengguna ke WhatsApp API (wa.me) untuk dikirim langsung ke Pak Sutrisno.
- \[ \] **Langkah 1.3: Operasional & Analisis Data**
  - \[ \] Bagikan tautan ke grup WA warga Puri Delta.
  - \[ \] Kumpulkan data dari _Step 2_ untuk memvalidasi R\&D menu baru dan memperbaiki SOP dapur berdasarkan preferensi rasa lokal.

## **📈 FASE 2: DATABASE OTOMATIS & EKSPANSI (UNGARAN TIMUR)**

**Fokus:** Beralih dari output WhatsApp ke sistem Database (Supabase) untuk manajemen pesanan yang lebih profesional dan jangkauan wilayah yang lebih luas.

- \[ \] **Langkah 2.1: Integrasi Database Supabase**
  - \[ \] Sambungkan form Lovable dengan _backend_ Supabase.
  - \[ \] Terapkan skema database deklaratif untuk memisahkan tabel orders dan customer\_feedbacks.
  - \[ \] Otomatisasi notifikasi ke dapur menggunakan Supabase Edge Functions.
- \[ \] **Langkah 2.2: Ekspansi Area & UX**
  - \[ \] Tambahkan opsi area pengiriman mencakup Ungaran Timur.
  - \[ \] Tampilkan _Trust Signals_ berupa testimoni riil yang didapat dari pelanggan di Fase 1\.

## **🏆 FASE 3: SISTEM FULL-STACK & SKALA PENUH (UNGARAN BARAT & SEKITARNYA)**

**Fokus:** Manajemen pesanan terpusat (Admin Panel) dan kesiapan visibilitas pencarian AI (AEO).

- \[ \] **Langkah 3.1: Owner Dashboard**
  - \[ \] Buat Admin Panel (Supabase Auth) untuk Pak Sutrisno memonitor pesanan masuk, memproses status (_Pending_ \-\> _Dimasak_ \-\> _Selesai_), dan melihat analitik riset pasar secara _real-time_.
- \[ \] **Langkah 3.2: SEO Lokal & AEO**
  - \[ \] Optimasi _Schema Markup_ (_LocalBusiness_, _Menu_) agar ChatGPT/Perplexity merekomendasikan Ikanbakar99.
  - \[ \] Ekspansi layanan pengiriman hingga mencakup Ungaran Barat dan sekitarnya.
