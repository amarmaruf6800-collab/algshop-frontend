import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loadingReview, setLoadingReview] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        window.setTimeout(() => setToast(null), 2800);
    };

    const fetchDetail = async () => {
        try {
            const response = await api.get(`/produk/${id}`);
            setProduct(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchDetail(); }, [id]);

    const submitReview = async (e) => {
        e.preventDefault();
        setLoadingReview(true);
        try {
            const response = await api.post(`/produk/${id}/ulasan`, { rating, comment });
            showToast(response.data.message);
            setComment('');
            fetchDetail();
        } catch (error) {
            showToast(error.response?.data?.message || 'Gagal mengirim ulasan.', 'error');
        } finally {
            setLoadingReview(false);
        }
    };

    // FUNGSI BARU: Tambah ke Keranjang
    const handleAddToCart = async () => {
        if (!user) return navigate('/login');
        try {
            const response = await api.post(`/keranjang/${product.id}`);
            showToast(response.data.message || 'Produk ditambahkan ke keranjang.');
        } catch (error) {
            showToast(error.response?.data?.message || 'Gagal menambahkan ke keranjang.', 'error');
        }
    };

    // FUNGSI BARU: Beli Sekarang
    const handleBuyNow = async () => {
        if (!user) return navigate('/login');
        try {
            await api.post(`/keranjang/${product.id}`);
            navigate('/keranjang');
        } catch (error) {
            showToast(error.response?.data?.message || 'Gagal memproses pembelian.', 'error');
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen bg-[#f7f8fc] font-sans">
                <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
                    <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 text-sm font-bold text-slate-500 shadow-xl">Memuat data...</div>
                </div>
            </div>
        );
    }

    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, rev) => sum + Number(rev.rating), 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="min-h-screen bg-[#f7f8fc] font-sans text-slate-900">
            <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-2xl">
                <div className="mx-auto flex min-h-[76px] max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link to="/katalog" className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg">A</div>
                        <span className="text-xl font-black tracking-tight">Algshop<span className="text-indigo-500">.</span></span>
                    </Link>
                    <Link to="/katalog" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-50">← Katalog</Link>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
                <div className="mb-6 text-xs font-bold text-slate-400"><Link to="/katalog" className="hover:text-indigo-600">Katalog</Link><span className="mx-2">/</span>Detail Produk</div>

                <section className="grid overflow-hidden rounded-[32px] border border-slate-200/70 bg-white shadow-2xl shadow-slate-200/30 md:grid-cols-2">
                    <div className="bg-slate-100 p-3 sm:p-5">
                        {product.image ? (
                            <img src={`/storage/${product.image}`} alt={product.name} className="aspect-square w-full rounded-[25px] object-cover" />
                        ) : (
                            <div className="flex aspect-square items-center justify-center rounded-[25px] bg-slate-100 text-sm font-bold text-slate-400">Tanpa Gambar</div>
                        )}
                    </div>

                    <div className="flex flex-col justify-center p-7 sm:p-10">
                        <div className="mb-5 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700">★ {avgRating} / 5.0</span>
                            <span className="text-xs font-semibold text-slate-400">{reviews.length} ulasan</span>
                        </div>

                        <h1 className="text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">{product.name}</h1>
                        <p className="mt-3 text-sm text-slate-500">Dijual oleh <strong className="text-slate-800">{product.shop?.name || 'Toko'}</strong></p>
                        <p className="mt-7 text-3xl font-black tracking-[-0.04em] text-slate-950">Rp{Number(product.price).toLocaleString('id-ID')}</p>

                        <div className={`mt-5 w-fit rounded-full border px-3 py-1.5 text-xs font-black ${product.stock < 10 ? 'border-red-100 bg-red-50 text-red-600' : 'border-emerald-100 bg-emerald-50 text-emerald-600'}`}>
                            {product.stock < 10 ? `Sisa stok: ${product.stock}` : `Stok tersedia: ${product.stock}`}
                        </div>

                        {/* UI BARU: Tombol Beli */}
                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 rounded-2xl bg-slate-950 py-4 text-sm font-extrabold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-indigo-600 active:translate-y-0"
                            >
                                Beli Sekarang
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 rounded-2xl border-2 border-slate-950 bg-white py-4 text-sm font-extrabold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0"
                            >
                                + Keranjang
                            </button>
                        </div>

                        <div className="my-7 h-px bg-slate-100" />
                        <p className="text-sm leading-7 text-slate-500">{product.description || 'Tidak ada deskripsi produk.'}</p>
                    </div>
                </section>

                <section className="mt-6 rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-200/30 sm:p-10">
                    <div className="mb-7">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">Customer voice</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight">Ulasan Pembeli</h2>
                    </div>

                    <div className="mb-8 rounded-[25px] bg-slate-50 p-5 sm:p-7">
                        <h3 className="text-base font-black">Bagikan pengalaman Anda</h3>
                        <form onSubmit={submitReview} className="mt-5 space-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Rating</label>
                                <select value={rating} onChange={(e) => setRating(e.target.value)} className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-indigo-500/10">
                                    <option value="5">★★★★★ Sangat Bagus</option>
                                    <option value="4">★★★★ Bagus</option>
                                    <option value="3">★★★ Lumayan</option>
                                    <option value="2">★★ Kurang</option>
                                    <option value="1">★ Buruk</option>
                                </select>
                            </div>
                            <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Bagaimana kualitas produk ini?" required className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none transition focus:ring-4 focus:ring-indigo-500/10" />
                            <button type="submit" disabled={loadingReview} className="rounded-2xl bg-slate-950 px-6 py-3.5 text-xs font-extrabold text-white transition hover:bg-indigo-600 disabled:opacity-60">
                                {loadingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                            </button>
                        </form>
                    </div>

                    {reviews.length === 0 ? (
                        <div className="py-10 text-center text-sm font-semibold text-slate-400">Belum ada ulasan untuk produk ini.</div>
                    ) : (
                        <div className="space-y-5">
                            {reviews.map(rev => (
                                <div key={rev.id} className="rounded-2xl border border-slate-100 p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-xs font-black text-white">{rev.user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                                        <div>
                                            <strong className="block text-sm font-black">{rev.user?.name || 'User'}</strong>
                                            <span className="text-xs text-amber-500">{'★'.repeat(Number(rev.rating))}</span>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm leading-7 text-slate-600">{rev.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
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