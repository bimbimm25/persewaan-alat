'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, MapPin, Phone, Calendar, Search, 
  ShieldCheck, HelpCircle, FileText, CheckCircle2, Clock, Truck, 
  Plus, Minus, Trash2, X, AlertCircle 
} from 'lucide-react';

// Data dummy produk lokal
const DUMMY_ITEMS = [
  {
    id: 1,
    name: "Tenda Eiger Camp 4 Person",
    category: "Tenda",
    price_per_day: 45000,
    stock: 4,
    image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    name: "Carrier Osprey Atmos AG 65L",
    category: "Carrier",
    price_per_day: 55000,
    stock: 3,
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    name: "Sepatu Salomon Quest 4 GTX",
    category: "Sepatu",
    price_per_day: 40000,
    stock: 3,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    name: "Kompor Portable Mawar Windproof",
    category: "Alat Masak",
    price_per_day: 15000,
    stock: 8,
    image_url: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 5,
    name: "Tenda Naturehike Mongar 2 UL",
    category: "Tenda",
    price_per_day: 35000,
    stock: 5,
    image_url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 6,
    name: "Carrier Deuter Aircontact 60+10L",
    category: "Carrier",
    price_per_day: 50000,
    stock: 4,
    image_url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 7,
    name: "Paket Nesting + Kompor Gas",
    category: "Alat Masak",
    price_per_day: 25000,
    stock: 6,
    image_url: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 8,
    name: "Sleeping Bag Fleece Polar",
    category: "Aksesoris",
    price_per_day: 15000,
    stock: 10,
    image_url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 9,
    name: "Headlamp LED Rechargeable",
    category: "Aksesoris",
    price_per_day: 10000,
    stock: 12,
    image_url: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 10,
    name: "Trekking Pole Duralumin (Pasang)",
    category: "Aksesoris",
    price_per_day: 15000,
    stock: 8,
    image_url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=600"
  }
];

