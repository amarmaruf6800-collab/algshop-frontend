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

    const handleAddToCart = async () => {
        if (!user) return navigate('/login');
        try {
            const response = await api.post(`/keranjang/${product.id}`);
            showToast(response.data.message || 'Produk ditambahkan ke keranjang.');
        } catch (error) {
            showToast(error.response?.data?.message || 'Gagal menambahkan ke keranjang.', 'error');
        }
    };

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
            <div className="min-h-screen bg-[#f6f7fb] font-sans">
                <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
                    <div className="rounded-3xl border border-white bg-white px-8 py-6 text-sm font-bold text-slate-500 shadow-2xl shadow-slate-200/40">
                        Memuat produk...
                    </div>
                </div>
            </div>
        );
    }

    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, rev) => sum + Number(rev.rating), 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f6f7fb] font-sans text-slate-900">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-[-260px] h-[620px] w-[850px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />
                <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-100/50 blur-3xl" />
            </div>

            <header className="sticky top-0 z-40 border-b border-white/80 bg-white/80 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-2xl">
                <div className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/katalog" className="group flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-[15px] bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition group-hover:-rotate-3">A</div>
                        <div>
                            <div className="text-xl font-black tracking-[-0.04em]">Algshop<span className="text-indigo-500">.</span></div>
                            <div className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:block">Product detail</div>
                        </div>
                    </Link>
                    <Link to="/katalog" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600">← Katalog</Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="mb-6 text-xs font-bold text-slate-400">
                    <Link to="/katalog" className="transition hover:text-indigo-600">Katalog</Link>
                    <span className="mx-2">/</span>
                    <span>Detail Produk</span>
                </div>

                <section className="grid overflow-hidden rounded-[34px] border border-white bg-white shadow-2xl shadow-slate-200/40 md:grid-cols-2">
                    <div className="relative bg-slate-100 p-3 sm:p-5">
                        <div className="absolute left-7 top-7 z-10 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 shadow-sm backdrop-blur">
                            Algshop selection
                        </div>
                        {product.image ? (
                            <img src={`/storage/${product.image}`} alt={product.name} className="aspect-square w-full rounded-[27px] object-cover shadow-sm" />
                        ) : (
                            <div className="flex aspect-square items-center justify-center rounded-[27px] bg-slate-200 text-sm font-black text-slate-400">Tanpa Gambar</div>
                        )}
                    </div>

                    <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700">★ {avgRating} / 5.0</span>
                            <span className="text-xs font-semibold text-slate-400">{reviews.length} ulasan</span>
                        </div>

                        <h1 className="mt-5 text-3xl font-black leading-[1.05] tracking-[-0.05em] sm:text-5xl">{product.name}</h1>
                        <p className="mt-4 text-sm text-slate-500">
                            Dijual oleh <strong className="text-slate-800">{product.shop?.name || 'Toko'}</strong>
                        </p>

                        <p className="mt-8 text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
                            Rp{Number(product.price).toLocaleString('id-ID')}
                        </p>

                        <div className={`mt-5 w-fit rounded-full border px-3.5 py-1.5 text-xs font-black ${product.stock < 10 ? 'border-red-100 bg-red-50 text-red-600' : 'border-emerald-100 bg-emerald-50 text-emerald-600'}`}>
                            {product.stock < 10 ? `Sisa stok: ${product.stock}` : `Stok tersedia: ${product.stock}`}
                        </div>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <button onClick={handleBuyNow} className="rounded-2xl bg-slate-950 py-4 text-sm font-extrabold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-indigo-600 active:translate-y-0">
                                Beli Sekarang →
                            </button>
                            <button onClick={handleAddToCart} className="rounded-2xl border-2 border-slate-950 bg-white py-4 text-sm font-extrabold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0">
                                + Keranjang
                            </button>
                        </div>

                        <div className="my-8 h-px bg-slate-100" />
                        <p className="text-sm leading-7 text-slate-500">{product.description || 'Tidak ada deskripsi produk.'}</p>

                        <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {['Checkout mudah', 'Seller terverifikasi', 'Support marketplace'].map((item) => (
                                <div key={item} className="rounded-2xl bg-slate-50 px-3 py-3 text-center text-[9px] font-black uppercase tracking-wider text-slate-500">{item}</div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-6 rounded-[34px] border border-white bg-white p-6 shadow-xl shadow-slate-200/30 sm:p-10">
                    <div className="mb-7">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">Customer voice</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Ulasan Pembeli</h2>
                    </div>

                    <div className="mb-8 rounded-[27px] bg-slate-950 p-6 text-white sm:p-7">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-300">Share your experience</p>
                                <h3 className="mt-2 text-xl font-black">Bagikan pengalaman Anda</h3>
                            </div>
                            <span className="text-3xl font-black">{avgRating}<span className="text-sm text-slate-500"> / 5</span></span>
                        </div>

                        <form onSubmit={submitReview} className="mt-6 space-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Rating</label>
                                <select value={rating} onChange={(e) => setRating(e.target.value)} className="rounded-xl border border-white/10 bg-white/10 p-3 text-sm font-semibold text-white outline-none focus:ring-4 focus:ring-indigo-500/20">
                                    <option className="text-slate-900" value="5">★★★★★ Sangat Bagus</option>
                                    <option className="text-slate-900" value="4">★★★★ Bagus</option>
                                    <option className="text-slate-900" value="3">★★★ Lumayan</option>
                                    <option className="text-slate-900" value="2">★★ Kurang</option>
                                    <option className="text-slate-900" value="1">★ Buruk</option>
                                </select>
                            </div>
                            <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Bagaimana kualitas produk ini?" required className="w-full resize-y rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white outline-none placeholder:text-slate-500 focus:ring-4 focus:ring-indigo-500/20" />
                            <button type="submit" disabled={loadingReview} className="rounded-2xl bg-white px-6 py-3.5 text-xs font-extrabold text-slate-950 transition hover:bg-indigo-400 hover:text-white disabled:opacity-60">
                                {loadingReview ? 'Mengirim...' : 'Kirim Ulasan →'}
                            </button>
                        </form>
                    </div>

                    {reviews.length === 0 ? (
                        <div className="py-10 text-center">
                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">★</div>
                            <p className="mt-4 text-sm font-black text-slate-700">Belum ada ulasan</p>
                            <p className="mt-1 text-xs font-medium text-slate-400">Jadilah pembeli pertama yang memberikan ulasan.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {reviews.map((rev) => (
                                <div key={rev.id} className="rounded-2xl border border-slate-100 p-5 transition hover:border-indigo-100 hover:bg-slate-50/50">
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
                    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-xs font-bold shadow-2xl backdrop-blur-xl ${toast.type === 'error' ? 'border-red-200 bg-red-50/95 text-red-700' : 'border-emerald-200 bg-emerald-50/95 text-emerald-700'}`}>
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/80">{toast.type === 'error' ? '!' : '✓'}</span>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}