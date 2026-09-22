import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const getProductImage = (product) => product?.images?.[0]?.path || product?.image;

export default function Catalog() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        window.setTimeout(() => setToast(null), 2800);
    };

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
            showToast(
                error.response?.data?.message || 'Gagal menambahkan produk.',
                'error'
            );
        }
    };

    const handleBuyNow = async (productId) => {
        if (!user) return navigate('/login');

        try {
            await api.post(`/keranjang/${productId}`);
            navigate('/keranjang');
        } catch (error) {
            showToast(
                error.response?.data?.message || 'Gagal memproses pembelian.',
                'error'
            );
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
        <div className="min-h-screen overflow-x-hidden bg-[#f5f5f3] font-sans text-[#111111] selection:bg-violet-600 selection:text-white">

            {/* =========================================================
                BACKGROUND
            ========================================================== */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-[8%] top-[-220px] h-[520px] w-[520px] rounded-full bg-violet-200/20 blur-[120px]" />
                <div className="absolute right-[-160px] top-[18%] h-[460px] w-[460px] rounded-full bg-indigo-200/20 blur-[120px]" />
                <div className="absolute bottom-[-200px] left-[35%] h-[500px] w-[500px] rounded-full bg-purple-200/15 blur-[140px]" />
            </div>

            {/* =========================================================
                NAVBAR
            ========================================================== */}
            <nav className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f8f8f6]/85 backdrop-blur-2xl">
                <div className="mx-auto flex min-h-[82px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">

                    {/* Brand */}
                    <Link
                        to="/katalog"
                        className="group flex items-center gap-3"
                    >
                        <div className="relative grid h-11 w-11 place-items-center rounded-[15px] bg-[#090b18] text-white shadow-[0_10px_30px_rgba(10,12,30,0.16)] transition duration-500 group-hover:-rotate-3 group-hover:scale-105">
                            <span className="text-sm font-black tracking-[-0.06em]">
                                A
                            </span>

                            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-violet-500 ring-4 ring-[#f8f8f6]" />
                        </div>

                        <div className="leading-none">
                            <div className="text-[21px] font-black tracking-[-0.055em] text-[#090b18]">
                                Algshop<span className="text-violet-600">.</span>
                            </div>

                            <div className="mt-1.5 hidden text-[9px] font-bold uppercase tracking-[0.24em] text-slate-400 sm:block">
                                Curated marketplace
                            </div>
                        </div>
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden items-center gap-1 lg:flex">
                        <a
                            href="#produk"
                            className="rounded-full px-4 py-2.5 text-[11px] font-bold text-slate-500 transition hover:bg-white hover:text-slate-950"
                        >
                            Marketplace
                        </a>

                        {user && (
                            <>
                                <Link
                                    to="/riwayat-belanja"
                                    className="rounded-full px-4 py-2.5 text-[11px] font-bold text-slate-500 transition hover:bg-white hover:text-slate-950"
                                >
                                    Riwayat
                                </Link>

                                <Link
                                    to="/pesanan-masuk"
                                    className="rounded-full px-4 py-2.5 text-[11px] font-bold text-slate-500 transition hover:bg-white hover:text-slate-950"
                                >
                                    Pesanan
                                </Link>

                                <Link
                                    to="/manajemen-produk"
                                    className="rounded-full px-4 py-2.5 text-[11px] font-bold text-slate-500 transition hover:bg-white hover:text-slate-950"
                                >
                                    Dashboard
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2.5">

                        {user ? (
                            <>
                                {/* User */}
                                <div className="hidden items-center gap-2.5 rounded-full border border-black/[0.06] bg-white/70 py-1.5 pl-1.5 pr-4 shadow-sm md:flex">
                                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#090b18] text-[10px] font-black text-white">
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>

                                    <div className="leading-none">
                                        <div className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                            Welcome back
                                        </div>

                                        <div className="mt-1 max-w-28 truncate text-[11px] font-bold text-slate-800">
                                            {user.name}
                                        </div>
                                    </div>
                                </div>

                                {/* Cart */}
                                <Link
                                    to="/keranjang"
                                    className="group flex h-11 items-center gap-2 rounded-full bg-[#090b18] px-4 text-[11px] font-extrabold text-white shadow-[0_10px_28px_rgba(10,12,30,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-violet-600"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-[16px] w-[16px] fill-none stroke-current stroke-2"
                                    >
                                        <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6" />
                                        <circle cx="10" cy="20" r="1" />
                                        <circle cx="18" cy="20" r="1" />
                                    </svg>

                                    <span className="hidden sm:inline">
                                        Keranjang
                                    </span>
                                </Link>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="hidden h-11 rounded-full border border-black/[0.07] bg-white px-4 text-[11px] font-bold text-slate-500 transition hover:border-black/10 hover:bg-slate-50 hover:text-slate-950 sm:block"
                                >
                                    Keluar
                                </button>

                                {/* Mobile */}
                                <button
                                    onClick={() =>
                                        setMobileMenuOpen((open) => !open)
                                    }
                                    className="grid h-11 w-11 place-items-center rounded-full border border-black/[0.07] bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
                                    aria-label="Buka menu"
                                    aria-expanded={mobileMenuOpen}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-5 w-5 fill-none stroke-current stroke-2"
                                    >
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
                                className="h-11 rounded-full bg-[#090b18] px-5 text-[11px] font-extrabold text-white shadow-[0_10px_28px_rgba(10,12,30,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-violet-600"
                            >
                                Masuk / Daftar
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                {user && mobileMenuOpen && (
                    <div className="border-t border-black/[0.05] bg-[#f8f8f6]/95 px-5 py-4 backdrop-blur-xl lg:hidden">
                        <div className="mx-auto grid max-w-7xl gap-1">
                            <a
                                href="#produk"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-slate-950"
                            >
                                Marketplace
                            </a>

                            <Link
                                to="/manajemen-produk"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-slate-950"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/pesanan-masuk"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-slate-950"
                            >
                                Pesanan masuk
                            </Link>

                            <Link
                                to="/riwayat-belanja"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-slate-950"
                            >
                                Riwayat belanja
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="rounded-2xl px-4 py-3 text-left text-sm font-bold text-red-500 transition hover:bg-red-50"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* =========================================================
                HERO
            ========================================================== */}
            <header className="mx-auto max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:px-10 lg:pt-24">

                <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] xl:gap-20">

                    {/* Hero copy */}
                    <div className="max-w-3xl">

                        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-black/[0.06] bg-white/75 px-3.5 py-2 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>

                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                                {totalProducts} produk tersedia
                            </span>
                        </div>

                        <h1 className="max-w-4xl text-[52px] font-black leading-[0.91] tracking-[-0.065em] text-[#080a16] sm:text-7xl lg:text-[92px]">
                            Belanja yang
                            <span className="mt-1 block bg-gradient-to-r from-violet-600 via-indigo-600 to-[#080a16] bg-clip-text pb-2 text-transparent">
                                terasa berbeda.
                            </span>
                        </h1>

                        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
                            <div className="h-px w-12 bg-violet-500 sm:mt-3" />

                            <p className="max-w-xl text-sm leading-7 text-slate-500 sm:text-[15px]">
                                Temukan produk pilihan dengan pengalaman
                                belanja yang sederhana, cepat, dan dirancang
                                dengan perhatian pada setiap detail.
                            </p>
                        </div>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <a
                                href="#produk"
                                className="group inline-flex items-center gap-3 rounded-full bg-[#090b18] px-5 py-3.5 text-[11px] font-extrabold text-white shadow-[0_14px_35px_rgba(10,12,30,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-violet-600"
                            >
                                Jelajahi produk

                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </a>

                            <div className="inline-flex items-center rounded-full border border-black/[0.07] bg-white/70 px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                Curated selection
                            </div>
                        </div>
                    </div>

                    {/* Hero discovery panel */}
                    <div className="relative">

                        {/* Glow */}
                        <div className="absolute -inset-10 rounded-full bg-violet-300/20 blur-[80px]" />

                        {/* Main frame */}
                        <div className="relative overflow-hidden rounded-[34px] border border-black/[0.08] bg-[#090b18] p-2 shadow-[0_35px_80px_rgba(15,23,42,0.18)]">

                            {/* Inner */}
                            <div className="relative min-h-[390px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[radial-gradient(circle_at_75%_20%,rgba(124,92,255,0.2),transparent_30%),linear-gradient(145deg,#111426,#080a14)] p-7 sm:p-9">

                                {/* Decorative grid */}
                                <div
                                    className="pointer-events-none absolute inset-0 opacity-[0.08]"
                                    style={{
                                        backgroundImage:
                                            'linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)',
                                        backgroundSize: '38px 38px',
                                    }}
                                />

                                {/* Floating orb */}
                                <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-white/[0.08] bg-violet-500/10 blur-[1px]" />
                                <div className="absolute right-12 top-10 h-16 w-16 rounded-full bg-violet-500/20 blur-2xl" />

                                {/* Top */}
                                <div className="relative flex items-start justify-between">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.24em] text-violet-300">
                                            Discover
                                        </p>

                                        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                                            Cari produk
                                            <br />
                                            favoritmu.
                                        </h2>
                                    </div>

                                    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.06] text-violet-200">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5 fill-none stroke-current stroke-1.5"
                                        >
                                            <path d="M12 3v18M3 12h18" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Search */}
                                <div className="relative mt-12">

                                    <div className="absolute -inset-2 rounded-[25px] bg-violet-500/10 blur-xl" />

                                    <div className="relative flex items-center rounded-[22px] border border-black/[0.05] bg-white p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">

                                        <span className="pointer-events-none grid h-12 w-12 shrink-0 place-items-center text-slate-400">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="h-5 w-5 fill-none stroke-current stroke-2"
                                            >
                                                <circle cx="11" cy="11" r="7" />
                                                <path d="m20 20-4-4" />
                                            </svg>
                                        </span>

                                        <input
                                            type="text"
                                            placeholder="Cari produk favoritmu..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="h-12 w-full bg-transparent pr-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                                        />

                                        {searchTerm && (
                                            <button
                                                onClick={() =>
                                                    setSearchTerm('')
                                                }
                                                className="mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                                aria-label="Hapus pencarian"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom stats */}
                                <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between border-t border-white/[0.08] pt-5 sm:bottom-9 sm:left-9 sm:right-9">

                                    <div>
                                        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/35">
                                            Marketplace
                                        </p>

                                        <p className="mt-1 text-[11px] font-bold text-white/70">
                                            Selected for you
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
                                            Live catalog
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* =========================================================
                PRODUCTS
            ========================================================== */}
            <main
                id="produk"
                className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-10"
            >

                {/* Section header */}
                <div className="mb-8 flex flex-col gap-5 border-b border-black/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                        <div className="flex items-center gap-3">
                            <span className="h-px w-7 bg-violet-500" />

                            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-violet-600">
                                Marketplace
                            </p>
                        </div>

                        <h2 className="mt-2 text-3xl font-black tracking-[-0.055em] text-[#090b18] sm:text-4xl">
                            Pilihan untukmu
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {searchTerm && (
                            <p className="rounded-full border border-black/[0.07] bg-white px-4 py-2 text-[10px] font-bold text-slate-500 shadow-sm">
                                {filteredProducts.length} hasil
                            </p>
                        )}

                        <span className="hidden text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                            {filteredProducts.length} products
                        </span>
                    </div>
                </div>

                {/* Loading */}
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white"
                            >
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
                    /* Empty */
                    <div className="rounded-[34px] border border-black/[0.07] bg-white px-6 py-24 text-center shadow-sm">
                        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-[22px] bg-slate-100 text-xl">
                            ✦
                        </div>

                        <h2 className="text-2xl font-black tracking-tight text-[#090b18]">
                            Produk tidak ditemukan
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            {`Belum ada produk yang cocok dengan pencarian “${searchTerm}”. Coba gunakan kata kunci lain.`}
                        </p>

                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-7 rounded-full bg-[#090b18] px-5 py-3 text-[11px] font-extrabold text-white transition hover:bg-violet-600"
                        >
                            Lihat semua produk
                        </button>
                    </div>
                ) : (
                    /* Products */
                    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((produk) => {
                            const image = getProductImage(produk);
                            const hasDiscount =
                                Number(produk.discount_percent) > 0;

                            return (
                                <article
                                    key={produk.id}
                                    className="group flex min-w-0 flex-col"
                                >

                                    {/* Image */}
                                    <Link
                                        to={`/produk/${produk.id}`}
                                        className="relative block aspect-[4/3] overflow-hidden rounded-[26px] bg-[#e9e9e7]"
                                    >
                                        {image ? (
                                            <img
                                                src={`/storage/${image}`}
                                                alt={produk.name}
                                                className="h-full w-full object-cover transition duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.055]"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                Tanpa gambar
                                            </div>
                                        )}

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                                        {/* Stock */}
                                        {produk.stock < 10 && (
                                            <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-red-600 shadow-lg backdrop-blur">
                                                Sisa {produk.stock}
                                            </span>
                                        )}

                                        {/* Open */}
                                        <span className="absolute right-4 top-4 grid h-10 w-10 translate-y-1 place-items-center rounded-full bg-white/90 text-slate-800 opacity-0 shadow-xl backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                            ↗
                                        </span>
                                    </Link>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col px-1 pt-4">

                                        {/* Shop */}
                                        <div className="flex items-center gap-2">
                                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#090b18] text-[8px] font-black text-white">
                                                S
                                            </span>

                                            <p className="truncate text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                                                {produk.shop?.name ||
                                                    'Official Store'}
                                            </p>
                                        </div>

                                        {/* Name */}
                                        <Link
                                            to={`/produk/${produk.id}`}
                                            className="mt-2 line-clamp-2 min-h-[48px] text-[16px] font-extrabold leading-6 tracking-[-0.025em] text-[#111111] transition-colors hover:text-violet-600"
                                        >
                                            {produk.name}
                                        </Link>

                                        {/* Price */}
                                        <div className="mt-3">
                                            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                                Harga terbaik
                                            </p>

                                            {hasDiscount && (
                                                <p className="mt-1 text-[11px] font-semibold text-slate-400 line-through">
                                                    Rp
                                                    {Number(
                                                        produk.price
                                                    ).toLocaleString('id-ID')}
                                                </p>
                                            )}

                                            <p className="text-[22px] font-black tracking-[-0.045em] text-[#090b18]">
                                                Rp
                                                {Number(
                                                    produk.final_price ??
                                                        produk.price
                                                ).toLocaleString('id-ID')}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleBuyNow(produk.id)
                                                }
                                                className="flex-1 rounded-full bg-[#090b18] py-3.5 text-[10px] font-extrabold text-white shadow-[0_8px_20px_rgba(10,12,30,0.1)] transition duration-300 hover:-translate-y-0.5 hover:bg-violet-600 hover:shadow-violet-500/20 active:translate-y-0"
                                            >
                                                Beli sekarang
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleAddToCart(produk.id)
                                                }
                                                title="Tambah ke Keranjang"
                                                aria-label={`Tambah ${produk.name} ke keranjang`}
                                                className="grid h-[45px] w-[45px] shrink-0 place-items-center rounded-full border border-black/[0.07] bg-white text-slate-700 transition duration-300 hover:border-[#090b18] hover:bg-[#090b18] hover:text-white active:scale-95"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="h-[17px] w-[17px] fill-none stroke-current stroke-2"
                                                >
                                                    <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6" />
                                                    <circle
                                                        cx="10"
                                                        cy="20"
                                                        r="1"
                                                    />
                                                    <circle
                                                        cx="18"
                                                        cy="20"
                                                        r="1"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* =========================================================
                FOOTER
            ========================================================== */}
            <footer className="border-t border-black/[0.07] bg-[#090b18] text-white">
                <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">

                    <div>
                        <div className="text-lg font-black tracking-[-0.05em]">
                            Algshop<span className="text-violet-400">.</span>
                        </div>

                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                            Curated marketplace
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] font-bold text-white/35">
                            © {new Date().getFullYear()} Algshop
                        </p>

                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/20">
                            Shop better. Live better.
                        </p>
                    </div>
                </div>
            </footer>

            {/* =========================================================
                TOAST
            ========================================================== */}
            {toast && (
                <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-md -translate-x-1/2 sm:left-auto sm:right-5 sm:w-auto sm:translate-x-0">
                    <div
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-xl ${
                            toast.type === 'error'
                                ? 'border-red-200 bg-red-50/95 text-red-700'
                                : 'border-emerald-200 bg-emerald-50/95 text-emerald-700'
                        }`}
                    >
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/80 text-sm">
                            {toast.type === 'error' ? '!' : '✓'}
                        </div>

                        <p className="text-xs font-bold">
                            {toast.message}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
