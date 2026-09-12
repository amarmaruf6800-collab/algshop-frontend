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
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">Your activity</p>
                    <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Riwayat Belanja</h1>
                    <p className="mt-2 text-sm text-slate-500">Semua transaksi dan detail pesanan Anda dalam satu tempat.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-[30px] border border-slate-200/70 bg-white px-6 py-20 text-center shadow-xl shadow-slate-200/30">
                        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-xl">◷</div>
                        <h2 className="text-xl font-black">Belum ada transaksi</h2>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Pesanan yang Anda lakukan akan muncul di sini.</p>
                        <Link to="/katalog" className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-xs font-extrabold text-white hover:bg-indigo-600">Mulai Belanja</Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <article key={order.id} className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-xl shadow-slate-200/30">
                                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">
                                    <div>
                                        <div className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Invoice · {order.invoice_number}</div>
                                        <h2 className="text-lg font-black">{order.shop?.name || 'Toko Tidak Diketahui'}</h2>
                                        <p className="mt-1 text-xs font-medium text-slate-400">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <span className={`w-fit rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${getStatusStyle(order.status)}`}>{order.status}</span>
                                </div>

                                <div className="space-y-3 px-5 py-5 sm:px-7">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50/70 p-3.5 text-sm">
                                            <div className="min-w-0"><span className="mr-2 font-black text-slate-900">{item.quantity}×</span><span className="font-semibold text-slate-600">{item.product?.name || 'Produk Dihapus'}</span></div>
                                            <span className="shrink-0 font-black text-slate-900">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-5 sm:px-7">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Belanja</span>
                                    <strong className="text-xl font-black tracking-tight text-slate-950">Rp{Number(order.total_price).toLocaleString('id-ID')}</strong>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
