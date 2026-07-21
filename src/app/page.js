'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ShoppingBag, MapPin, Phone, RefreshCw, Calendar, Search, 
  ShieldCheck, HelpCircle, FileText, CheckCircle2, Clock, Truck, ChevronRight 
} from 'lucide-react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("katalog"); // katalog | syarat | faq | kontak

  // Tanggal Sewa
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch Data dari Supabase
  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error mengambil data:', error.message);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Hitung Hari
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const totalDays = calculateDays();

  // Hitung Total Price
  const calculateTotalPrice = () => {
    const totalPerDay = cart.reduce((sum, item) => sum + Number(item.price_per_day), 0);
    return totalPerDay * totalDays;
  };

  const categories = ["Semua", "Tenda", "Carrier", "Sepatu", "Alat Masak", "Aksesoris"];

  // Filter Kategori + Search
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleCheckoutWA = () => {
    const adminPhone = "6281234567890"; // Ganti nomor toko
    const listBarang = cart
      .map((item, index) => `${index + 1}. ${item.name} (Rp ${Number(item.price_per_day).toLocaleString('id-ID')}/hari)`)
      .join('\n');

    const tglMulai = startDate || "Belum dipilih";
    const tglSelesai = endDate || "Belum dipilih";
    const totalHarga = calculateTotalPrice().toLocaleString('id-ID');

    const pesan = encodeURIComponent(
      `Halo Admin PuncakRent Outdoor!\nSaya ingin menyewa peralatan berikut:\n\n${listBarang}\n\n` +
      `📅 *Rencana Sewa:* ${tglMulai} s/d ${tglSelesai} (${totalDays} Hari)\n` +
      `💰 *Estimasi Biaya:* Rp ${totalHarga}\n\n` +
      `Mohon diinfokan ketersediaan unit dan prosedur jaminannya. Terima kasih!`
    );

    window.open(`https://wa.me/${adminPhone}?text=${pesan}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-28">
      
      

      {/* Main Header */}
      <header className="bg-emerald-800 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight cursor-pointer" onClick={() => setActiveTab('katalog')}>
            <MapPin className="text-emerald-400" />
            <span>PuncakRent<span className="text-emerald-400">.outdoor</span></span>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button 
              onClick={() => setActiveTab('katalog')} 
              className={`hover:text-emerald-300 transition ${activeTab === 'katalog' ? 'text-emerald-300 underline underline-offset-8 font-bold' : ''}`}
            >
              Katalog Alat
            </button>
            <button 
              onClick={() => setActiveTab('syarat')} 
              className={`hover:text-emerald-300 transition ${activeTab === 'syarat' ? 'text-emerald-300 underline underline-offset-8 font-bold' : ''}`}
            >
              Syarat & Ketentuan
            </button>
            <button 
              onClick={() => setActiveTab('faq')} 
              className={`hover:text-emerald-300 transition ${activeTab === 'faq' ? 'text-emerald-300 underline underline-offset-8 font-bold' : ''}`}
            >
              FAQ
            </button>
            <button 
              onClick={() => setActiveTab('kontak')} 
              className={`hover:text-emerald-300 transition ${activeTab === 'kontak' ? 'text-emerald-300 underline underline-offset-8 font-bold' : ''}`}
            >
              Lokasi Toko
            </button>
          </nav>

          <button className="bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 px-4 py-2 rounded-xl flex items-center gap-2 transition text-sm font-semibold">
            <ShoppingBag size={18} />
            <span>{cart.length} Barang</span>
          </button>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden bg-emerald-900 border-t border-emerald-700 justify-around py-2 text-xs font-medium text-emerald-100">
          <button onClick={() => setActiveTab('katalog')} className={activeTab === 'katalog' ? 'text-emerald-300 font-bold' : ''}>Katalog</button>
          <button onClick={() => setActiveTab('syarat')} className={activeTab === 'syarat' ? 'text-emerald-300 font-bold' : ''}>Syarat</button>
          <button onClick={() => setActiveTab('faq')} className={activeTab === 'faq' ? 'text-emerald-300 font-bold' : ''}>FAQ</button>
          <button onClick={() => setActiveTab('kontak')} className={activeTab === 'kontak' ? 'text-emerald-300 font-bold' : ''}>Lokasi</button>
        </div>
      </header>

      {/* --- TAB 1: KATALOG UTAMA --- */}
      {activeTab === 'katalog' && (
        <>
          {/* Hero Banner */}
          <section className="bg-linear-to-b from-emerald-900 to-emerald-800 text-white py-12 px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <span className="bg-emerald-700/60 text-emerald-200 text-xs px-3 py-1 rounded-full font-medium border border-emerald-600">
                Penyewaan Alat Gunung Terlengkap & Bersih
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold mt-4 mb-3 leading-tight">
                Sewa Alat Pendakian Tanpa Ribet
              </h1>
              <p className="text-emerald-100 text-sm md:text-base max-w-xl mx-auto">
                Peralatan selalu dicuci steril, rutin dicek kelaikannya, dan siap digunakan untuk petualangan gunungmu!
              </p>
            </div>
          </section>

          {/* Form Tanggal Sewa & Search Bar */}
          <div className="max-w-5xl mx-auto -mt-6 px-4 relative z-10">
            <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Tanggal Sewa */}
              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Calendar size={18} className="text-emerald-600" />
                  <span>Tanggal Sewa:</span>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="border border-slate-200 p-2 rounded-lg text-slate-700 text-xs focus:ring-2 focus:ring-emerald-600 outline-none w-full"
                  />
                  <span className="text-xs font-bold text-slate-400">s/d</span>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="border border-slate-200 p-2 rounded-lg text-slate-700 text-xs focus:ring-2 focus:ring-emerald-600 outline-none w-full"
                  />
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari alat (contoh: Tenda)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

            </div>
          </div>

          {/* Keunggulan Toko Bar */}
          <div className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <ShieldCheck className="text-emerald-600" size={18} /> Unit Steril & Clean
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="text-emerald-600" size={18} /> Bebas Cek Kualitas
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <Clock className="text-emerald-600" size={18} /> Ambil / Kembali Cepat
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <Truck className="text-emerald-600" size={18} /> Siap COD / Kirim Instan
            </div>
          </div>

          {/* Main Content Catalog */}
          <main className="max-w-6xl mx-auto px-4 py-8">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-emerald-800 text-white shadow-md"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Loading */}
            {loading ? (
              <div className="text-center py-20 flex justify-center items-center gap-2 text-emerald-800 font-medium text-sm">
                <RefreshCw className="animate-spin" /> Memuat katalog alat gunung...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border p-8">
                <p className="text-slate-500 font-medium">Tidak ada alat yang cocok dengan pencarian Anda.</p>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition duration-200 flex flex-col justify-between group">
                    <div>
                      <div className="h-48 bg-slate-100 overflow-hidden relative">
                        <img
                          src={item.image_url || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-3 left-3 text-[10px] bg-emerald-900/80 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-800 text-base mb-1">{item.name}</h3>
                        <p className="text-xs text-slate-400 mb-3">Stok: {item.stock} unit terawat</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-semibold text-slate-400">Rp</span>
                          <span className="text-xl font-extrabold text-emerald-800">
                            {Number(item.price_per_day).toLocaleString('id-ID')}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">/ hari</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full bg-slate-900 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1"
                      >
                        + Tambah ke Sewa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {/* --- TAB 2: SYARAT & KETENTUAN --- */}
      {activeTab === 'syarat' && (
        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <FileText size={28} className="text-emerald-700" />
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Syarat & Jaminan Penyewaan</h2>
                <p className="text-xs text-slate-500">Mohon dipahami demi kenyamanan dan keamanan bersama.</p>
              </div>
            </div>

            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <div>
                <h3 className="font-bold text-emerald-800 text-base mb-2">1. Dokumen Jaminan (Wajib)</h3>
                <p className="text-xs text-slate-600 mb-2">Penyewa wajib menjaminkan **2 Identitas Asli** yang masih berlaku dari daftar berikut:</p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>KTP Asli (Wajib)</li>
                  <li>SIM A / C Asli</li>
                  <li>STNK Atas Nama Sendiri</li>
                  <li>Kartu Tanda Mahasiswa / Pelajar</li>
                </ul>
              </div>

              <hr />

              <div>
                <h3 className="font-bold text-emerald-800 text-base mb-2">2. Pengambilan & Pengembalian Alat</h3>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Hitungan sewa adalah per 24 jam terhitung dari jam pengambilan alat.</li>
                  <li>Keterlambatan pengembalian tanpa konfirmasi akan dikenakan denda sebesar 50% dari harga sewa harian per jam.</li>
                  <li>Penyewa wajib memeriksa kondisi fisik alat bersama staf toko saat pengambilan.</li>
                </ul>
              </div>

              <hr />

              <div>
                <h3 className="font-bold text-emerald-800 text-base mb-2">3. Tanggung Jawab Kerusakan / Kehilangan</h3>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Alat yang robek, patah, atau hilang menjadi tanggung jawab penyewa untuk biaya perbaikan atau penggantian unit baru.</li>
                  <li>Alat dikembalikan dalam kondisi wajar (tidak perlu dicuci bersih total, biar tim staf toko yang sterilisasi).</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- TAB 3: FAQ --- */}
      {activeTab === 'faq' && (
        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <HelpCircle size={28} className="text-emerald-700" />
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Pertanyaan Sering Diajukan (FAQ)</h2>
                <p className="text-xs text-slate-500">Jawaban cepat untuk pertanyaan calon penyewa.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-sm text-slate-800 mb-1">Apakah tenda perlu dicuci sebelum dikembalikan?</h4>
                <p className="text-xs text-slate-600">Tidak perlu! Cukup bersihkan sisa tanah atau sampah di dalam tenda. Proses pencucian dan sterilisasi total dilakukan oleh tim kami gratis.</p>
              </div>

              <div className="border rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-sm text-slate-800 mb-1">Apakah bisa booking tanggal jauh-jauh hari?</h4>
                <p className="text-xs text-slate-600">Sangat bisa! Kami merekomendasikan booking minimal H-3 terutama menjelang libur panjang (*long weekend*) agar tidak kehabisan stok.</p>
              </div>

              <div className="border rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-sm text-slate-800 mb-1">Bagaimana jika ingin sewa dalam jumlah banyak (Rombongan)?</h4>
                <p className="text-xs text-slate-600">Silakan pilih alat di website lalu checkout via WhatsApp. Kami menyediakan diskon potongan harga khusus untuk pemesanan rombongan/organisasi.</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- TAB 4: LOKASI TOKO --- */}
      {activeTab === 'kontak' && (
        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Lokasi & Operasional Toko</h2>
            <p className="text-xs text-slate-500 mb-6">Silakan datang langsung ke basecamp/toko kami untuk cek alat.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 text-xs text-slate-700">
                <div>
                  <h4 className="font-bold text-emerald-800 text-sm mb-1">Alamat Basecamp:</h4>
                  <p>Jl. Pendaki Gunung No. 45, Kecamatan Outdoor, Kota Adventure 60123</p>
                </div>

                <div>
                  <h4 className="font-bold text-emerald-800 text-sm mb-1">Jam Operasional:</h4>
                  <p>Senin - Minggu: 08.00 - 21.00 WIB</p>
                </div>

                <div>
                  <h4 className="font-bold text-emerald-800 text-sm mb-1">Kontak WhatsApp:</h4>
                  <p className="font-bold text-emerald-700">+62 812-3456-7890</p>
                </div>
              </div>

              {/* Tampilan Google Maps Mockup */}
              <div className="bg-slate-100 rounded-xl border flex flex-col items-center justify-center p-6 text-center">
                <MapPin size={40} className="text-emerald-600 mb-2" />
                <p className="font-bold text-xs text-slate-700">PuncakRent Outdoor Basecamp</p>
                <p className="text-[10px] text-slate-400 mt-1 mb-3">Terintegrasi dengan Google Maps</p>
                <button className="bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-medium">
                  Buka Petunjuk Arah
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- FLOATING CHECKOUT BAR --- */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-6 z-50 w-11/12 max-w-2xl">
          <div>
            <p className="text-[11px] text-slate-400">{cart.length} Peralatan Dipilih ({totalDays} Hari)</p>
            <p className="font-extrabold text-emerald-400 text-xl">
              Rp {calculateTotalPrice().toLocaleString('id-ID')}
            </p>
          </div>
          <button
            onClick={handleCheckoutWA}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 text-xs transition shadow-lg"
          >
            <Phone size={16} />
            Sewa via WhatsApp
          </button>
        </div>
      )}

    </div>
  );
}