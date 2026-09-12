import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const emptyForm = { id: null, name: '', description: '', price: '', discount_percent: 0, stock: '' };

export default function MyProducts() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [images, setImages] = useState([]);
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
            if (error.response?.status === 403) {
                navigate('/buka-toko');
            } else {
                showToast('Gagal memuat produk toko.', 'error');
            }
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('price', form.price);
        formData.append('discount_percent', form.discount_percent || 0);
        formData.append('stock', form.stock);

        images.forEach((file) => {
            formData.append('images[]', file);
        });

        try {
            if (form.id) {
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

            setForm(emptyForm);
            setImages([]);
            const input = document.getElementById('imageInput');
            if (input) input.value = '';
            fetchMyProducts();
        } catch (error) {
            console.error(error);
            showToast(
                error.response?.data?.message ||
                'Terjadi kesalahan saat menyimpan produk.',
                'error'
            );
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
        setForm({
            id: produk.id,
            name: produk.name || '',
            description: produk.description || '',
            price: produk.price || '',
            discount_percent: produk.discount_percent || 0,
            stock: produk.stock || ''
        });

        setImages([]);
        const input = document.getElementById('imageInput');
        if (input) input.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setForm(emptyForm);
        setImages([]);
        const input = document.getElementById('imageInput');
        if (input) input.value = '';
    };

    const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
    const lowStock = products.filter((product) => Number(product.stock) < 10).length;

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f6f7fb] font-sans text-slate-900">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-[-260px] h-[600px] w-[850px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />
                <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-100/50 blur-3xl" />
            </div>

            <header className="sticky top-0 z-40 border-b border-white/80 bg-white/80 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-2xl">
                <div className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/katalog" className="group flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-[15px] bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition group-hover:-rotate-3">
                            A
                        </div>
                        <div>
                            <div className="text-xl font-black tracking-[-0.04em]">Algshop<span className="text-indigo-500">.</span></div>
                            <div className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:block">Seller studio</div>
                        </div>
                    </Link>
                    <Link to="/katalog" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600">
                        ← Katalog
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-9">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Seller studio</p>
                    <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-4xl font-black tracking-[-0.055em] sm:text-5xl">Manajemen Produk</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                                Kelola katalog, harga, stok, dan aset produk toko Anda dari satu ruang kerja.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-sm">
                                <p className="text-lg font-black">{products.length}</p>
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Produk</p>
                            </div>
                            <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-sm">
                                <p className="text-lg font-black">{totalStock}</p>
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Total stok</p>
                            </div>
                            <div className="hidden rounded-2xl border border-white bg-white px-4 py-3 shadow-sm sm:block">
                                <p className="text-lg font-black text-red-500">{lowStock}</p>
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Stok rendah</p>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="mb-8 overflow-hidden rounded-[32px] border border-white bg-white shadow-xl shadow-slate-200/40">
                    <div className="relative overflow-hidden bg-slate-950 px-6 py-6 text-white sm:px-8">
                        <div className="absolute -right-20 -top-28 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
                        <div className="relative">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">
                                {form.id ? 'Edit produk' : 'Create product'}
                            </p>
                            <h2 className="mt-1 text-2xl font-black tracking-tight">
                                {form.id ? 'Perbarui informasi produk' : 'Tambah produk ke toko'}
                            </h2>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
                        <div className="grid gap-5 md:grid-cols-4">
                            {[
                                ['name', 'Nama Produk', 'Nama produk'],
                                ['price', 'Harga (Rp)', 'Harga normal'],
                                ['discount_percent', 'Diskon (%)', '0–100'],
                                ['stock', 'Stok', 'Jumlah stok'],
                            ].map(([key, label, placeholder]) => (
                                <div key={key}>
                                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">{label}</label>
                                    <input
                                        type={key === 'name' ? 'text' : 'number'}
                                        min={key === 'discount_percent' ? 0 : undefined}
                                        max={key === 'discount_percent' ? 100 : undefined}
                                        placeholder={placeholder}
                                        value={form[key]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                        required
                                        className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Deskripsi</label>
                                <textarea
                                    rows="4"
                                    placeholder="Jelaskan produk secara singkat..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="imageInput"
                                    className="flex min-h-[122px] cursor-pointer flex-col justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-indigo-300 hover:bg-indigo-50/30"
                                >
                                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm">＋</span>
                                    <span className="mt-3 text-xs font-black text-slate-700">Foto produk</span>
                                    <span className="mt-1 text-xs text-slate-400">
                                        {images.length > 0
                                            ? `${images.length} gambar dipilih`
                                            : (form.id ? 'Pilih gambar baru untuk mengganti galeri (opsional)' : 'Pilih 1–10 gambar')}
                                    </span>
                                    <input
                                        type="file"
                                        id="imageInput"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setImages(Array.from(e.target.files || []).slice(0, 10))}
                                        className="hidden"
                                    />
                                    {images.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {images.map((file, index) => (
                                                <span key={`${file.name}-${index}`} className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">
                                                    {index + 1}. {file.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-2xl bg-slate-950 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:opacity-60"
                            >
                                {loading ? 'Menyimpan...' : (form.id ? 'Simpan Perubahan →' : 'Upload Produk →')}
                            </button>

                            {form.id && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Batal Edit
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="overflow-hidden rounded-[32px] border border-white bg-white shadow-xl shadow-slate-200/40">
                    <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">Inventory</p>
                            <h2 className="mt-1 text-2xl font-black tracking-tight">Produk Anda</h2>
                        </div>
                        <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">
                            {products.length} produk
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    {['Produk', 'Detail', 'Harga', 'Stok', 'Aksi'].map((head) => (
                                        <th key={head} className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">{head}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map((produk) => (
                                    <tr key={produk.id} className="transition hover:bg-slate-50/70">
                                        <td className="px-6 py-4">
                                             {(produk.images?.[0]?.path || produk.image) ? (
                                                <img
                                                    src={`/storage/${produk.images?.[0]?.path || produk.image}`}
                                                    alt={produk.name}
                                                    className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-[9px] font-black uppercase text-slate-400">No img</div>
                                            )}
                                        </td>
                                        <td className="max-w-xs px-6 py-4">
                                            <div className="font-extrabold text-slate-900">{produk.name}</div>
                                            <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{produk.description || 'Tanpa deskripsi'}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            {Number(produk.discount_percent) > 0 && (
                                                <div className="text-[10px] font-bold text-slate-400 line-through">Rp{Number(produk.price).toLocaleString('id-ID')}</div>
                                            )}
                                            <div className="font-black text-slate-900">Rp{Number(produk.final_price ?? produk.price).toLocaleString('id-ID')}</div>
                                            {Number(produk.discount_percent) > 0 && (
                                                <span className="mt-1 inline-block rounded-full bg-red-50 px-2 py-1 text-[9px] font-black text-red-600">-{Number(produk.discount_percent)}%</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-3 py-1.5 text-xs font-black ${Number(produk.stock) < 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {produk.stock}
                                            </span>
                                        </td>
                                        <td className="space-x-2 px-6 py-4 text-right">
                                            <button onClick={() => handleEdit(produk)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(produk.id)} className="rounded-xl border border-red-100 px-3 py-2 text-xs font-extrabold text-red-500 transition hover:bg-red-50">
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center">
                                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">✦</div>
                                            <p className="mt-4 text-sm font-black text-slate-700">Belum ada produk</p>
                                            <p className="mt-1 text-xs font-medium text-slate-400">Tambahkan produk pertama Anda menggunakan form di atas.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {toast && (
                <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-32px)] max-w-md -translate-x-1/2 sm:left-auto sm:right-5 sm:w-auto sm:translate-x-0">
                    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-xs font-bold shadow-2xl backdrop-blur-xl ${toast.type === 'error' ? 'border-red-200 bg-red-50/95 text-red-700' : 'border-emerald-200 bg-emerald-50/95 text-emerald-700'}`}>
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/80 text-sm">{toast.type === 'error' ? '!' : '✓'}</span>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
