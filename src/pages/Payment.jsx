import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const invoiceData = location.state?.invoiceData;
    const [loading, setLoading] = useState(false);

    if (!invoiceData) {
        return (
            <div className="min-h-screen bg-[#f6f7fb] px-4 py-10 font-sans text-slate-900">
                <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
                    <div className="w-full rounded-[34px] border border-white bg-white p-8 text-center shadow-2xl shadow-slate-200/40">
                        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-slate-950 text-xl font-black text-white">✓</div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">Algshop</p>
                        <h3 className="mt-2 text-2xl font-black tracking-tight">Tidak ada tagihan aktif</h3>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">Silakan kembali ke katalog untuk melanjutkan belanja.</p>
                        <button onClick={() => navigate('/katalog')} className="mt-7 rounded-2xl bg-slate-950 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-600">Kembali ke Katalog →</button>
                    </div>
                </div>
            </div>
        );
    }

    const total = Number(invoiceData.grand_total || 0);

    const handlePay = async () => {
        setLoading(true);
        try {
            const response = await api.post('/bayar-simulasi', { invoice_number: invoiceData.invoice_number });
            alert(response.data.message);
            navigate('/riwayat-belanja');
        } catch (error) {
            alert(error.response?.data?.message || 'Pembayaran gagal diproses.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f6f7fb] px-4 py-8 font-sans text-slate-900 sm:px-6 sm:py-12">
            <div className="pointer-events-none absolute left-1/2 top-[-240px] h-[600px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-100/70 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-220px] left-[-150px] h-[420px] w-[420px] rounded-full bg-violet-100/50 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
                <div className="mb-5 flex items-center justify-between">
                    <Link to="/konfirmasi-pesanan" className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600">← Kembali</Link>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Secure checkout</span>
                </div>

                <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-2xl shadow-slate-300/40">
                    <div className="relative overflow-hidden bg-slate-950 px-7 py-9 text-white sm:px-10">
                        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">Algshop payment</p>
                                <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Selesaikan Pembayaran</h1>
                            </div>
                            <div className="hidden h-12 w-12 place-items-center rounded-2xl bg-white/10 text-lg font-black sm:grid">A</div>
                        </div>
                        <div className="relative mt-7 flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.7)]" />
                            <p className="text-xs font-bold text-slate-400">Pesanan siap diproses</p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-9">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-start justify-between gap-5">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">Invoice</p>
                                    <p className="mt-2 break-all text-sm font-black text-slate-800">{invoiceData.invoice_number}</p>
                                </div>
                                <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-amber-600">Unpaid</span>
                            </div>
                        </div>

                        <div className="mt-5 rounded-[30px] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-7 text-center sm:p-10">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Total Tagihan</p>
                            <h2 className="mt-3 break-words text-4xl font-black tracking-[-0.055em] text-slate-950 sm:text-5xl">Rp{total.toLocaleString('id-ID')}</h2>
                            <div className="mx-auto mt-5 h-px max-w-xs bg-slate-200" />
                            <p className="mt-4 text-xs font-semibold text-slate-400">Pembayaran simulasi untuk pengujian aplikasi</p>
                        </div>

                        <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
                            <div className="flex gap-3">
                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-100 text-sm font-black text-indigo-600">i</div>
                                <div>
                                    <p className="text-xs font-black text-indigo-900">Pembayaran Simulasi</p>
                                    <p className="mt-1 text-[11px] font-medium leading-relaxed text-indigo-700">Tidak ada transaksi uang sungguhan. Tombol di bawah hanya mengubah status pesanan menjadi paid untuk kebutuhan pengujian aplikasi.</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={handlePay} disabled={loading} className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-slate-950 text-sm font-extrabold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60">
                            {loading ? (
                                <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Memproses pembayaran...</span>
                            ) : 'Bayar Tagihan Sekarang →'}
                        </button>

                        <p className="mt-4 text-center text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Aman untuk pengujian aplikasi</p>
                    </div>
                </div>

                <p className="mt-6 text-center text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Algshop · Secure Checkout</p>
            </div>
        </div>
    );
}