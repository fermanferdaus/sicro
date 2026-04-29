# Sicro - Chicken Crunchy Roll Management System

Sicro adalah aplikasi _Point of Sale_ (POS) dan Sistem Manajemen Operasional berbasis web yang dirancang khusus untuk operasional **Chicken Crunchy Roll**. Aplikasi ini memfasilitasi berbagai kegiatan mulai dari pencatatan transaksi, manajemen inventaris (produk), hingga manajemen kepegawaian seperti penggajian dan bonus.

## 🚀 Tech Stack

Aplikasi ini dikembangkan menggunakan arsitektur _Monolith Modern_ berbasis **Stateful (Inertia)** dengan kombinasi teknologi terbaru:

- **Backend:** Laravel 12 (PHP 8.3)
- **Frontend:** React 19 + Inertia.js
- **Styling:** Tailwind CSS v4
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & Radix UI
- **Database:** MySQL
- **Authentication:** Inertia Session-based Auth + CSRF Protection

## 🌟 Fitur Utama

- **📊 Dashboard Interaktif:** Menampilkan metrik utama seperti total transaksi, omset, dan grafik penjualan real-time.
- **🛒 Transaksi (POS):** Antarmuka kasir yang responsif untuk mencatat pesanan pelanggan secara cepat.
- **📦 Master Data Produk:** Manajemen produk, harga, kategori, dan stok gambar produk dengan perlindungan duplikasi data.
- **👥 Manajemen Pegawai:** Pencatatan data pegawai yang terintegrasi dengan modul keuangan.
- **💸 Pengeluaran & Keuangan:** Pencatatan biaya operasional, bahan baku, dan pengeluaran harian.
- **💰 Gaji & Bonus:** Sistem penghitungan dan persetujuan gaji serta bonus pegawai.
- **📈 Laporan Komprehensif:** Export laporan PDF (menggunakan `jspdf` & `jspdf-autotable`) untuk rekap data bulanan dan harian.
- **⚙️ Pengaturan Akun & Toko:** Kustomisasi profil toko, pengaturan akses akun pengguna, dan manajemen logo.

## 📋 Prasyarat Sistem

Pastikan environment lokal Anda memenuhi spesifikasi berikut:

- PHP >= 8.2
- Composer
- Node.js (v18 atau terbaru) & npm
- MySQL / MariaDB Server

## 🛠️ Instalasi & Setup Lokal

Ikuti langkah-langkah berikut untuk menjalankan Sicro di mesin lokal Anda:

1. **Clone repositori ini:**

    ```bash
    git clone https://github.com/fermanferdaus/sicro.git
    cd sicro
    ```

2. **Install dependensi PHP (Backend):**

    ```bash
    composer install
    ```

3. **Install dependensi JavaScript (Frontend):**

    ```bash
    npm install
    ```

4. **Konfigurasi Environment:**
   Salin file konfigurasi _environment_ dan sesuaikan kredensial database Anda:

    ```bash
    cp .env.example .env
    ```

    Lalu, di file `.env`, atur bagian database:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=sicro_db
    DB_USERNAME=root
    DB_PASSWORD=
    ```

5. **Generate Application Key:**

    ```bash
    php artisan key:generate
    ```

6. **Jalankan Migrasi Database (dan Seeder jika ada):**

    ```bash
    php artisan migrate
    ```

7. **Jalankan Server Development:**
   Proyek ini menggunakan Laravel Vite Plugin. Jalankan perintah di bawah ini secara bersamaan untuk _hot-reloading_ React dan server Laravel:

    ```bash
    npm run dev
    # Jika menggunakan shortcut default composer:
    composer run dev
    ```

8. Buka browser dan akses aplikasi di: `http://localhost:8000`
