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
            <div className="min-h-screen bg-[#f7f8fc] px-4 py-10 font-sans">
                <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
                    <div className="w-full rounded-[30px] border border-slate-200/70 bg-white p-8 text-center shadow-2xl shadow-slate-200/40">
                        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-xl">✓</div>
                        <h3 className="text-xl font-black">Tidak ada tagihan aktif.</h3>
                        <button onClick={() => navigate('/katalog')} className="mt-6 rounded-2xl bg-slate-950 px-6 py-3 text-xs font-extrabold text-white hover:bg-indigo-600">Kembali ke Katalog</button>
                    </div>
                </div>
            </div>
        );
    }

    const handlePay = async () => {
        setLoading(true);
        try {
            const response = await api.post('/bayar-simulasi', { invoice_number: invoiceData.invoice_number });
            alert(response.data.message);
            navigate('/katalog');
        } catch (error) {
            alert(error.response?.data?.message || 'Pembayaran gagal diproses.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] px-4 py-10 font-sans text-slate-900">
            <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[520px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-100/70 blur-3xl" />
            <div className="relative mx-auto flex min-h-[85vh] max-w-lg items-center justify-center">
                <div className="w-full overflow-hidden rounded-[34px] border border-white bg-white/90 shadow-2xl shadow-slate-300/40 backdrop-blur-xl">
                    <div className="bg-slate-950 px-7 py-8 text-white sm:px-10">
                        <Link to="/keranjang" className="text-xs font-bold text-slate-400 hover:text-white">← Kembali ke keranjang</Link>
                        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Secure checkout</p>
                        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">Selesaikan Pembayaran</h1>
                        <p className="mt-2 text-sm text-slate-400">Selesaikan simulasi pembayaran untuk memproses pesanan Anda.</p>
                    </div>

                    <div className="p-7 sm:p-10">
                        <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Invoice</span>
                            <span className="text-xs font-black text-slate-700">{invoiceData.invoice_number}</span>
                        </div>

                        <div className="rounded-[26px] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-7 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Total Tagihan</p>
                            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">
                                Rp{Number(invoiceData.grand_total).toLocaleString('id-ID')}
                            </h2>
                        </div>

                        <button
                            onClick={handlePay}
                            disabled={loading}
                            className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-slate-950 text-sm font-extrabold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Memproses pembayaran...' : 'Bayar Tagihan Sekarang'}
                        </button>

                        <p className="mt-4 text-center text-[10px] font-semibold text-slate-400">Pembayaran simulasi · Aman untuk pengujian aplikasi</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
