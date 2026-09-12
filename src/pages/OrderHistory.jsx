import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/riwayat-belanja');
                setOrders(response.data.data);
            } catch (error) {
                console.error('Gagal memuat riwayat belanja', error);
                if (error.response?.status === 401) navigate('/login');
            }
        };
        fetchHistory();
    }, [navigate]);

    const getStatusStyle = (status) => ({
        pending: 'bg-amber-50 text-amber-700 border-amber-100',
        paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        sent: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        failed: 'bg-red-50 text-red-700 border-red-100'
    }[status] || 'bg-slate-100 text-slate-600 border-slate-200');

    const getStatusLabel = (status) => ({
        pending: 'Menunggu pembayaran',
        paid: 'Sudah dibayar',
        sent: 'Dikirim',
        failed: 'Gagal'
    }[status] || status);

    const totalOrders = orders.length;
    const paidOrders = orders.filter((order) => order.status === 'paid' || order.status === 'sent').length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);

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
                            <div className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:block">Order history</div>
                        </div>
                    </Link>
                    <Link to="/katalog" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600">← Katalog</Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-9">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Your activity</p>
                    <div className="mt-2 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-4xl font-black tracking-[-0.055em] sm:text-5xl">Riwayat Belanja</h1>
                            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">Semua transaksi dan detail pesanan Anda dalam satu ruang yang rapi.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-sm"><p className="text-lg font-black">{totalOrders}</p><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Order</p></div>
                            <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-sm"><p className="text-lg font-black text-emerald-600">{paidOrders}</p><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Selesai</p></div>
                            <div className="rounded-2xl border border-white bg-slate-950 px-4 py-3 text-white shadow-lg"><p className="max-w-[110px] truncate text-sm font-black">Rp{totalSpent.toLocaleString('id-ID')}</p><p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Total</p></div>
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-[34px] border border-white bg-white px-6 py-24 text-center shadow-xl shadow-slate-200/30">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-950 text-white shadow-xl">◷</div>
                        <p className="mt-5 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">Your activity</p>
                        <h2 className="mt-2 text-2xl font-black">Belum ada transaksi</h2>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">Pesanan yang Anda lakukan akan muncul di sini.</p>
                        <Link to="/katalog" className="mt-7 inline-flex rounded-2xl bg-slate-950 px-5 py-3.5 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-indigo-600">Mulai Belanja →</Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <article key={order.id} className="overflow-hidden rounded-[32px] border border-white bg-white shadow-xl shadow-slate-200/30">
                                <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
                                    <div>
                                        <div className="inline-flex rounded-full bg-slate-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Invoice · {order.invoice_number}</div>
                                        <h2 className="mt-4 text-xl font-black tracking-tight">{order.shop?.name || 'Toko Tidak Diketahui'}</h2>
                                        <p className="mt-1 text-xs font-medium text-slate-400">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <span className={`w-fit rounded-full border px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] ${getStatusStyle(order.status)}`}>{getStatusLabel(order.status)}</span>
                                </div>

                                <div className="space-y-2 px-6 py-6 sm:px-7">
                                    <p className="mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">Items</p>
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50/80 p-4 text-sm">
                                            <div className="min-w-0"><span className="mr-2 font-black text-indigo-600">{item.quantity}×</span><span className="font-semibold text-slate-600">{item.product?.name || 'Produk Dihapus'}</span></div>
                                            <span className="shrink-0 font-black text-slate-900">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                                    <div><span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">Total Belanja</span><p className="mt-1 text-xs font-medium text-slate-400">Invoice {order.invoice_number}</p></div>
                                    <strong className="text-2xl font-black tracking-tight text-slate-950">Rp{Number(order.total_price).toLocaleString('id-ID')}</strong>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}