'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Package, Plus, Trash2, ArrowLeft, RefreshCw, Edit3, X,
    Image as ImageIcon, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Tenda');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // 1. READ: Fetch Data
    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error Ambil Data:', error.message);
        } else {
            setItems(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleOpenAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setEditingId(item.id);
        setName(item.name);
        setCategory(item.category);
        setPrice(item.price_per_day);
        setStock(item.stock);
        setImageUrl(item.image_url || '');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setCategory('Tenda');
        setPrice('');
        setStock('');
        setImageUrl('');
    };

    // 2. UPLOAD FOTO
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar (JPG, PNG, WEBP)!');
            return;
        }

        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setImageUrl(publicUrlData.publicUrl);
        } catch (error) {
            alert('Gagal upload gambar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    // 3. CREATE & UPDATE (SIMPAN DATA)
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        if (!name || !price || !stock) {
            alert('Nama, Harga, dan Stok wajib diisi!');
            return;
        }

        setSubmitting(true);

        const productData = {
            name,
            category,
            price_per_day: Number(price),
            stock: Number(stock),
            image_url: imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600'
        };

        try {
            if (editingId) {
                // UPDATE (EDIT PRODUK)
                const { error } = await supabase
                    .from('items')
                    .update(productData)
                    .eq('id', editingId);

                if (error) throw error;
                alert('Produk berhasil diperbarui!');
            } else {
                // INSERT (TAMBAH PRODUK BARU)
                const { error } = await supabase
                    .from('items')
                    .insert([productData]);

                if (error) throw error;
                alert('Produk baru berhasil ditambahkan!');
            }

            handleCloseModal();
            await fetchItems(); // Ambil ulang data terbaru dari database
        } catch (error) {
            alert('Terjadi kesalahan: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // 4. DELETE (HAPUS PRODUK)
    const handleDelete = async (id) => {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            try {
                const { error } = await supabase
                    .from('items')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                alert('Produk berhasil dihapus!');
                await fetchItems(); // Ambil ulang data terbaru dari database
            } catch (error) {
                alert('Gagal menghapus produk: ' + error.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 md:p-8">
            {/* HEADER */}
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border mb-8 gap-4">
                <div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                        Panel Pengelola Katalog
                    </span>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                        Dashboard Admin PuncakRent
                    </h1>
                </div>
                <Link
                    href="/"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                >
                    <ArrowLeft size={16} /> Lihat Website Utama
                </Link>
            </div>

            {/* KONTEN UTAMA */}
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b">
                    <div className="flex items-center gap-2">
                        <Package className="text-emerald-700" size={22} />
                        <div>
                            <h2 className="font-bold text-lg text-slate-800">Katalog Peralatan ({items.length})</h2>
                            <p className="text-xs text-slate-400">Kelola ketersediaan alat pendakian toko Anda di sini.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <button
                            onClick={fetchItems}
                            className="text-xs text-slate-500 font-semibold flex items-center gap-1 hover:text-emerald-700 transition"
                        >
                            <RefreshCw size={14} /> Refresh
                        </button>

                        <button
                            onClick={handleOpenAddModal}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2"
                        >
                            <Plus size={18} />
                            <span>Tambah Produk Baru</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-xs text-slate-500 flex items-center justify-center gap-2">
                        <RefreshCw className="animate-spin" size={16} /> Memuat data produk...
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16 text-xs text-slate-400">
                        Belum ada produk tersimpan. Klik tombol <strong>+ Tambah Produk Baru</strong> untuk mulai menambahkan.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 border-b">
                                <tr>
                                    <th className="p-3">Alat</th>
                                    <th className="p-3">Kategori</th>
                                    <th className="p-3">Harga / Hari</th>
                                    <th className="p-3">Stok Unit</th>
                                    <th className="p-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition">
                                        <td className="p-3 flex items-center gap-3">
                                            <img
                                                src={item.image_url || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"}
                                                alt=""
                                                className="w-12 h-12 object-cover rounded-xl border"
                                            />
                                            <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                                        </td>
                                        <td className="p-3">
                                            <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-md text-[10px]">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="p-3 font-extrabold text-emerald-800 text-sm">
                                            Rp {Number(item.price_per_day).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-3 font-semibold text-slate-600">{item.stock} Unit</td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => handleOpenEditModal(item)}
                                                    className="bg-amber-50 hover:bg-amber-100 text-amber-700 p-2 rounded-lg transition"
                                                    title="Edit Produk"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg transition"
                                                    title="Hapus Alat"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL POP-UP */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                        <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
                            <div className="flex items-center gap-2">
                                {editingId ? <Edit3 className="text-amber-600" size={20} /> : <Plus className="text-emerald-700" size={20} />}
                                <h3 className="font-bold text-base text-slate-800">
                                    {editingId ? 'Edit Data Produk' : 'Tambah Produk Alat Baru'}
                                </h3>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Nama Alat Gunung</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Tenda Eiger Camp 4P"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border p-2.5 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Kategori Alat</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full border p-2.5 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none bg-white"
                                >
                                    <option value="Tenda">Tenda</option>
                                    <option value="Carrier">Carrier</option>
                                    <option value="Sepatu">Sepatu</option>
                                    <option value="Alat Masak">Alat Masak</option>
                                    <option value="Aksesoris">Aksesoris</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Harga / Hari (Rp)</label>
                                    <input
                                        type="number"
                                        placeholder="45000"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full border p-2.5 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Stok Unit Tersedia</label>
                                    <input
                                        type="number"
                                        placeholder="5"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        className="w-full border p-2.5 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Upload Foto Alat (Galeri)</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:bg-slate-50 transition relative">
                                    {imageUrl ? (
                                        <div className="relative">
                                            <img
                                                src={imageUrl}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-lg border shadow-xs mb-1"
                                            />
                                            <p className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                                                <CheckCircle2 size={12} /> Foto siap disimpan
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="py-2 flex flex-col items-center justify-center gap-1 text-slate-400">
                                            <ImageIcon size={24} className="text-slate-300" />
                                            <p className="text-xs font-medium text-slate-600">Klik untuk pilih foto dari galeri</p>
                                            <p className="text-[10px]">JPG, PNG, atau WEBP</p>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>

                                {uploading && (
                                    <p className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
                                        <RefreshCw size={12} className="animate-spin" /> Mengunggah foto...
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || uploading}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2 text-white ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-700 hover:bg-emerald-600'
                                        }`}
                                >
                                    {submitting
                                        ? 'Menyimpan...'
                                        : editingId
                                            ? 'Update Produk'
                                            : 'Simpan Produk Baru'
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}