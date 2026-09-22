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
        <div className="min-h-screen overflow-x-hidden bg-[#fafcff] font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
            {/* Ambient background yang lebih lembut */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-50/50 blur-3xl" />
                <div className="absolute right-[-200px] top-[30%] h-[500px] w-[500px] rounded-full bg-violet-50/40 blur-3xl" />
                <div className="absolute left-[-200px] bottom-[-100px] h-[500px] w-[500px] rounded-full bg-blue-50/40 blur-3xl" />
            </div>

            {/* NAVBAR PREMIUM */}
            <nav className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all">
                <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="group flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-slate-900 text-white shadow-md shadow-slate-900/20 transition-all duration-300 group-hover:-rotate-3 group-hover:scale-105">
                            <span className="text-lg font-black tracking-tight">A</span>
                        </div>
                        <div>
                            <div className="text-xl font-black tracking-tight text-slate-900">
                                Algshop<span className="text-indigo-600">.</span>
                            </div>
                            <div className="hidden text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400 sm:block">
                                Curated marketplace
                            </div>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {user ? (
                            <>
                                <div className="mr-2 hidden items-center gap-3 rounded-full bg-slate-100/80 py-1.5 pl-1.5 pr-4 md:flex">
                                    <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm">
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="leading-none">
                                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                                            Welcome back
                                        </div>
                                        <div className="max-w-[100px] truncate text-sm font-bold text-slate-800">
                                            {user.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden items-center gap-1 lg:flex">
                                    <Link to="/manajemen-produk" className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                                        Dashboard
                                    </Link>
                                    <Link to="/pesanan-masuk" className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                                        Pesanan
                                    </Link>
                                    <Link to="/riwayat-belanja" className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                                        Riwayat
                                    </Link>
                                </div>

                                <Link
                                    to="/keranjang"
                                    className="group flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-xs font-bold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-indigo-500/25"
                                >
                                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                                        <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6" />
                                        <circle cx="10" cy="20" r="1" />
                                        <circle cx="18" cy="20" r="1" />
                                    </svg>
                                    <span>Keranjang</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="hidden h-11 rounded-2xl border border-slate-200/80 bg-white px-4 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:block"
                                >
                                    Keluar
                                </button>

                                <button
                                    onClick={() => setMobileMenuOpen((open) => !open)}
                                    className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200/80 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
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
                                className="rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                            >
                                Masuk / Daftar
                            </button>
                        )}
                    </div>
                </div>

                {user && mobileMenuOpen && (
                    <div className="border-t border-slate-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-xl lg:hidden">
                        <div className="mx-auto grid max-w-7xl gap-1">
                            <Link to="/manajemen-produk" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Dashboard</Link>
                            <Link to="/pesanan-masuk" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Pesanan masuk</Link>
                            <Link to="/riwayat-belanja" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Riwayat belanja</Link>
                            <button onClick={handleLogout} className="rounded-xl px-4 py-3 text-left text-sm font-bold text-red-500 transition hover:bg-red-50">Keluar</button>
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO SECTION PREMIUM */}
            <header className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        {/* Soft Pill Label */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.15)] backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                            </span>
                            {totalProducts} produk tersedia
                        </div>

                        <h1 className="max-w-3xl text-[2.75rem] font-black leading-[1.05] tracking-[-0.04em] text-slate-900 sm:text-6xl lg:text-7xl">
                            Belanja yang
                            <span className="block bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text pb-2 text-transparent">
                                terasa berbeda.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                            Temukan produk pilihan dengan pengalaman belanja yang sederhana, cepat,
                            dan dirancang dengan perhatian penuh pada setiap detail.
                        </p>
                    </div>

                    {/* GLASSMORPHISM SEARCH BOX */}
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-indigo-500/20 to-violet-500/20 blur-2xl" />
                        <div className="relative overflow-hidden rounded-[32px] bg-slate-900/95 p-6 shadow-[0_32px_64px_-15px_rgba(79,70,229,0.3)] ring-1 ring-white/10 backdrop-blur-2xl sm:p-8">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Discover</p>
                                    <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Cari favoritmu.</h2>
                                </div>
                                <div className="grid h-12 w-12 place-items-center rounded-[18px] bg-white/5 text-lg text-indigo-300 ring-1 ring-white/10 shadow-inner shadow-white/5">✦</div>
                            </div>
                            
                            <div className="relative flex items-center rounded-[20px] bg-white/10 p-2 ring-1 ring-white/20 transition-all focus-within:bg-white/15 focus-within:ring-indigo-400/50">
                                <span className="pointer-events-none absolute left-5 text-indigo-200">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                                        <circle cx="11" cy="11" r="7" />
                                        <path d="m20 20-4-4" />
                                    </svg>
                                </span>

                                <input
                                    type="text"
                                    placeholder="Ketik nama produk..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-12 w-full bg-transparent pl-14 pr-12 text-sm font-medium text-white outline-none placeholder:text-slate-400"
                                />

                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* PRODUCT CATALOG PREMIUM */}
            <main id="produk" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-3 border-b border-slate-200/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                            Marketplace
                        </p>
                        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                            Pilihan untukmu
                        </h2>
                    </div>

                    {searchTerm && (
                        <p className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-500">
                            {filteredProducts.length} hasil ditemukan
                        </p>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200/50">
                                <div className="aspect-[4/3] animate-pulse bg-slate-100" />
                                <div className="space-y-4 p-5">
                                    <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
                                    <div className="h-5 w-4/5 animate-pulse rounded-full bg-slate-100" />
                                    <div className="h-8 w-2/5 animate-pulse rounded-full bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="rounded-[32px] bg-white/60 px-6 py-20 text-center shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md">
                        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-[20px] bg-indigo-50 text-2xl text-indigo-500 ring-1 ring-indigo-100">
                            ✦
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">
                            Produk tidak ditemukan
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Belum ada produk yang cocok dengan pencarian “{searchTerm}”. Coba gunakan kata kunci yang berbeda.
                        </p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-md shadow-slate-900/10 transition hover:bg-slate-800"
                        >
                            Lihat semua produk
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((produk) => (
                            <article
                                key={produk.id}
                                className="group flex min-w-0 flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] ring-1 ring-slate-200/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] hover:ring-indigo-100"
                            >
                                {/* Image Card */}
                                <Link
                                    to={`/produk/${produk.id}`}
                                    className="relative block aspect-[4/3] overflow-hidden bg-slate-50"
                                >
                                    {getProductImage(produk) ? (
                                        <img
                                            src={`/storage/${getProductImage(produk)}`}
                                            alt={produk.name}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            No Image
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                    {produk.stock < 10 && (
                                        <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white shadow-md">
                                            Sisa {produk.stock}
                                        </span>
                                    )}

                                    <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                                        <ArrowUpRight size={16} /> {/* Anda bisa import icon arrow dari lucide-react jika ada, atau gunakan SVG */}
                                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                                    </span>
                                </Link>

                                {/* Details */}
                                <div className="flex flex-1 flex-col p-6">
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-indigo-50 text-[9px] font-black text-indigo-600">
                                            {produk.shop?.name ? produk.shop.name.charAt(0).toUpperCase() : 'O'}
                                        </span>
                                        <p className="truncate text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                            {produk.shop?.name || 'Official Store'}
                                        </p>
                                    </div>

                                    <Link
                                        to={`/produk/${produk.id}`}
                                        className="line-clamp-2 min-h-[48px] text-[15px] font-bold leading-6 tracking-tight text-slate-900 transition-colors hover:text-indigo-600"
                                    >
                                        {produk.name}
                                    </Link>

                                    <div className="mt-4">
                                        <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                            Harga
                                        </p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-xl font-black tracking-tight text-slate-900">
                                                Rp{Number(produk.final_price ?? produk.price).toLocaleString('id-ID')}
                                            </p>
                                            {Number(produk.discount_percent) > 0 && (
                                                <p className="text-xs font-bold text-slate-400 line-through">
                                                    Rp{Number(produk.price).toLocaleString('id-ID')}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-2">
                                        <button
                                            onClick={() => handleBuyNow(produk.id)}
                                            className="flex-1 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
                                        >
                                            Beli sekarang
                                        </button>

                                        <button
                                            onClick={() => handleAddToCart(produk.id)}
                                            title="Tambah ke Keranjang"
                                            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 active:scale-95"
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
            <footer className="border-t border-slate-200/60 bg-white/40 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">
                    <p className="text-xs font-bold text-slate-500">
                        © {new Date().getFullYear()} Algshop. All rights reserved.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Shop better. Live better.
                    </p>
                </div>
            </footer>

            {/* TOAST PREMIUM */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 z-[100] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 sm:left-auto sm:right-6 sm:w-auto sm:translate-x-0">
                    <div className={`flex items-center gap-3 rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-all ${toast.type === 'error'
                        ? 'bg-rose-500/95 text-white shadow-rose-500/20'
                        : 'bg-slate-900/95 text-white shadow-slate-900/20'
                        }`}>
                        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-black ${toast.type === 'error' ? 'bg-white/20' : 'bg-indigo-500'}`}>
                            {toast.type === 'error' ? '!' : '✓'}
                        </div>
                        <p className="text-xs font-bold">{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
