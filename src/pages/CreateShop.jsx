import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function CreateShop() {
    const [shopName, setShopName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateShop = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/buka-toko', { name: shopName });
            alert(response.data.message);
            // Setelah toko dibuat, arahkan langsung ke Dashboard Penjual
            navigate('/manajemen-produk');
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal membuat toko.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] font-sans text-slate-900">
            {/* Ambient Background */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-20 h-[460px] w-[460px] rounded-full bg-violet-200/40 blur-3xl" />

            <header className="absolute top-0 z-40 w-full p-6">
                <Link to="/katalog" className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">A</div>
                    <span className="text-xl font-black tracking-tight">Algshop<span className="text-indigo-500">.</span></span>
                </Link>
            </header>

            <div className="relative mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4 py-10">
                <div className="w-full overflow-hidden rounded-[34px] border border-white bg-white/80 p-8 shadow-2xl shadow-slate-300/40 backdrop-blur-xl sm:p-10">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-indigo-50 text-2xl text-indigo-500">🏪</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">Seller Center</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight">Buka Toko Anda</h1>
                        <p className="mt-2 text-sm text-slate-500">Langkah pertama untuk mulai berjualan di Algshop.</p>
                    </div>

                    <form onSubmit={handleCreateShop} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Nama Toko</label>
                            <input
                                type="text"
                                placeholder="Masukkan nama toko yang menarik..."
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                required
                                className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-13 w-full items-center justify-center rounded-2xl bg-slate-950 text-sm font-extrabold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Memproses...' : 'Buka Toko Sekarang'}
                        </button>
                    </form>

                    <button
                        onClick={() => navigate('/katalog')}
                        className="mt-6 w-full text-center text-xs font-bold text-slate-400 transition hover:text-slate-900"
                    >
                        ← Batal dan kembali ke katalog
                    </button>
                </div>
            </div>
        </div>
    );
}