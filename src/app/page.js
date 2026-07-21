'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, MapPin, Phone, RefreshCw, Calendar } from 'lucide-react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cart, setCart] = useState([]);

  // State untuk Tanggal Sewa
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 1. Ambil Data dari Supabase
  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error mengambil data:', error.message);
    } else {
      setItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Hitung Jumlah Hari Sewa
  const calculateDays = () => {
    if (!startDate || !endDate) return 1; // Default 1 hari jika belum pilih
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const totalDays = calculateDays();

  // Hitung Total Biaya Sewa
  const calculateTotalPrice = () => {
    const totalPerDay = cart.reduce((sum, item) => sum + Number(item.price_per_day), 0);
    return totalPerDay * totalDays;
  };

  const categories = ["Semua", "Tenda", "Carrier", "Sepatu", "Alat Masak", "Aksesoris"];
  
  const filteredItems = selectedCategory === "Semua"
    ? items
    : items.filter(item => item.category === selectedCategory);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Kirim Pesanan Lengkap via WhatsApp
  const handleCheckoutWA = () => {
    const adminPhone = "6281234567890"; // Ganti dengan nomor WA Toko Anda
    const listBarang = cart
      .map((item, index) => `${index + 1}. ${item.name} (Rp ${Number(item.price_per_day).toLocaleString('id-ID')}/hari)`)
      .join('\n');

    const tglMulai = startDate || "Belum dipilih";
    const tglSelesai = endDate || "Belum dipilih";
    const totalHarga = calculateTotalPrice().toLocaleString('id-ID');

    const pesan = encodeURIComponent(
      `Halo Admin PuncakRent!\nSaya mau sewa peralatan berikut:\n\n${listBarang}\n\n` +
      `📅 *Tanggal Sewa:* ${tglMulai} s/d ${tglSelesai} (${totalDays} Hari)\n` +
      `💰 *Estimasi Total:* Rp ${totalHarga}\n\n` +
      `Mohon info ketersediaan barangnya ya, terima kasih!`
    );

    window.open(`https://wa.me/${adminPhone}?text=${pesan}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      {/* Header */}
      <header className="bg-emerald-800 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <MapPin className="text-emerald-400" />
            <span>PuncakRent Outdoor</span>
          </div>
          <button className="bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <ShoppingBag size={20} />
            <span className="font-semibold">{cart.length} Barang</span>
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-emerald-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3">Sewa Alat Pendakian Mudah & Terpercaya</h1>
        <p className="text-emerald-200 max-w-2xl mx-auto">
          Peralatan bersih, terawat, dan siap menemani petualangan mendakimu!
        </p>
      </section>

      {/* Form Tanggal Sewa */}
      <div className="max-w-4xl mx-auto -mt-6 px-4 relative z-10">
        <div className="bg-white p-4 rounded-xl shadow-lg border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold w-full md:w-auto">
            <Calendar size={20} />
            <span>Atur Tanggal Sewa:</span>
          </div>
          <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
            <div className="flex flex-col text-xs font-medium text-slate-500 w-full md:w-auto">
              <span>Mulai:</span>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="border p-2 rounded-lg text-slate-700 text-sm focus:outline-emerald-600"
              />
            </div>
            <span className="hidden md:inline font-bold text-slate-400 mt-4">s/d</span>
            <div className="flex flex-col text-xs font-medium text-slate-500 w-full md:w-auto">
              <span>Selesai:</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="border p-2 rounded-lg text-slate-700 text-sm focus:outline-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-emerald-700 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center py-20 flex justify-center items-center gap-2 text-emerald-800 font-medium">
            <RefreshCw className="animate-spin" /> Memuat data barang...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border p-8">
            <p className="text-slate-500 font-medium">Belum ada barang di kategori ini.</p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="h-48 bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.image_url || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-lg mt-2 mb-1">{item.name}</h3>
                    <p className="text-xs text-slate-500 mb-3">Stok tersedia: {item.stock} unit</p>
                    <p className="text-emerald-700 font-bold text-lg">
                      Rp {Number(item.price_per_day).toLocaleString('id-ID')}{' '}
                      <span className="text-xs text-slate-400 font-normal">/ hari</span>
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-slate-900 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium transition"
                  >
                    + Tambah Sewa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-2xl shadow-2xl border border-emerald-100 flex items-center justify-between gap-6 z-50 w-11/12 max-w-2xl">
          <div>
            <p className="text-xs text-slate-500">{cart.length} Barang ({totalDays} Hari)</p>
            <p className="font-extrabold text-emerald-800 text-xl">
              Rp {calculateTotalPrice().toLocaleString('id-ID')}
            </p>
          </div>
          <button
            onClick={handleCheckoutWA}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 text-sm transition shadow-md"
          >
            <Phone size={18} />
            Sewa via WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}