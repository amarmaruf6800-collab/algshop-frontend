import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Catalog() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const response = await api.get('/katalog');
                setProducts(response.data.data);
            } catch (error) {
                console.error('Gagal mengambil data', error);
                showToast('Gagal memuat katalog produk.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCatalog();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        window.setTimeout(() => setToast(null), 2800);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleAddToCart = async (productId) => {
        if (!user) return navigate('/login');

        try {
            const response = await api.post(`/keranjang/${productId}`);
            showToast(response.data.message || 'Produk ditambahkan ke keranjang.');
        } catch (error) {
            showToast(error.response?.data?.message || 'Gagal menambahkan produk.', 'error');
        }
    };

    const handleBuyNow = async (productId) => {
        if (!user) return navigate('/login');

        try {
            await api.post(`/keranjang/${productId}`);
            navigate('/keranjang');
        } catch (error) {
            showToast(error.response?.data?.message || 'Gagal memproses pembelian.', 'error');
        }
    };

    const filteredProducts = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        if (!keyword) return products;

        return products.filter((produk) =>
            produk.name?.toLowerCase().includes(keyword)
        );
    }, [products, searchTerm]);

    const totalProducts = products.length;

    return (
        <div className="min-h-screen bg-[#f7f8fc] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />
                <div className="absolute right-[-180px] top-[38%] h-[420px] w-[420px] rounded-full bg-violet-100/40 blur-3xl" />
                <div className="absolute left-[-180px] bottom-[-100px] h-[420px] w-[420px] rounded-full bg-sky-100/40 blur-3xl" />
            </div>

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/75 backdrop-blur-2xl">
                <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="group flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                            <span className="text-sm font-black tracking-tight">A</span>
                        </div>
                        <div>
                            <div className="text-xl font-black tracking-[-0.04em] text-slate-950">
                                Algshop<span className="text-indigo-500">.</span>
                            </div>
                            <div className="hidden text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400 sm:block">
                                Curated marketplace
                            </div>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {user ? (
                            <>
                                <div className="mr-1 hidden items-center gap-3 rounded-full border border-slate-200/80 bg-white/70 py-1.5 pl-1.5 pr-4 shadow-sm md:flex">
                                    <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-xs font-bold text-white">
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="leading-tight">
                                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            Welcome back
                                        </div>
                                        <div className="max-w-28 truncate text-sm font-bold text-slate-800">
                                            {user.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden items-center gap-1 lg:flex">
                                    <Link to="/manajemen-produk" className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950">
                                        Dashboard
                                    </Link>
                                    <Link to="/pesanan-masuk" className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950">
                                        Pesanan
                                    </Link>
                                    <Link to="/riwayat-belanja" className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950">
                                        Riwayat
                                    </Link>
                                </div>

                                <Link
                                    to="/keranjang"
                                    className="group flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-xs font-extrabold text-white shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                                >
                                    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none stroke-current stroke-2">
                                        <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6" />
                                        <circle cx="10" cy="20" r="1" />
                                        <circle cx="18" cy="20" r="1" />
                                    </svg>
                                    <span>Keranjang</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="hidden h-11 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:block"
                                >
                                    Keluar
                                </button>

                                <button
                                    onClick={() => setMobileMenuOpen((open) => !open)}
                                    className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
                                    aria-label="Buka menu"
                                    aria-expanded={mobileMenuOpen}
                                >
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                                        {mobileMenuOpen ? (
                                            <path d="M6 6l12 12M18 6L6 18" />
                                        ) : (
                                            <path d="M4 7h16M4 12h16M4 17h16" />
                                        )}
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="rounded-2xl bg-slate-950 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                            >
                                Masuk / Daftar
                            </button>
                        )}
                    </div>
                </div>

                {user && mobileMenuOpen && (
                    <div className="border-t border-slate-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-xl lg:hidden">
                        <div className="mx-auto grid max-w-7xl gap-1">
                            <Link
                                to="/manajemen-produk"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/pesanan-masuk"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                                Pesanan masuk
                            </Link>
                            <Link
                                to="/riwayat-belanja"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                                Riwayat belanja
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="rounded-xl px-4 py-3 text-left text-sm font-bold text-red-500 transition hover:bg-red-50"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO */}
            <header className="relative mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
                <div className="grid items-end gap-10 lg:grid-cols-[1fr_420px]">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm backdrop-blur">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.10)]" />
                            {totalProducts} produk tersedia
                        </div>

                        <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
                            Temukan sesuatu
                            <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-slate-950 bg-clip-text text-transparent">
                                yang luar biasa.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                            Koleksi pilihan dengan kualitas terbaik, harga transparan,
                            dan pengalaman belanja yang dibuat sederhana.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-r from-indigo-200/50 to-violet-200/50 blur-xl" />
                        <div className="relative rounded-[26px] border border-white bg-white/85 p-2 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
                            <div className="relative flex items-center">
                                <span className="pointer-events-none absolute left-4 text-slate-400">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                                        <circle cx="11" cy="11" r="7" />
                                        <path d="m20 20-4-4" />
                                    </svg>
                                </span>

                                <input
                                    type="text"
                                    placeholder="Cari produk favoritmu..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-12 w-full rounded-[19px] bg-slate-50 pl-12 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                                />

                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 grid h-8 w-8 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                        aria-label="Hapus pencarian"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* PRODUCT CATALOG */}
            <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">
                            Marketplace
                        </p>
                        <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                            Pilihan untukmu
                        </h2>
                    </div>

                    {searchTerm && (
                        <p className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500 shadow-sm">
                            {filteredProducts.length} hasil
                        </p>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white">
                                <div className="aspect-[4/3] animate-pulse bg-slate-100" />
                                <div className="space-y-4 p-5">
                                    <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
                                    <div className="h-5 w-4/5 animate-pulse rounded-full bg-slate-100" />
                                    <div className="h-8 w-2/5 animate-pulse rounded-full bg-slate-100" />
                                    <div className="h-11 w-full animate-pulse rounded-2xl bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="rounded-[32px] border border-slate-200/80 bg-white/80 px-6 py-20 text-center shadow-sm backdrop-blur">
                        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-2xl">
                            ✦
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-950">
                            Produk tidak ditemukan
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            {`Belum ada produk yang cocok dengan pencarian “${searchTerm}”. Coba gunakan kata kunci lain.`}
                        </p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-extrabold text-white transition hover:bg-slate-800"
                        >
                            Lihat semua produk
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((produk) => (
                            <article
                                key={produk.id}
                                className="group flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-sm shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-300/30"
                            >
                                {/* Image */}
                                <Link
                                    to={`/produk/${produk.id}`}
                                    className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
                                >
                                    {produk.image ? (
                                        <img
                                            src={`/storage/${produk.image}`}
                                            alt={produk.name}
                                            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-bold uppercase tracking-widest text-slate-400">
                                            Tanpa gambar
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                    {produk.stock < 10 && (
                                        <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-600 shadow-lg shadow-slate-900/10 backdrop-blur">
                                            Sisa {produk.stock}
                                        </span>
                                    )}

                                    <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white/85 text-slate-600 opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:opacity-100">
                                        ↗
                                    </span>
                                </Link>

                                {/* Details */}
                                <div className="flex flex-1 flex-col p-5">
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-slate-100 text-[10px]">
                                            S
                                        </span>
                                        <p className="truncate text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                                            {produk.shop?.name || 'Official Store'}
                                        </p>
                                    </div>

                                    <Link
                                        to={`/produk/${produk.id}`}
                                        className="line-clamp-2 min-h-[48px] text-base font-extrabold leading-6 tracking-tight text-slate-900 transition-colors hover:text-indigo-600"
                                    >
                                        {produk.name}
                                    </Link>

                                    <div className="mt-5">
                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                            Harga
                                        </p>
                                        <p className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                                            Rp{Number(produk.price).toLocaleString('id-ID')}
                                        </p>
                                    </div>

                                    <div className="mt-auto flex gap-2 pt-5">
                                        <button
                                            onClick={() => handleBuyNow(produk.id)}
                                            className="flex-1 rounded-2xl bg-slate-950 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-indigo-500/20 active:translate-y-0"
                                        >
                                            Beli sekarang
                                        </button>

                                        <button
                                            onClick={() => handleAddToCart(produk.id)}
                                            title="Tambah ke Keranjang"
                                            aria-label={`Tambah ${produk.name} ke keranjang`}
                                            className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition-all hover:border-slate-900 hover:bg-slate-950 hover:text-white active:scale-95"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-2">
                                                <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6" />
                                                <circle cx="10" cy="20" r="1" />
                                                <circle cx="18" cy="20" r="1" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            {/* FOOTER */}
            <footer className="border-t border-slate-200/70 bg-white/60">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">
                    <p className="text-xs font-bold text-slate-400">
                        © {new Date().getFullYear()} Algshop. All rights reserved.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300">
                        Shop better. Live better.
                    </p>
                </div>
            </footer>

            {/* TOAST */}
            {toast && (
                <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-md -translate-x-1/2 sm:left-auto sm:right-5 sm:w-auto sm:translate-x-0">
                    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-xl ${toast.type === 'error'
                        ? 'border-red-200 bg-red-50/95 text-red-700'
                        : 'border-emerald-200 bg-emerald-50/95 text-emerald-700'
                        }`}>
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/80 text-sm">
                            {toast.type === 'error' ? '!' : '✓'}
                        </div>
                        <p className="text-xs font-bold">{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
