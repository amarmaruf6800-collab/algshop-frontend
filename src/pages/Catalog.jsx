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
        <div className="min-h-screen overflow-x-hidden bg-[#F5F2EA] font-body text-[#16191C] selection:bg-[#1E4034] selection:text-white">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&display=swap');

                .font-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }
                .font-body { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif; }

                @keyframes algshopReveal {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .algshop-reveal { animation: algshopReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }

                @keyframes algshopShimmer {
                    0% { background-position: -500px 0; }
                    100% { background-position: 500px 0; }
                }
                .algshop-skeleton {
                    background-color: #ECE7DA;
                    background-image: linear-gradient(90deg, rgba(236,231,218,0) 0%, rgba(255,255,255,0.85) 50%, rgba(236,231,218,0) 100%);
                    background-size: 500px 100%;
                    background-repeat: no-repeat;
                    animation: algshopShimmer 1.5s ease-in-out infinite;
                }

                @keyframes algshopToast {
                    from { opacity: 0; transform: translateY(10px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .algshop-toast { animation: algshopToast 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }

                @media (prefers-reduced-motion: reduce) {
                    .algshop-reveal, .algshop-skeleton, .algshop-toast {
                        animation: none !important;
                    }
                }
            `}</style>

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-[#E3DFD3] bg-[#F5F2EA]/95 backdrop-blur-sm">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="font-display text-2xl text-[#16191C] transition-opacity hover:opacity-70">
                        Algshop<span className="text-[#1E4034]">.</span>
                    </Link>

                    <div className="flex items-center gap-1 sm:gap-2">
                        {user ? (
                            <>
                                <div className="mr-1 hidden items-center gap-1 border-r border-[#E3DFD3] pr-3 lg:flex">
                                    <Link to="/manajemen-produk" className="rounded-full px-3 py-2 text-sm font-medium text-[#16191C]/65 transition hover:text-[#16191C]">
                                        Dashboard
                                    </Link>
                                    <Link to="/pesanan-masuk" className="rounded-full px-3 py-2 text-sm font-medium text-[#16191C]/65 transition hover:text-[#16191C]">
                                        Pesanan
                                    </Link>
                                    <Link to="/riwayat-belanja" className="rounded-full px-3 py-2 text-sm font-medium text-[#16191C]/65 transition hover:text-[#16191C]">
                                        Riwayat
                                    </Link>
                                </div>

                                <div className="hidden items-center gap-2.5 pr-1 md:flex">
                                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#E3DFD3] bg-white font-display text-sm text-[#16191C]">
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="max-w-24 truncate text-sm font-medium text-[#16191C]">
                                        {user.name}
                                    </span>
                                </div>

                                <Link
                                    to="/keranjang"
                                    className="flex h-10 items-center gap-2 rounded-full bg-[#16191C] px-4 text-sm font-medium text-[#F5F2EA] transition-colors hover:bg-[#1E4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4034] focus-visible:ring-offset-2"
                                >
                                    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none stroke-current stroke-2">
                                        <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6" />
                                        <circle cx="10" cy="20" r="1" />
                                        <circle cx="18" cy="20" r="1" />
                                    </svg>
                                    <span className="hidden sm:inline">Keranjang</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="hidden h-10 rounded-full px-4 text-sm font-medium text-[#16191C]/55 transition hover:text-[#16191C] sm:block"
                                >
                                    Keluar
                                </button>

                                <button
                                    onClick={() => setMobileMenuOpen((open) => !open)}
                                    className="grid h-10 w-10 place-items-center rounded-full text-[#16191C] transition hover:bg-[#EDE9DF] lg:hidden"
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
                                className="rounded-full bg-[#16191C] px-5 py-2.5 text-sm font-medium text-[#F5F2EA] transition-colors hover:bg-[#1E4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4034] focus-visible:ring-offset-2"
                            >
                                Masuk / Daftar
                            </button>
                        )}
                    </div>
                </div>

                {user && mobileMenuOpen && (
                    <div className="border-t border-[#E3DFD3] bg-[#F5F2EA] px-4 py-3 lg:hidden">
                        <div className="mx-auto grid max-w-7xl gap-1">
                            <Link
                                to="/manajemen-produk"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-xl px-4 py-3 text-sm font-medium text-[#16191C]/80 transition hover:bg-white"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/pesanan-masuk"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-xl px-4 py-3 text-sm font-medium text-[#16191C]/80 transition hover:bg-white"
                            >
                                Pesanan masuk
                            </Link>
                            <Link
                                to="/riwayat-belanja"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-xl px-4 py-3 text-sm font-medium text-[#16191C]/80 transition hover:bg-white"
                            >
                                Riwayat belanja
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-[#A23E2E] transition hover:bg-white"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO */}
            <header className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                    <h1
                        className="algshop-reveal font-display max-w-xl text-[2.5rem] leading-[1.08] tracking-[-0.01em] text-[#16191C] sm:text-6xl lg:text-[4.25rem]"
                        style={{ animationDelay: '0ms' }}
                    >
                        Belanja yang terasa berbeda, dari toko-toko pilihan.
                    </h1>

                    <p
                        className="algshop-reveal max-w-md text-[15px] leading-7 text-[#16191C]/60 sm:text-base lg:self-end lg:pb-2"
                        style={{ animationDelay: '120ms' }}
                    >
                        {isLoading
                            ? 'Sedang menyiapkan katalog produk pilihan untukmu.'
                            : totalProducts > 0
                                ? `Saat ini ada ${totalProducts} produk siap dikirim dari penjual-penjual tepercaya di seluruh platform.`
                                : 'Katalog akan segera terisi dengan produk-produk pilihan.'}
                    </p>
                </div>

                <div
                    className="algshop-reveal mt-10 border-y border-[#16191C]/15 sm:mt-14"
                    style={{ animationDelay: '220ms' }}
                >
                    <div className="flex items-center gap-3 py-5 sm:gap-4 sm:py-7">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-current stroke-2 text-[#16191C]/35 sm:h-6 sm:w-6">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4" />
                        </svg>

                        <input
                            type="text"
                            placeholder="Cari produk favoritmu…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="font-display w-full min-w-0 bg-transparent text-xl text-[#16191C] outline-none placeholder:italic placeholder:text-[#16191C]/35 sm:text-3xl"
                        />

                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                aria-label="Hapus pencarian"
                                className="shrink-0 rounded-full border border-[#16191C]/20 px-3 py-1.5 text-xs font-medium text-[#16191C]/60 transition hover:border-[#16191C]/50 hover:text-[#16191C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4034]"
                            >
                                Hapus
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* PRODUCT CATALOG */}
            <main id="produk" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-[#E3DFD3] pb-4 sm:mb-10">
                    <h2 className="font-display text-2xl text-[#16191C] sm:text-3xl">
                        {searchTerm ? `Hasil untuk “${searchTerm}”` : 'Semua produk'}
                    </h2>
                    <span className="shrink-0 text-sm font-medium text-[#16191C]/45">
                        {filteredProducts.length} produk
                    </span>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-6 md:grid-cols-3 md:gap-x-8 xl:grid-cols-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div key={item}>
                                <div className="algshop-skeleton aspect-[4/5]" />
                                <div className="algshop-skeleton mt-4 h-3 w-2/5 rounded-full" />
                                <div className="algshop-skeleton mt-3 h-4 w-4/5 rounded-full" />
                                <div className="algshop-skeleton mt-4 h-6 w-1/3 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="border border-[#E3DFD3] bg-white px-6 py-24 text-center">
                        <p className="font-display text-2xl text-[#16191C]">
                            Tidak ada produk yang cocok
                        </p>
                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#16191C]/55">
                            {`Belum ada produk yang cocok dengan pencarian “${searchTerm}”. Coba kata kunci lain.`}
                        </p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-8 rounded-full bg-[#16191C] px-6 py-3 text-sm font-medium text-[#F5F2EA] transition-colors hover:bg-[#1E4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4034] focus-visible:ring-offset-2"
                        >
                            Lihat semua produk
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-6 md:grid-cols-3 md:gap-x-8 xl:grid-cols-4">
                        {filteredProducts.map((produk) => (
                            <article key={produk.id} className="group flex flex-col">
                                <Link
                                    to={`/produk/${produk.id}`}
                                    className="relative block aspect-[4/5] overflow-hidden bg-[#EDE9DF]"
                                >
                                    {getProductImage(produk) ? (
                                        <img
                                            src={`/storage/${getProductImage(produk)}`}
                                            alt={produk.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                        />
                                    ) : (
                                        <div className="font-display flex h-full items-center justify-center text-sm italic text-[#16191C]/30">
                                            Tanpa gambar
                                        </div>
                                    )}

                                    {Number(produk.discount_percent) > 0 && (
                                        <span className="absolute left-3 top-3 bg-[#A23E2E] px-2.5 py-1 text-[11px] font-semibold text-white">
                                            -{Math.round(Number(produk.discount_percent))}%
                                        </span>
                                    )}

                                    {produk.stock < 10 && (
                                        <span className="absolute right-3 top-3 border border-[#16191C]/10 bg-white/95 px-2.5 py-1 text-[11px] font-medium text-[#A23E2E]">
                                            Sisa {produk.stock}
                                        </span>
                                    )}
                                </Link>

                                <div className="mt-4 flex flex-1 flex-col">
                                    <p className="truncate text-xs font-medium text-[#16191C]/45">
                                        {produk.shop?.name || 'Official Store'}
                                    </p>

                                    <Link
                                        to={`/produk/${produk.id}`}
                                        className="font-display mt-1.5 line-clamp-2 min-h-[2.6em] text-[15px] leading-snug text-[#16191C] transition-colors group-hover:text-[#1E4034] sm:text-base"
                                    >
                                        {produk.name}
                                    </Link>

                                    <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
                                        <span className="font-display text-lg text-[#16191C] sm:text-xl">
                                            Rp{Number(produk.final_price ?? produk.price).toLocaleString('id-ID')}
                                        </span>
                                        {Number(produk.discount_percent) > 0 && (
                                            <span className="text-xs text-[#16191C]/40 line-through">
                                                Rp{Number(produk.price).toLocaleString('id-ID')}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 flex gap-2 pt-1">
                                        <button
                                            onClick={() => handleBuyNow(produk.id)}
                                            className="flex-1 bg-[#16191C] py-3.5 text-xs font-semibold text-[#F5F2EA] transition-colors hover:bg-[#1E4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4034] focus-visible:ring-offset-2"
                                        >
                                            Beli sekarang
                                        </button>

                                        <button
                                            onClick={() => handleAddToCart(produk.id)}
                                            title="Tambah ke Keranjang"
                                            aria-label={`Tambah ${produk.name} ke keranjang`}
                                            className="grid h-11 w-11 shrink-0 place-items-center border border-[#16191C]/15 text-[#16191C] transition-colors hover:border-[#16191C] hover:bg-[#16191C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4034] focus-visible:ring-offset-2"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-[16px] w-[16px] fill-none stroke-current stroke-2">
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
            <footer className="border-t border-[#E3DFD3]">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-10 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
                    <p className="font-display text-sm italic text-[#16191C]/60">
                        Shop better. Live better.
                    </p>
                    <p className="text-xs font-medium text-[#16191C]/40">
                        © {new Date().getFullYear()} Algshop. Seluruh hak cipta dilindungi.
                    </p>
                </div>
            </footer>

            {/* TOAST */}
            {toast && (
                <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 sm:left-auto sm:right-6 sm:w-auto sm:translate-x-0">
                    <div
                        className={`algshop-toast flex items-center gap-3 border px-4 py-3.5 shadow-lg ${
                            toast.type === 'error'
                                ? 'border-[#A23E2E]/40 bg-[#16191C] text-[#F3D9D2]'
                                : 'border-[#1E4034]/40 bg-[#16191C] text-[#D9EAE2]'
                        }`}
                    >
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-current/40">
                            {toast.type === 'error' ? (
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                                    <path d="M12 8v5M12 16h.01" />
                                    <circle cx="12" cy="12" r="9" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                                    <path d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </span>
                        <p className="text-sm font-medium">{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
