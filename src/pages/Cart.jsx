import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const getProductImage = (product) => product?.images?.[0]?.path || product?.image;

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

    useEffect(() => { fetchCart(); }, []);

    const handleRemoveItem = async (itemId) => {
        try {
            await api.delete(`/keranjang/${itemId}`);
            fetchCart();
        } catch (error) {
            alert('Gagal menghapus produk dari keranjang.');
        }
    };

    const handleCheckout = () => {
        navigate('/konfirmasi-pesanan');
    };

    const grandTotal = carts.reduce((total, item) => total + (Number(item.product.final_price ?? item.product.price) * item.quantity), 0);
    const totalItems = carts.reduce((total, item) => total + Number(item.quantity), 0);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f6f7fb] font-sans text-slate-900">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-[-260px] h-[600px] w-[850px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />
                <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-100/50 blur-3xl" />
            </div>

            <header className="sticky top-0 z-40 border-b border-white/80 bg-white/80 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-2xl">
                <div className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/katalog" className="group flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-[15px] bg-slate-950 text-sm font-black text-white shadow-lg transition group-hover:-rotate-3">A</div>
                        <div>
                            <div className="text-xl font-black tracking-[-0.04em]">Algshop<span className="text-indigo-500">.</span></div>
                            <div className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:block">Shopping bag</div>
                        </div>
                    </Link>
                    <Link to="/katalog" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600">← Katalog</Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-9">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Your bag</p>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-4xl font-black tracking-[-0.055em] sm:text-5xl">Keranjang Belanja</h1>
                            <p className="mt-3 text-sm leading-6 text-slate-500">{totalItems} item siap untuk checkout.</p>
                        </div>
                        {carts.length > 0 && <span className="w-fit rounded-full bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm">{carts.length} produk</span>}
                    </div>
                </div>

                {carts.length === 0 ? (
                    <div className="rounded-[34px] border border-white bg-white px-6 py-24 text-center shadow-xl shadow-slate-200/30">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-950 text-white shadow-xl">🛒</div>
                        <p className="mt-5 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">Your bag</p>
                        <h2 className="mt-2 text-2xl font-black">Keranjang masih kosong</h2>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">Yuk temukan produk yang kamu suka di katalog Algshop.</p>
                        <button onClick={() => navigate('/katalog')} className="mt-7 rounded-2xl bg-slate-950 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-600">Mulai Belanja →</button>
                    </div>
                ) : (
                    <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
                        <section className="overflow-hidden rounded-[32px] border border-white bg-white shadow-xl shadow-slate-200/30">
                            {carts.map((item, index) => (
                                <div key={item.id} className={`relative flex gap-4 p-5 sm:p-6 ${index !== carts.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                    <button onClick={() => handleRemoveItem(item.id)} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-300 transition hover:bg-red-50 hover:text-red-500" title="Hapus dari keranjang">
                                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>

                                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-28 sm:w-28">
                                        {getProductImage(item.product) ? <img src={`/storage/${getProductImage(item.product)}`} alt={item.product.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" /> : <div className="grid h-full place-items-center text-[9px] font-black uppercase text-slate-400">No img</div>}
                                    </div>

                                    <div className="min-w-0 flex-1 pr-8">
                                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-500">{item.product.shop.name}</p>
                                        <h2 className="mt-1 line-clamp-2 text-base font-black text-slate-900">{item.product.name}</h2>
                                        <p className="mt-3 text-xs font-semibold text-slate-400">{item.quantity} × Rp{Number(item.product.final_price ?? item.product.price).toLocaleString('id-ID')} {Number(item.product.discount_percent) > 0 && <span className="ml-1 font-black text-red-500">-{Number(item.product.discount_percent)}%</span>}</p>
                                        <strong className="mt-2 block text-base font-black text-slate-950 sm:hidden">Rp{(Number(item.product.final_price ?? item.product.price) * item.quantity).toLocaleString('id-ID')}</strong>
                                    </div>
                                    <strong className="hidden self-end text-base font-black text-slate-950 sm:block">Rp{(Number(item.product.final_price ?? item.product.price) * item.quantity).toLocaleString('id-ID')}</strong>
                                </div>
                            ))}
                        </section>

                        <aside className="overflow-hidden rounded-[32px] bg-slate-950 text-white shadow-2xl shadow-slate-300/30 lg:sticky lg:top-24">
                            <div className="p-6 sm:p-7">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">Order summary</p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight">Ringkasan Pesanan</h2>
                                <div className="my-7 h-px bg-white/10" />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Total produk</span>
                                    <span className="font-bold">{totalItems} item</span>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span className="font-bold">Rp{grandTotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="my-6 h-px bg-white/10" />
                                <div className="flex items-end justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total</span>
                                    <strong className="text-2xl font-black tracking-tight">Rp{grandTotal.toLocaleString('id-ID')}</strong>
                                </div>
                                <button onClick={handleCheckout} disabled={loading} className="mt-7 w-full rounded-2xl bg-white py-4 text-sm font-extrabold text-slate-950 transition hover:-translate-y-0.5 hover:bg-indigo-400 hover:text-white disabled:opacity-60">
                                    {loading ? 'Memproses...' : 'Checkout Sekarang →'}
                                </button>
                                <p className="mt-4 text-center text-[9px] font-bold uppercase tracking-wider text-slate-500">Secure checkout · Algshop</p>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}