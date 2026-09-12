import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function SellerDashboard() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const fetchIncomingOrders = async () => {
        try {
            const response = await api.get('/pesanan-masuk');
            setOrders(response.data.data);
        } catch (error) {
            console.error('Gagal memuat pesanan masuk', error);
            if (error.response?.status === 403) {
                navigate('/buka-toko'); // Ganti alert dan navigasi lama dengan ini
            }
        }
    };

    useEffect(() => { fetchIncomingOrders(); }, [navigate]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const response = await api.put(`/pesanan/${orderId}/status`, { status: newStatus });
            alert(response.data.message);
            fetchIncomingOrders();
        } catch (error) {
            alert('Gagal memperbarui status pesanan.');
        }
    };

    const statusStyle = (status) => {
        if (status === 'paid') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        if (status === 'sent') return 'bg-indigo-50 text-indigo-700 border-indigo-100';
        return 'bg-slate-100 text-slate-600 border-slate-200';
    };

    return (
        <div className="min-h-screen bg-[#f7f8fc] font-sans text-slate-900">
            <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-2xl">
                <div className="mx-auto flex min-h-[76px] max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link to="/katalog" className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">A</div>
                        <span className="text-xl font-black tracking-tight">Algshop<span className="text-indigo-500">.</span></span>
                    </Link>
                    <Link to="/katalog" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-50">← Katalog</Link>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div className="mb-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">Seller dashboard</p>
                    <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Pesanan Masuk</h1>
                    <p className="mt-2 text-sm text-slate-500">Pantau pembayaran dan proses pesanan dari pelanggan.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-[30px] border border-slate-200/70 bg-white px-6 py-20 text-center shadow-xl shadow-slate-200/30">
                        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-xl">▣</div>
                        <h2 className="text-xl font-black">Belum ada pesanan</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-400">Pesanan yang masuk ke toko Anda akan muncul di sini.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {orders.map(order => (
                            <article key={order.id} className={`relative overflow-hidden rounded-[28px] border bg-white p-5 shadow-xl shadow-slate-200/30 sm:p-7 ${order.status === 'paid' ? 'border-indigo-200' : 'border-slate-200/70'}`}>
                                {order.status === 'paid' && <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500" />}

                                <div className="flex flex-col gap-5 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Invoice · {order.invoice_number}</span>
                                        <h2 className="mt-2 text-lg font-black">Pembeli: {order.user?.name || 'User'}</h2>
                                        <p className="mt-1 text-xs font-medium text-slate-400">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex flex-col items-start gap-3 sm:items-end">
                                        <span className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${statusStyle(order.status)}`}>{order.status}</span>
                                        {order.status === 'paid' && (
                                            <button onClick={() => handleUpdateStatus(order.id, 'sent')} className="rounded-2xl bg-slate-950 px-5 py-3 text-xs font-extrabold text-white shadow-lg transition hover:bg-indigo-600">
                                                Kirim Barang
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="py-5">
                                    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Daftar Barang</p>
                                    <div className="space-y-2">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex justify-between gap-4 rounded-2xl bg-slate-50 p-3.5 text-sm">
                                                <span className="font-semibold text-slate-600">{item.product?.name} <strong className="text-slate-900">×{item.quantity}</strong></span>
                                                <span className="shrink-0 font-black text-slate-900">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 rounded-2xl bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pendapatan Bersih</span>
                                    <strong className="text-2xl font-black">Rp{Number(order.total_price).toLocaleString('id-ID')}</strong>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
