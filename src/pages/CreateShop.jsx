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
            navigate('/manajemen-produk');
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal membuat toko.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f6f7fb] font-sans text-slate-900">
            <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-indigo-200/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-48 -right-32 h-[560px] w-[560px] rounded-full bg-violet-200/50 blur-3xl" />

            <header className="relative z-40 border-b border-white/80 bg-white/70 px-4 py-5 backdrop-blur-xl sm:px-7">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <Link to="/katalog" className="group flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-[15px] bg-slate-950 text-sm font-black text-white shadow-lg transition group-hover:-rotate-3">A</div>
                        <div className="text-xl font-black tracking-[-0.04em]">Algshop<span className="text-indigo-500">.</span></div>
                    </Link>
                    <Link to="/katalog" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600">← Katalog</Link>
                </div>
            </header>

            <main className="relative mx-auto flex min-h-[calc(100vh-82px)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
                <div className="grid w-full overflow-hidden rounded-[36px] border border-white bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-[0.9fr_1.1fr]">
                    <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
                        <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
                        <div>
                            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">Seller center</span>
                            <h1 className="mt-7 text-5xl font-black leading-[0.96] tracking-[-0.06em]">Bangun toko.<span className="block text-slate-400">Mulai berjualan.</span></h1>
                            <p className="mt-7 max-w-md text-sm leading-7 text-slate-400">Hadirkan produk Anda ke marketplace Algshop dengan ruang seller yang sederhana dan modern.</p>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">ALGSHOP / SELLER</p>
                    </aside>

                    <section className="p-7 sm:p-10 lg:p-14">
                        <div className="mb-9 lg:hidden">
                            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-indigo-50 text-2xl text-indigo-600">⌂</div>
                        </div>

                        <p className="text-center text-[9px] font-black uppercase tracking-[0.22em] text-indigo-500 lg:text-left">Create your store</p>
                        <h2 className="mt-2 text-center text-3xl font-black tracking-[-0.05em] sm:text-4xl lg:text-left">Buka Toko Anda</h2>
                        <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-slate-500 lg:mx-0 lg:text-left">Pilih nama toko yang akan mewakili brand Anda di Algshop.</p>

                        <form onSubmit={handleCreateShop} className="mt-9 space-y-5">
                            <div>
                                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Nama Toko</label>
                                <input type="text" placeholder="Contoh: Alg Store" value={shopName} onChange={(e) => setShopName(e.target.value)} required className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
                            </div>

                            <button type="submit" disabled={loading} className="flex h-14 w-full items-center justify-center rounded-2xl bg-slate-950 text-sm font-extrabold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60">
                                {loading ? 'Memproses...' : 'Buka Toko Sekarang →'}
                            </button>
                        </form>

                        <div className="mt-8 grid gap-2 sm:grid-cols-3">
                            {['Kelola produk', 'Atur stok', 'Terima pesanan'].map((item) => (
                                <div key={item} className="rounded-2xl bg-slate-50 px-3 py-3 text-center text-[9px] font-black uppercase tracking-wider text-slate-500">{item}</div>
                            ))}
                        </div>

                        <button onClick={() => navigate('/katalog')} className="mt-6 w-full text-center text-xs font-bold text-slate-400 transition hover:text-slate-900">← Batal dan kembali ke katalog</button>
                    </section>
                </div>
            </main>
        </div>
    );
}