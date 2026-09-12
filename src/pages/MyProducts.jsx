import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const emptyForm = { id: null, name: '', description: '', price: '', stock: '' };

export default function MyProducts() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [image, setImage] = useState(null);
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        window.setTimeout(() => setToast(null), 2800);
    };

    const navigate = useNavigate();
    const fetchMyProducts = async () => {
        try {
            const response = await api.get('/toko-saya/produk');
            setProducts(response.data.data);
        } catch (error) {
            console.error(error);
            // Jika error 403 (Belum punya toko), lempar ke halaman Buka Toko
            if (error.response?.status === 403) {
                navigate('/buka-toko');
            } else {
                showToast('Gagal memuat produk toko.', 'error');
            }
        }
    };

    useEffect(() => { fetchMyProducts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('price', form.price);
        formData.append('stock', form.stock);

        if (image) {
            formData.append('image', image);
        }

        try {
            if (form.id) {
                // formData.append('_method', 'PUT');
                await api.post(`/toko-saya/produk/${form.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast('Produk berhasil diperbarui.');
            } else {
                await api.post('/toko-saya/produk', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast('Produk berhasil ditambahkan.');
            }

            // Reset form ke posisi semula setelah berhasil
            setForm(emptyForm);
            setImage(null);
            const input = document.getElementById('imageInput');
            if (input) input.value = '';

            fetchMyProducts();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan produk.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
        try {
            await api.delete(`/toko-saya/produk/${id}`);
            showToast('Produk berhasil dihapus.');
            fetchMyProducts();
        } catch (error) {
            showToast('Gagal menghapus produk.', 'error');
        }
    };

    const handleEdit = (produk) => {
        // PERBAIKAN: Gunakan || '' agar jika data null, form tidak error
        setForm({
            id: produk.id,
            name: produk.name || '',
            description: produk.description || '',
            price: produk.price || '',
            stock: produk.stock || ''
        });

        // PERBAIKAN: Kosongkan state gambar agar tidak bocor dari produk lain
        setImage(null);
        const input = document.getElementById('imageInput');
        if (input) input.value = '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setForm(emptyForm);
        setImage(null);
        const input = document.getElementById('imageInput');
        if (input) input.value = '';
    };

    return (
        <div className="min-h-screen bg-[#f7f8fc] font-sans text-slate-900">
            <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-2xl">
                <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/katalog" className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg">A</div>
                        <div className="text-xl font-black tracking-[-0.04em]">Algshop<span className="text-indigo-500">.</span></div>
                    </Link>
                    <Link to="/katalog" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50">
                        ← Katalog
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">Seller studio</p>
                    <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Manajemen Produk</h1>
                    <p className="mt-2 text-sm text-slate-500">Kelola katalog, harga, stok, dan gambar produk toko Anda.</p>
                </div>

                <section className="mb-8 overflow-hidden rounded-[30px] border border-slate-200/70 bg-white shadow-xl shadow-slate-200/40">
                    <div className="border-b border-slate-100 bg-slate-950 px-6 py-5 text-white sm:px-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-300">{form.id ? 'Edit produk' : 'Produk baru'}</p>
                        <h2 className="mt-1 text-xl font-black">{form.id ? 'Perbarui informasi produk' : 'Tambah produk ke toko'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
                        <div className="grid gap-5 md:grid-cols-3">
                            <input type="text" placeholder="Nama Produk" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="input-premium w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
                            <input type="number" placeholder="Harga (Rp)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required className="input-premium w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
                            <input type="number" placeholder="Stok" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required className="input-premium w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <textarea rows="3" placeholder="Deskripsi Singkat" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
                            <label className="flex cursor-pointer flex-col justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-indigo-300 hover:bg-indigo-50/30">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Foto produk</span>
                                <span className="mt-1 text-xs text-slate-400">{image ? image.name : (form.id ? 'Pilih gambar baru (opsional)' : 'Klik untuk memilih gambar')}</span>
                                <input type="file" id="imageInput" accept="image/*" onChange={e => setImage(e.target.files[0])} className="hidden" />
                            </label>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button type="submit" disabled={loading} className="rounded-2xl bg-slate-950 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:opacity-60">
                                {loading ? 'Menyimpan...' : (form.id ? 'Simpan Perubahan' : 'Upload Produk')}
                            </button>
                            {form.id && (
                                <button type="button" onClick={cancelEdit} className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50">
                                    Batal Edit
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white shadow-xl shadow-slate-200/40">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">Inventory</p>
                            <h2 className="mt-1 text-xl font-black">Produk Anda</h2>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">{products.length} produk</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    {['Gambar', 'Produk', 'Harga', 'Stok', 'Aksi'].map((head) => (
                                        <th key={head} className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">{head}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map(produk => (
                                    <tr key={produk.id} className="transition hover:bg-slate-50/80">
                                        <td className="px-6 py-4">
                                            {produk.image ? <img src={`/storage/${produk.image}`} alt={produk.name} className="h-14 w-14 rounded-2xl object-cover shadow-sm" /> : <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-[9px] font-black uppercase text-slate-400">No img</div>}
                                        </td>
                                        <td className="px-6 py-4"><div className="max-w-xs font-extrabold text-slate-900">{produk.name}</div><div className="mt-1 text-xs text-slate-400">{produk.description || 'Tanpa deskripsi'}</div></td>
                                        <td className="px-6 py-4 font-black text-slate-900">Rp{Number(produk.price).toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4"><span className={`rounded-full px-3 py-1.5 text-xs font-black ${produk.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{produk.stock}</span></td>
                                        <td className="space-x-2 px-6 py-4 text-right">
                                            <button onClick={() => handleEdit(produk)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600">Edit</button>
                                            <button onClick={() => handleDelete(produk.id)} className="rounded-xl border border-red-100 px-3 py-2 text-xs font-extrabold text-red-500 transition hover:bg-red-50">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && <tr><td colSpan="5" className="py-14 text-center text-sm font-semibold text-slate-400">Belum ada produk di toko Anda.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {toast && (
                <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-32px)] max-w-md -translate-x-1/2 sm:left-auto sm:right-5 sm:w-auto sm:translate-x-0">
                    <div className={`rounded-2xl border px-4 py-3.5 text-xs font-bold shadow-2xl backdrop-blur-xl ${toast.type === 'error' ? 'border-red-200 bg-red-50/95 text-red-700' : 'border-emerald-200 bg-emerald-50/95 text-emerald-700'}`}>
                        {toast.type === 'error' ? '!' : '✓'} <span className="ml-2">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}