export default function Home() {
  const [items] = useState(DUMMY_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]); // Struktur: [{ ...item, quantity: 1 }]
  const [activeTab, setActiveTab] = useState("katalog");
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // Tanggal Sewa
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Hitung Hari Sewa
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const totalDays = calculateDays();

  // Hitung Total Item (Jumlah Unit)
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Hitung Total Biaya
  const calculateTotalPrice = () => {
    const totalPerDay = cart.reduce((sum, item) => sum + (Number(item.price_per_day) * item.quantity), 0);
    return totalPerDay * totalDays;
  };

  const categories = ["Semua", "Tenda", "Carrier", "Sepatu", "Alat Masak", "Aksesoris"];

  // Filter Kategori & Pencarian
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Tambah ke Keranjang
  const addToCart = (product) => {
    const existingIndex = cart.findIndex((i) => i.id === product.id);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      if (updatedCart[existingIndex].quantity < product.stock) {
        updatedCart[existingIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        alert(`Maksimal stok yang tersedia hanya ${product.stock} unit.`);
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Update Kuantitas
  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty > item.stock) {
              alert(`Maksimal stok tersedia hanya ${item.stock} unit.`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Hapus 1 Item dari Keranjang
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Kosongkan Keranjang
  const clearCart = () => {
    if (confirm("Kosongkan semua daftar sewa?")) {
      setCart([]);
    }
  };

  // Kirim WhatsApp
  const handleCheckoutWA = () => {
    if (cart.length === 0) return;

    const adminPhone = "6282232668881";
    const listBarang = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} (${item.quantity}x) - Rp ${(
            Number(item.price_per_day) * item.quantity
          ).toLocaleString('id-ID')}/hari`
      )
      .join('\n');

    const tglMulai = startDate || "Belum ditentukan";
    const tglSelesai = endDate || "Belum ditentukan";
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
      {/* Header Utama */}
      <header className="bg-emerald-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight cursor-pointer" onClick={() => setActiveTab('katalog')}>
            <MapPin className="text-emerald-400" />
            <span>PuncakRent<span className="text-emerald-400">.outdoor</span></span>
          </div>

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

          {/* Tombol Keranjang di Header */}
          <button 
            onClick={() => setIsCartModalOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 px-4 py-2 rounded-xl flex items-center gap-2 transition text-sm font-semibold relative"
          >
            <ShoppingBag size={18} />
            <span>{totalItemCount} Barang</span>
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden bg-emerald-900 border-t border-emerald-700 justify-around py-2 text-xs font-medium text-emerald-100">
          <button onClick={() => setActiveTab('katalog')} className={activeTab === 'katalog' ? 'text-emerald-300 font-bold' : ''}>Katalog</button>
          <button onClick={() => setActiveTab('syarat')} className={activeTab === 'syarat' ? 'text-emerald-300 font-bold' : ''}>Syarat</button>
          <button onClick={() => setActiveTab('faq')} className={activeTab === 'faq' ? 'text-emerald-300 font-bold' : ''}>FAQ</button>
          <button onClick={() => setActiveTab('kontak')} className={activeTab === 'kontak' ? 'text-emerald-300 font-bold' : ''}>Lokasi</button>
        </div>
      </header>

      {/* --- TAB 1: KATALOG --- */}
      {activeTab === 'katalog' && (
        <>
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

          {/* Form Tanggal & Filter Search */}
          <div className="max-w-5xl mx-auto -mt-6 px-4 relative z-10">
            <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
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

          {/* Fitur Keunggulan */}
          <div className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <ShieldCheck className="text-emerald-600" size={18} /> Unit Steril & Bersih
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="text-emerald-600" size={18} /> Bebas Cek Kualitas
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <Clock className="text-emerald-600" size={18} /> Ambil / Kembali Cepat
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <Truck className="text-emerald-600" size={18} /> Siap COD / Antar Toko
            </div>
          </div>

          {/* Grid Katalog */}
          <main className="max-w-6xl mx-auto px-4 py-8">
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

            {filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border p-8">
                <p className="text-slate-500 font-medium">Tidak ada alat yang cocok dengan pencarian Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition duration-200 flex flex-col justify-between group">
                    <div>
                      <div className="h-48 bg-slate-100 overflow-hidden relative">
                        <img
                          src={item.image_url}
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
                            {item.price_per_day.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">/ hari</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full bg-slate-900 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1 cursor-pointer"
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
                <p className="text-xs text-slate-600 mb-2">Penyewa wajib menjaminkan 2 Identitas Asli yang masih berlaku:</p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>KTP Asli (Wajib)</li>
                  <li>SIM A / C Asli</li>
                  <li>STNK Atas Nama Sendiri</li>
                  <li>Kartu Mahasiswa / Pelajar</li>
                </ul>
              </div>
              <hr />
              <div>
                <h3 className="font-bold text-emerald-800 text-base mb-2">2. Pengambilan & Pengembalian Alat</h3>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Hitungan sewa adalah per 24 jam terhitung dari jam pengambilan alat.</li>
                  <li>Keterlambatan pengembalian tanpa konfirmasi dikenakan denda sesuai tarif harian.</li>
                  <li>Penyewa memeriksa kelayakan kondisi alat saat pengambilan.</li>
                </ul>
              </div>
              <hr />
              <div>
                <h3 className="font-bold text-emerald-800 text-base mb-2">3. Kerusakan / Kehilangan</h3>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Alat yang robek, patah, atau hilang menjadi tanggung jawab penyewa untuk perbaikan atau penggantian.</li>
                  <li>Pencucian dan sterilisasi alat setelah sewa ditangani penuh oleh tim toko.</li>
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
                <p className="text-xs text-slate-500">Jawaban cepat seputar penyewaan alat.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-sm text-slate-800 mb-1">Apakah tenda perlu dicuci sebelum dikembalikan?</h4>
                <p className="text-xs text-slate-600">Tidak perlu! Cukup bersihkan sisa tanah atau sampah di dalam tenda. Pencucian steril dilakukan oleh pihak kami.</p>
              </div>
              <div className="border rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-sm text-slate-800 mb-1">Apakah bisa booking tanggal jauh-jauh hari?</h4>
                <p className="text-xs text-slate-600">Bisa! Kami menyarankan booking minimal H-3 agar stok barang pesanan Anda aman.</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- TAB 4: KONTAK & LOKASI --- */}
      {activeTab === 'kontak' && (
        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Lokasi & Operasional Toko</h2>
            <p className="text-xs text-slate-500 mb-6">Silakan datang langsung ke basecamp/toko kami untuk cek fisik alat.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 text-xs text-slate-700">
                <div>
                  <h4 className="font-bold text-emerald-800 text-sm mb-1">Alamat Basecamp:</h4>
                  <p>Jl. Raya Puncak No. 12, Jawa Timur</p>
                </div>
                <div>
                  <h4 className="font-bold text-emerald-800 text-sm mb-1">Jam Operasional:</h4>
                  <p>Senin - Minggu: 08.00 - 21.00 WIB</p>
                </div>
                <div>
                  <h4 className="font-bold text-emerald-800 text-sm mb-1">WhatsApp Toko:</h4>
                  <p className="font-bold text-emerald-700">+62 822-3266-8881</p>
                </div>
              </div>
              <div className="bg-slate-100 rounded-xl border flex flex-col items-center justify-center p-6 text-center">
                <MapPin size={40} className="text-emerald-600 mb-2" />
                <p className="font-bold text-xs text-slate-700">PuncakRent Basecamp Store</p>
                <p className="text-[10px] text-slate-400 mt-1 mb-3">Akses lokasi terhubung ke Google Maps</p>
                <button className="bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-medium">
                  Buka Petunjuk Arah
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- FLOATING BOTTOM BAR (RINGKASAN & AKSES MODAL) --- */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-6 z-40 w-11/12 max-w-2xl">
          <div className="cursor-pointer" onClick={() => setIsCartModalOpen(true)}>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                {totalItemCount} Unit Alat
              </span>
              <span className="text-[11px] text-slate-400">({totalDays} Hari Sewa)</span>
            </div>
            <p className="font-extrabold text-emerald-400 text-xl tracking-tight mt-0.5">
              Rp {calculateTotalPrice().toLocaleString('id-ID')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-3 rounded-xl font-bold text-xs transition border border-slate-600 flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag size={15} />
              <span className="hidden sm:inline">Rincian</span>
            </button>
            <button
              onClick={handleCheckoutWA}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 text-xs transition shadow-lg cursor-pointer"
            >
              <Phone size={16} />
              Sewa via WA
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL POP-UP DETAIL KERANJANG (EDIT, UBAH JUMLAH, HAPUS ITEM) --- */}
      {/* ========================================================================= */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-emerald-700" size={20} />
                <h3 className="font-bold text-base text-slate-800">
                  Daftar Alat Dipilih ({totalItemCount} Unit)
                </h3>
              </div>
              <button 
                onClick={() => setIsCartModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Items List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingBag size={48} className="mx-auto text-slate-300 mb-2" />
                  <p className="font-medium text-sm">Keranjang sewa masih kosong</p>
                  <p className="text-xs mt-1">Pilih perlengkapan dari katalog untuk menambahkan.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center pb-2 border-b text-xs text-slate-500">
                    <span>Durasi Sewa: <strong>{totalDays} Hari</strong></span>
                    <button 
                      onClick={clearCart}
                      className="text-rose-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Trash2 size={13} /> Kosongkan
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {cart.map((item) => (
                      <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0" 
                          />
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1">{item.name}</h4>
                            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                              Rp {Number(item.price_per_day).toLocaleString('id-ID')} / hari
                            </p>
                            <span className="text-[10px] text-slate-400">
                              Subtotal: Rp {(Number(item.price_per_day) * item.quantity * totalDays).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>

                        {/* Kontrol Kuantitas & Hapus */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                              title="Kurangi"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="px-3 text-xs font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                              title="Tambah"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(!startDate || !endDate) && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-800 text-xs">
                      <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                      <span>Tanggal sewa belum dipilih (dihitung default 1 hari). Atur tanggal di menu utama untuk hitungan akurat.</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t bg-slate-50 flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Estimasi Total ({totalDays} Hari):</span>
                  <span className="font-extrabold text-emerald-800 text-lg">
                    Rp {calculateTotalPrice().toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsCartModalOpen(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-white transition cursor-pointer"
                  >
                    Tambah Lagi
                  </button>
                  <button
                    onClick={() => {
                      setIsCartModalOpen(false);
                      handleCheckoutWA();
                    }}
                    className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Phone size={15} />
                    Kirim Pesanan ke WA
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}