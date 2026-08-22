# **ROADMAP PENGEMBANGAN SISTEM IKANBAKAR99**

**Klien:** Bpk. Sutrisno (Ikan Bakar P. Tris)

**Status Awal:** Tidak ada aset digital/sosmed.

**Tujuan Utama:** Membangun sistem *online menu order* yang valid secara operasional (Puri Delta \-\> Ungaran Timur \-\> Ungaran Barat & Sekitarnya) sambil memastikan perputaran *cashflow* sejak Fase 1\.

## **🚀 FASE 1: VALIDASI LOKAL, CASHFLOW, & DATA GATHERING (PURI DELTA)**

**Fokus:** Meluncurkan *Landing Page* versi MVP untuk area Puri Delta yang berfungsi ganda: sebagai mesin penghasil *cashflow* (pemesanan) dan alat *troubleshooting/data gathering* (riset pasar).

* \[ \] **Langkah 1.1: Setup Aset Digital Dasar & AEO (Answer Engine Optimization)**  
  * \[ \] **Google Business Profile (GBP) Teroptimasi:** Gunakan teks di bawah ini untuk *Business Description* (Mendekati limit 750 karakter, dirancang dengan formula AIDA):"Ikanbakar99: Spesialis Ikan Bakar & Ayam Bakar di Ungaran  
    Ikanbakar99 adalah penyedia sajian ikan bakar khas P. Tris yang melayani pesanan untuk area Puri Delta, Ungaran Timur, Ungaran Barat, dan sekitarnya. Kami menghadirkan hidangan segar dengan bumbu meresap sempurna untuk solusi makan praktis keluarga Anda.  
    Menu Spesial Kami:  
    • Lele Bakar & Ayam Bule Bakar  
    • Nila Bakar  
    • Gurameh Bakar  
    • Pilihan Pendamping: Sambal Terasi & Sambal Bawang  
    Kami fokus memberikan pelayanan yang cepat dan kualitas rasa yang konsisten. Pesan menu favorit Anda sekarang dan nikmati sajian istimewa langsung di meja Anda."  
  * \[ \] **WhatsApp Business:** Setup khusus operasional pesanan dengan *Quick Replies* untuk membalas form order otomatis (WhatsApp Pak Sutrisno: 082227459399).  
* \[ \] **Langkah 1.2: Pembuatan Landing Page & Multi-Step Form (Lovable.dev)**  
  * \[ \] **Arsitektur Multi-Halaman (*Routing*):**  
    * Halaman Utama (/): *Hero Section*, *Menu Showcase* (Menu Boom, Pilihan, Spesial), dan tombol *CTA* lengket (*sticky*) di bagian bawah ("Pesan Sekarang") yang mengarah ke sub-halaman order.  
    * Sub-Halaman Order (/order): *3-Step Wizard Form* dengan *Progressive Profiling*.  
      * *Step 1 (Order):* Pemilihan menu (Lele Bakar Rp10k, Nila Rp17k, Ayam Bule Rp10k, Gurameh Rp30k) dan pilihan sambal (Terasi/Bawang).  
      * *Step 2 (Market Research):* Pertanyaan riset pasar ringan ("Karakteristik ikan bakar yang paling Anda suka?" & "Menu lauk/minuman apa lagi yang ingin Anda pesan di sini?").  
      * *Step 3 (Checkout):* Data pengiriman (Nama, No. WhatsApp, Alamat spesifik di Puri Delta).  
  * \[ \] **UI/UX & Accessibility Rules:**  
    * Skema Warna: Background Merah, Typography Utama Kuning, Aksen Hitam.  
    * *Mobile-First & Thumb-Zone:* Tombol navigasi/CTA berada di area jangkauan jempol (bagian bawah layar).  
    * *Form Accessibility:* Wajib menggunakan *Top-Aligned Labels* (label di atas input), BUKAN *placeholder text* yang menghilang.  
    * *Progress Indicator:* Indikator visual jelas (misal: "Langkah 1 dari 3") untuk memanfaatkan efek *sunk-cost*.  
  * \[ \] **Aksi Submit:** Format data pesanan & riset menjadi *string* rapi, lalu *redirect* pengguna ke WhatsApp API (wa.me) untuk dikirim langsung ke Pak Sutrisno.  
* \[ \] **Langkah 1.3: Operasional & Analisis Data**  
  * \[ \] Bagikan tautan ke grup WA warga Puri Delta.  
  * \[ \] Kumpulkan data dari *Step 2* untuk memvalidasi R\&D menu baru dan memperbaiki SOP dapur berdasarkan preferensi rasa lokal.

## **📈 FASE 2: DATABASE OTOMATIS & EKSPANSI (UNGARAN TIMUR)**

**Fokus:** Beralih dari output WhatsApp ke sistem Database (Supabase) untuk manajemen pesanan yang lebih profesional dan jangkauan wilayah yang lebih luas.

* \[ \] **Langkah 2.1: Integrasi Database Supabase**  
  * \[ \] Sambungkan form Lovable dengan *backend* Supabase.  
  * \[ \] Terapkan skema database deklaratif untuk memisahkan tabel orders dan customer\_feedbacks.  
  * \[ \] Otomatisasi notifikasi ke dapur menggunakan Supabase Edge Functions.  
* \[ \] **Langkah 2.2: Ekspansi Area & UX**  
  * \[ \] Tambahkan opsi area pengiriman mencakup Ungaran Timur.  
  * \[ \] Tampilkan *Trust Signals* berupa testimoni riil yang didapat dari pelanggan di Fase 1\.

## **🏆 FASE 3: SISTEM FULL-STACK & SKALA PENUH (UNGARAN BARAT & SEKITARNYA)**

**Fokus:** Manajemen pesanan terpusat (Admin Panel) dan kesiapan visibilitas pencarian AI (AEO).

* \[ \] **Langkah 3.1: Owner Dashboard**  
  * \[ \] Buat Admin Panel (Supabase Auth) untuk Pak Sutrisno memonitor pesanan masuk, memproses status (*Pending* \-\> *Dimasak* \-\> *Selesai*), dan melihat analitik riset pasar secara *real-time*.  
* \[ \] **Langkah 3.2: SEO Lokal & AEO**  
  * \[ \] Optimasi *Schema Markup* (*LocalBusiness*, *Menu*) agar ChatGPT/Perplexity merekomendasikan Ikanbakar99.  
  * \[ \] Ekspansi layanan pengiriman hingga mencakup Ungaran Barat dan sekitarnya.