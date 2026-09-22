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
        <div className="min-h-screen overflow-x-hidden bg-[#05050a] font-sans text-slate-300 selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* DARK AMBIENT BACKGROUND */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-900/20 blur-[120px]" />
                <div className="absolute right-[-200px] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-900/10 blur-[100px]" />
                <div className="absolute left-[-200px] bottom-[-100px] h-[500px] w-[500px] rounded-full bg-violet-900/15 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            {/* NAVBAR DARK GLASS */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#05050a]/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="group flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-transform duration-300 group-hover:scale-105">
                            <span className="text-lg font-black tracking-tight">A</span>
                        </div>
                        <div>
                            <div className="text-xl font-black tracking-tight text-white">
                                Algshop<span className="text-cyan-400">.</span>
                            </div>
                            <div className="hidden text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500 sm:block">
                                Premium Marketplace
                            </div>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {user ? (
                            <>
                                <div className="mr-2 hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4 md:flex">
                                    <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-sm">
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="leading-none">
                                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                                            Welcome back
                                        </div>
                                        <div className="max-w-[100px] truncate text-sm font-bold text-slate-200">
                                            {user.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden items-center gap-1 lg:flex">
                                    <Link to="/manajemen-produk" className="rounded-xl px-3 py-2 text-xs font-bold text-slate-400 transition hover:bg-white/5 hover:text-white">Dashboard</Link>
                                    <Link to="/pesanan-masuk" className="rounded-xl px-3 py-2 text-xs font-bold text-slate-400 transition hover:bg-white/5 hover:text-white">Pesanan</Link>
                                    <Link to="/riwayat-belanja" className="rounded-xl px-3 py-2 text-xs font-bold text-slate-400 transition hover:bg-white/5 hover:text-white">Riwayat</Link>
                                </div>

                                <Link
                                    to="/keranjang"
                                    className="group flex h-10 items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-4 text-xs font-bold text-white transition-all hover:bg-cyan-500 hover:border-cyan-400 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
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
                                    className="hidden h-10 rounded-xl border border-white/10 bg-transparent px-4 text-xs font-bold text-slate-400 transition hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10 sm:block"
                                >
                                    Keluar
                                </button>

                                <button
                                    onClick={() => setMobileMenuOpen((open) => !open)}
                                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 lg:hidden"
                                >
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                                        {mobileMenuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:scale-105"
                            >
                                Masuk / Daftar
                            </button>
                        )}
                    </div>
                </div>

                {user && mobileMenuOpen && (
                    <div className="border-t border-white/10 bg-[#05050a]/95 px-4 py-3 shadow-xl backdrop-blur-xl lg:hidden">
                        <div className="mx-auto grid max-w-7xl gap-1">
                            <Link to="/manajemen-produk" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5">Dashboard</Link>
                            <Link to="/pesanan-masuk" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5">Pesanan masuk</Link>
                            <Link to="/riwayat-belanja" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5">Riwayat belanja</Link>
                            <button onClick={handleLogout} className="rounded-xl px-4 py-3 text-left text-sm font-bold text-red-400 hover:bg-red-500/10">Keluar</button>
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO SECTION DARK */}
            <header className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        {/* Neon Pill Label */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
                            </span>
                            {totalProducts} produk tersedia
                        </div>

                        <h1 className="max-w-3xl text-[2.75rem] font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                            Belanja yang
                            <span className="block bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text pb-2 text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                                terasa berbeda.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
                            Temukan produk pilihan dengan pengalaman belanja yang sederhana, cepat,
                            dan dirancang dengan antarmuka yang modern.
                        </p>
                    </div>

                    {/* DARK SEARCH BOX */}
                    <div className="relative">
                        <div className="absolute -inset-1 rounded-[36px] bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 blur-2xl" />
                        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0f]/90 p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-8">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500">Discover</p>
                                    <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Cari favoritmu.</h2>
                                </div>
                                <div className="grid h-12 w-12 place-items-center rounded-[18px] bg-white/5 text-lg text-cyan-400 ring-1 ring-white/10">✦</div>
                            </div>
                            
                            <div className="relative flex items-center rounded-[20px] bg-black/40 p-2 ring-1 ring-white/10 transition-all focus-within:ring-cyan-500/50">
                                <span className="pointer-events-none absolute left-5 text-slate-500">
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
                                    className="h-12 w-full bg-transparent pl-14 pr-12 text-sm font-medium text-white outline-none placeholder:text-slate-500"
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

            {/* PRODUCT CATALOG */}
            <main id="produk" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500">
                            Marketplace
                        </p>
                        <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                            Pilihan untukmu
                        </h2>
                    </div>

                    {searchTerm && (
                        <p className="rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold text-slate-300">
                            {filteredProducts.length} hasil ditemukan
                        </p>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="overflow-hidden rounded-[24px] border border-white/5 bg-white/5 backdrop-blur-sm">
                                <div className="aspect-[4/3] animate-pulse bg-white/5" />
                                <div className="space-y-4 p-5">
                                    <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                                    <div className="h-5 w-4/5 animate-pulse rounded-full bg-white/10" />
                                    <div className="h-8 w-2/5 animate-pulse rounded-full bg-white/10" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="rounded-[32px] border border-white/10 bg-white/5 px-6 py-20 text-center backdrop-blur-md">
                        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-[20px] bg-white/5 text-2xl text-slate-500">
                            ✦
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-white">
                            Produk tidak ditemukan
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                            Belum ada produk yang cocok dengan pencarian “{searchTerm}”. Coba gunakan kata kunci yang berbeda.
                        </p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-6 rounded-xl bg-white/10 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/20"
                        >
                            Lihat semua produk
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((produk) => (
                            <article
                                key={produk.id}
                                className="group flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0f] transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/50 hover:shadow-[0_15px_30px_-10px_rgba(34,211,238,0.2)]"
                            >
                                {/* Image Card (dengan background putih/terang agar foto barang jelas) */}
                                <Link
                                    to={`/produk/${produk.id}`}
                                    className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
                                >
                                    {getProductImage(produk) ? (
                                        <img
                                            src={`/storage/${getProductImage(produk)}`}
                                            alt={produk.name}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            No Image
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />

                                    {produk.stock < 10 && (
                                        <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white shadow-md">
                                            Sisa {produk.stock}
                                        </span>
                                    )}

                                    {/* Icon Panah (Standard SVG tanpa import external) */}
                                    <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 border border-white/20">
                                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                                            <path d="M7 17L17 7M17 7H7M17 7V17"/>
                                        </svg>
                                    </span>
                                </Link>

                                {/* Details Container (Dark) */}
                                <div className="flex flex-1 flex-col p-5">
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-cyan-500/20 text-[9px] font-black text-cyan-400">
                                            {produk.shop?.name ? produk.shop.name.charAt(0).toUpperCase() : 'O'}
                                        </span>
                                        <p className="truncate text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                            {produk.shop?.name || 'Official Store'}
                                        </p>
                                    </div>

                                    <Link
                                        to={`/produk/${produk.id}`}
                                        className="line-clamp-2 min-h-[48px] text-[15px] font-bold leading-6 tracking-tight text-white transition-colors hover:text-cyan-400"
                                    >
                                        {produk.name}
                                    </Link>

                                    <div className="mt-4">
                                        <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                            Harga
                                        </p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-xl font-black tracking-tight text-white">
                                                Rp{Number(produk.final_price ?? produk.price).toLocaleString('id-ID')}
                                            </p>
                                            {Number(produk.discount_percent) > 0 && (
                                                <p className="text-xs font-bold text-slate-500 line-through">
                                                    Rp{Number(produk.price).toLocaleString('id-ID')}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-2">
                                        <button
                                            onClick={() => handleBuyNow(produk.id)}
                                            className="flex-1 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] active:scale-95"
                                        >
                                            Beli sekarang
                                        </button>

                                        <button
                                            onClick={() => handleAddToCart(produk.id)}
                                            title="Tambah ke Keranjang"
                                            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10 active:scale-95"
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

            {/* FOOTER DARK */}
            <footer className="border-t border-white/5 bg-[#05050a]">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">
                    <p className="text-xs font-bold text-slate-600">
                        © {new Date().getFullYear()} Algshop. All rights reserved.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Shop better. Live better.
                    </p>
                </div>
            </footer>

            {/* TOAST DARK */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 z-[100] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 sm:left-auto sm:right-6 sm:w-auto sm:translate-x-0">
                    <div className={`flex items-center gap-3 rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-all border ${toast.type === 'error'
                        ? 'border-red-500/30 bg-red-950/90 text-red-200'
                        : 'border-cyan-500/30 bg-slate-900/90 text-cyan-50'
                        }`}>
                        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-black ${toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                            {toast.type === 'error' ? '!' : '✓'}
                        </div>
                        <p className="text-xs font-bold">{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
