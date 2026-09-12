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
                navigate('/buka-toko');
            }
        }
    };

    useEffect(() => {
        fetchIncomingOrders();
    }, [navigate]);

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

    const paidCount = orders.filter((order) => order.status === 'paid').length;
    const sentCount = orders.filter((order) => order.status === 'sent').length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f6f7fb] font-sans text-slate-900">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-[-260px] h-[600px] w-[850px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />
                <div className="absolute bottom-[-180px] left-[-120px] h-[420px] w-[420px] rounded-full bg-violet-100/40 blur-3xl" />
            </div>

            <header className="sticky top-0 z-40 border-b border-white/80 bg-white/80 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-2xl">
                <div className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/katalog" className="group flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-[15px] bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition group-hover:-rotate-3">
                            A
                        </div>
                        <div>
                            <div className="text-xl font-black tracking-[-0.04em]">Algshop<span className="text-indigo-500">.</span></div>
                            <div className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:block">Seller dashboard</div>
                        </div>
                    </Link>
                    <Link to="/katalog" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600">
                        ← Katalog
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-9">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Seller dashboard</p>
                    <div className="mt-2 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-4xl font-black tracking-[-0.055em] sm:text-5xl">Pesanan Masuk</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                                Pantau pembayaran pelanggan dan proses pesanan toko Anda dari satu tempat.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-sm">
                                <p className="text-lg font-black">{orders.length}</p>
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Order</p>
                            </div>
                            <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-sm">
                                <p className="text-lg font-black text-emerald-600">{paidCount}</p>
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Paid</p>
                            </div>
                            <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-sm">
                                <p className="text-lg font-black text-indigo-600">{sentCount}</p>
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Sent</p>
                            </div>
                            <div className="col-span-2 rounded-2xl border border-white bg-slate-950 px-4 py-3 text-white shadow-lg sm:col-span-1">
                                <p className="truncate text-sm font-black">Rp{totalRevenue.toLocaleString('id-ID')}</p>
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Gross value</p>
                            </div>
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-[32px] border border-white bg-white px-6 py-24 text-center shadow-xl shadow-slate-200/30">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-950 text-xl text-white shadow-xl shadow-slate-900/15">▣</div>
                        <p className="mt-5 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">Order center</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight">Belum ada pesanan</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                            Pesanan yang masuk ke toko Anda akan muncul di sini.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <article
                                key={order.id}
                                className={`relative overflow-hidden rounded-[30px] border bg-white shadow-xl shadow-slate-200/30 transition hover:-translate-y-0.5 hover:shadow-2xl ${order.status === 'paid' ? 'border-indigo-200' : 'border-white'}`}
                            >
                                {order.status === 'paid' && <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500" />}

                                <div className="flex flex-col gap-5 border-b border-slate-100 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
                                    <div>
                                        <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                                            Invoice · {order.invoice_number}
                                        </span>
                                        <h2 className="mt-4 text-xl font-black tracking-tight">
                                            {order.user?.name || 'User'}
                                        </h2>
                                        <p className="mt-1 text-xs font-medium text-slate-400">
                                            {new Date(order.created_at).toLocaleString('id-ID')}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-start gap-3 sm:items-end">
                                        <span className={`rounded-full border px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] ${statusStyle(order.status)}`}>
                                            {order.status}
                                        </span>

                                        {order.status === 'paid' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order.id, 'sent')}
                                                className="rounded-2xl bg-slate-950 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-indigo-600"
                                            >
                                                Kirim Barang →
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 sm:p-7">
                                    <p className="mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                                        Daftar Barang
                                    </p>

                                    <div className="space-y-2">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                                                <span className="font-semibold text-slate-600">
                                                    {item.product?.name}
                                                    <strong className="ml-1 text-slate-900">×{item.quantity}</strong>
                                                </span>
                                                <span className="shrink-0 font-black text-slate-900">
                                                    Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
                                        <div className="rounded-2xl border border-slate-100 bg-white p-4">
                                            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">Customer</p>
                                            <p className="mt-1 text-sm font-black text-slate-800">{order.user?.name || 'User'}</p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-950 p-4 text-white md:min-w-[250px]">
                                            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">Total pesanan</p>
                                            <p className="mt-1 text-xl font-black">Rp{Number(order.total_price).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
