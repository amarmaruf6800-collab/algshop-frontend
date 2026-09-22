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
    const featuredProduct = products[0];

    return (
        <div className="min-h-screen overflow-x-hidden bg-paper font-body text-ink selection:bg-forest selection:text-paper">
            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-hairline bg-paper/95 backdrop-blur-sm">
                <div className="mx-auto flex min-h-[80px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-baseline gap-2.5">
                        <span className="font-display text-2xl italic tracking-tight text-ink">
                            Algshop
                        </span>
                        <span className="hidden text-[11px] text-taupe sm:inline">
                            Marketplace kurasi
                        </span>
                    </Link>

                    <div className="flex items-center gap-1 sm:gap-2">
                        {user ? (
                            <>
                                <span className="mr-2 hidden text-sm text-taupe md:inline">
                                    Halo, <span className="font-medium text-ink">{user.name}</span>
                                </span>

                                <div className="hidden items-center gap-1 lg:flex">
                                    <Link to="/manajemen-produk" className="rounded-md px-3 py-2 text-sm text-taupe transition hover:text-ink">
                                        Dashboard
                                    </Link>
                                    <Link to="/pesanan-masuk" className="rounded-md px-3 py-2 text-sm text-taupe transition hover:text-ink">
                                        Pesanan
                                    </Link>
                                    <Link to="/riwayat-belanja" className="rounded-md px-3 py-2 text-sm text-taupe transition hover:text-ink">
                                        Riwayat
                                    </Link>
                                </div>

                                <Link
                                    to="/keranjang"
                                    className="flex h-10 items-center gap-2 rounded-md border border-ink bg-ink px-4 text-sm font-medium text-paper transition hover:border-forest hover:bg-forest"
                                >
                                    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none stroke-current" strokeWidth="1.6">
                                        <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="10" cy="20" r="1" />
                                        <circle cx="18" cy="20" r="1" />
                                    </svg>
                                    <span className="hidden sm:inline">Keranjang</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="hidden h-10 rounded-md border border-hairline px-4 text-sm text-taupe transition hover:border-ink hover:text-ink sm:block"
                                >
                                    Keluar
                                </button>

                                <button
                                    onClick={() => setMobileMenuOpen((open) => !open)}
                                    className="grid h-10 w-10 place-items-center rounded-md border border-hairline text-ink transition hover:border-ink lg:hidden"
                                    aria-label="Buka menu"
                                    aria-expanded={mobileMenuOpen}
                                >
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.6">
                                        {mobileMenuOpen ? (
                                            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                                        ) : (
                                            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                                        )}
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-forest"
                            >
                                Masuk / Daftar
                            </button>
                        )}
                    </div>
                </div>

                {user && mobileMenuOpen && (
                    <div className="border-t border-hairline bg-paper px-4 py-3 lg:hidden">
                        <div className="mx-auto grid max-w-7xl gap-1">
                            <Link
                                to="/manajemen-produk"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-md px-3 py-2.5 text-sm text-taupe transition hover:text-ink"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/pesanan-masuk"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-md px-3 py-2.5 text-sm text-taupe transition hover:text-ink"
                            >
                                Pesanan masuk
                            </Link>
                            <Link
                                to="/riwayat-belanja"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-md px-3 py-2.5 text-sm text-taupe transition hover:text-ink"
                            >
                                Riwayat belanja
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="rounded-md px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO */}
            <header className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                    <div>
                        <h1 className="max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                            Belanja yang dikurasi dengan cermat, untuk hidup sehari-hari yang lebih baik.
                        </h1>

                        <p className="mt-6 max-w-md text-[15px] leading-7 text-taupe">
                            {totalProducts > 0
                                ? `${totalProducts} produk pilihan dari berbagai toko terpercaya, siap dikirim ke seluruh Indonesia.`
                                : 'Produk pilihan dari berbagai toko terpercaya, siap dikirim ke seluruh Indonesia.'}
                        </p>

                        <div className="mt-8 max-w-md">
                            <div className="flex items-center gap-3 border-b-2 border-hairline pb-3 transition-colors focus-within:border-ink">
                                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-current text-taupe" strokeWidth="1.6">
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m20 20-4-4" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cari produk favoritmu..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-taupe/70"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="shrink-0 text-taupe transition hover:text-ink"
                                        aria-label="Hapus pencarian"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>

                        <a
                            href="#produk"
                            className="mt-8 inline-flex items-center gap-2 rounded-md border border-ink px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
                        >
                            Jelajahi koleksi
                        </a>
                    </div>

                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-hairline bg-surface lg:aspect-[3/4]">
                        {featuredProduct && getProductImage(featuredProduct) ? (
                            <>
                                <img
                                    src={`/storage/${getProductImage(featuredProduct)}`}
                                    alt={featuredProduct.name}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent p-6 pt-16">
                                    <p className="text-[11px] text-paper/70">Pilihan editor</p>
                                    <p className="mt-1 line-clamp-1 font-display text-lg text-paper">
                                        {featuredProduct.name}
                                    </p>
                                    <p className="mt-1 font-display text-xl text-paper">
                                        Rp{Number(featuredProduct.final_price ?? featuredProduct.price).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-3 text-taupe">
                                <svg viewBox="0 0 24 24" className="h-10 w-10 fill-none stroke-current" strokeWidth="1.2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <path d="m3 16 5-5 4 4 5-6 4 5" />
                                </svg>
                                <p className="text-sm">Koleksi pilihan akan tampil di sini</p>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* PRODUCT CATALOG */}
            <main id="produk" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-2 border-b border-hairline pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm text-taupe">Katalog produk</p>
                        <h2 className="mt-1 font-display text-2xl text-ink sm:text-3xl">
                            Pilihan untukmu
                        </h2>
                    </div>

                    {searchTerm && (
                        <p className="text-sm text-taupe">
                            {filteredProducts.length} hasil untuk &ldquo;{searchTerm}&rdquo;
                        </p>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="overflow-hidden rounded-lg border border-hairline">
                                <div className="aspect-[4/5] animate-pulse bg-hairline/50" />
                                <div className="space-y-4 p-5">
                                    <div className="h-3 w-24 animate-pulse rounded-full bg-hairline/60" />
                                    <div className="h-5 w-4/5 animate-pulse rounded-full bg-hairline/60" />
                                    <div className="h-6 w-2/5 animate-pulse rounded-full bg-hairline/60" />
                                    <div className="h-10 w-full animate-pulse rounded-md bg-hairline/60" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="border border-hairline px-6 py-20 text-center">
                        <svg viewBox="0 0 24 24" className="mx-auto mb-5 h-10 w-10 fill-none stroke-current text-taupe" strokeWidth="1.2">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4" strokeLinecap="round" />
                        </svg>
                        <h2 className="font-display text-2xl text-ink">
                            Produk tidak ditemukan
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-taupe">
                            {`Belum ada produk yang cocok dengan pencarian "${searchTerm}". Coba gunakan kata kunci lain.`}
                        </p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-6 rounded-md border border-ink px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
                        >
                            Lihat semua produk
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {filteredProducts.map((produk) => (
                            <article key={produk.id} className="group flex min-w-0 flex-col">
                                {/* Image */}
                                <Link
                                    to={`/produk/${produk.id}`}
                                    className="relative block aspect-[4/5] overflow-hidden rounded-lg border border-hairline bg-surface"
                                >
                                    {getProductImage(produk) ? (
                                        <img
                                            src={`/storage/${getProductImage(produk)}`}
                                            alt={produk.name}
                                            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-hairline/30 text-sm text-taupe">
                                            Gambar belum tersedia
                                        </div>
                                    )}

                                    {produk.stock < 10 && (
                                        <span className="absolute left-3 top-3 border border-hairline bg-paper/95 px-2.5 py-1 text-[11px] text-brass">
                                            Sisa {produk.stock}
                                        </span>
                                    )}

                                    {Number(produk.discount_percent) > 0 && (
                                        <span className="absolute right-3 top-3 bg-forest px-2.5 py-1 text-[11px] font-medium text-paper">
                                            -{produk.discount_percent}%
                                        </span>
                                    )}
                                </Link>

                                {/* Details */}
                                <div className="mt-4 flex flex-1 flex-col">
                                    <div className="mb-2 flex items-center gap-1.5 text-taupe">
                                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-none stroke-current" strokeWidth="1.6">
                                            <path d="M4 9V21h16V9" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 9l2-5h16l2 5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="truncate text-[12px]">
                                            {produk.shop?.name || 'Official Store'}
                                        </p>
                                    </div>

                                    <Link
                                        to={`/produk/${produk.id}`}
                                        className="line-clamp-2 min-h-[52px] font-display text-lg leading-snug text-ink transition-colors group-hover:text-forest"
                                    >
                                        {produk.name}
                                    </Link>

                                    <div className="mt-3 flex items-baseline gap-2">
                                        {Number(produk.discount_percent) > 0 && (
                                            <span className="text-sm text-taupe line-through">
                                                Rp{Number(produk.price).toLocaleString('id-ID')}
                                            </span>
                                        )}
                                        <span className="font-display text-xl text-ink">
                                            Rp{Number(produk.final_price ?? produk.price).toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    <div className="mt-5 flex gap-2">
                                        <button
                                            onClick={() => handleBuyNow(produk.id)}
                                            className="flex-1 rounded-md bg-ink py-3 text-sm font-medium text-paper transition hover:bg-forest"
                                        >
                                            Beli sekarang
                                        </button>

                                        <button
                                            onClick={() => handleAddToCart(produk.id)}
                                            title="Tambah ke Keranjang"
                                            aria-label={`Tambah ${produk.name} ke keranjang`}
                                            className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-md border border-hairline text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none stroke-current" strokeWidth="1.6">
                                                <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
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
            <footer className="border-t border-hairline">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-10 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">
                    <p className="font-display text-sm italic text-ink">Algshop</p>
                    <p className="text-sm text-taupe">
                        © {new Date().getFullYear()} Algshop. Seluruh hak cipta dilindungi.
                    </p>
                </div>
            </footer>

            {/* TOAST */}
            {toast && (
                <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-md -translate-x-1/2 sm:left-auto sm:right-5 sm:w-auto sm:translate-x-0">
                    <div className={`flex items-center gap-3 border px-4 py-3.5 shadow-lg ${toast.type === 'error'
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : 'border-forest/20 bg-forest/5 text-forest'
                        }`}>
                        <span className="text-sm">{toast.type === 'error' ? '!' : '✓'}</span>
                        <p className="text-sm">{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
