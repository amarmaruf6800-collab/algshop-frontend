import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Cart() {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const response = await api.get('/keranjang');
            setCarts(response.data.data);
        } catch (error) {
            console.error('Gagal memuat keranjang', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // FUNGSI BARU: Hapus item dari keranjang
    const handleRemoveItem = async (itemId) => {
        try {
            await api.delete(`/keranjang/${itemId}`);
            // Refresh keranjang setelah berhasil dihapus
            fetchCart();
        } catch (error) {
            alert('Gagal menghapus produk dari keranjang.');
        }
    };

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await api.post('/checkout-keranjang');
            alert(response.data.message);
            navigate('/pembayaran', { state: { invoiceData: response.data.data } });
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal melakukan checkout');
        } finally {
            setLoading(false);
        }
    };

    const grandTotal = carts.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-[#f7f8fc] font-sans text-slate-900">
            <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-2xl">
                <div className="mx-auto flex min-h-[76px] max-w-5xl items-center justify-between px-4 sm:px-6">
                    <Link to="/katalog" className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">A</div>
                        <span className="text-xl font-black tracking-tight">Algshop<span className="text-indigo-500">.</span></span>
                    </Link>
                    <Link to="/katalog" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-50">← Katalog</Link>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                <div className="mb-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">Your bag</p>
                    <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Keranjang Belanja</h1>
                    <p className="mt-2 text-sm text-slate-500">{carts.length} item siap untuk checkout.</p>
                </div>

                {carts.length === 0 ? (
                    <div className="rounded-[30px] border border-slate-200/70 bg-white px-6 py-20 text-center shadow-xl shadow-slate-200/30">
                        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-slate-100">
                            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-slate-500 stroke-2"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
                        </div>
                        <h2 className="text-xl font-black">Keranjang masih kosong</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-400">Yuk temukan produk yang kamu suka.</p>
                        <button onClick={() => navigate('/katalog')} className="mt-6 rounded-2xl bg-slate-950 px-6 py-3 text-xs font-extrabold text-white hover:bg-indigo-600">Mulai Belanja</button>
                    </div>
                ) : (
                    <div className="grid gap-5 lg:grid-cols-[1fr_330px] lg:items-start">
                        <section className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white shadow-xl shadow-slate-200/30">
                            {carts.map((item, index) => (
                                <div key={item.id} className={`flex gap-4 p-5 sm:p-6 relative ${index !== carts.length - 1 ? 'border-b border-slate-100' : ''}`}>

                                    {/* Tombol Hapus (Silang) di Pojok Kanan Atas item */}
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                                        title="Hapus dari keranjang"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>

                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-24">
                                        {item.product.image ? <img src={`/storage/${item.product.image}`} alt={item.product.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-[9px] font-black uppercase text-slate-400">No img</div>}
                                    </div>
                                    <div className="min-w-0 flex-1 pr-8">
                                        <h2 className="line-clamp-2 text-sm font-black text-slate-900 sm:text-base">{item.product.name}</h2>
                                        <p className="mt-1 truncate text-xs font-semibold text-slate-400">{item.product.shop.name}</p>
                                        <p className="mt-4 text-xs text-slate-500">{item.quantity} × Rp{Number(item.product.price).toLocaleString('id-ID')}</p>
                                    </div>
                                    <strong className="self-end text-sm font-black text-slate-950 sm:text-base">Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}</strong>
                                </div>
                            ))}
                        </section>

                        <aside className="rounded-[30px] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/30 lg:sticky lg:top-24">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-300">Order summary</p>
                            <h2 className="mt-2 text-xl font-black">Ringkasan Pesanan</h2>
                            <div className="my-6 h-px bg-white/10" />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="font-bold">Rp{grandTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="mt-4 flex items-end justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total</span>
                                <strong className="text-2xl font-black tracking-tight">Rp{grandTotal.toLocaleString('id-ID')}</strong>
                            </div>
                            <button onClick={handleCheckout} disabled={loading} className="mt-7 w-full rounded-2xl bg-white py-4 text-sm font-extrabold text-slate-950 transition hover:bg-indigo-400 hover:text-white disabled:opacity-60">
                                {loading ? 'Memproses...' : 'Checkout Sekarang'}
                            </button>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}