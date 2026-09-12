import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/katalog');
        } catch (err) {
            setError('Login gagal. Periksa kembali email dan password Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f6f7fb] font-sans text-slate-900">
            <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-indigo-200/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-48 -right-32 h-[560px] w-[560px] rounded-full bg-violet-200/50 blur-3xl" />

            <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:py-12">
                <div className="grid w-full overflow-hidden rounded-[36px] border border-white/90 bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-[0.95fr_1.05fr]">

                    <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
                        <div className="pointer-events-none absolute -right-28 top-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />

                        <div className="relative">
                            <Link to="/katalog" className="flex items-center gap-3">
                                <div className="grid h-11 w-11 place-items-center rounded-[15px] bg-white text-sm font-black text-slate-950 shadow-xl">
                                    A
                                </div>
                                <div className="text-xl font-black tracking-[-0.04em]">
                                    Algshop<span className="text-indigo-400">.</span>
                                </div>
                            </Link>

                            <div className="mt-20">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Premium marketplace
                                </div>

                                <h1 className="max-w-md text-5xl font-black leading-[0.96] tracking-[-0.06em] xl:text-6xl">
                                    Belanja lebih sederhana.
                                    <span className="mt-1 block text-slate-400">Terasa lebih premium.</span>
                                </h1>

                                <p className="mt-7 max-w-md text-sm leading-7 text-slate-400">
                                    Satu tempat untuk menemukan produk, mengatur pesanan,
                                    dan menikmati pengalaman checkout yang dirancang dengan detail.
                                </p>
                            </div>
                        </div>

                        <div className="relative flex items-center justify-between border-t border-white/10 pt-6">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                                Shop better. Live better.
                            </span>
                            <span className="text-[9px] font-bold text-slate-600">ALGSHOP / 01</span>
                        </div>
                    </aside>

                    <main className="p-7 sm:p-10 lg:p-12 xl:p-14">
                        <div className="mb-9 lg:hidden">
                            <Link to="/katalog" className="flex items-center gap-3">
                                <div className="grid h-11 w-11 place-items-center rounded-[15px] bg-slate-950 text-sm font-black text-white shadow-lg">
                                    A
                                </div>
                                <div className="text-xl font-black tracking-[-0.04em]">
                                    Algshop<span className="text-indigo-500">.</span>
                                </div>
                            </Link>
                        </div>

                        <div className="mb-8">
                            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-indigo-500">
                                Welcome back
                            </p>
                            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                                Masuk ke akun Anda
                            </h2>
                            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Lanjutkan perjalanan belanja Anda di Algshop.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
                                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white font-black">!</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Masukkan password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-14 w-full items-center justify-center rounded-2xl bg-slate-950 text-sm font-extrabold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? 'Memproses...' : 'Masuk Sekarang →'}
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-100" />
                            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-300">Algshop</span>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>

                        <p className="text-center text-sm font-medium text-slate-500">
                            Belum punya akun?{' '}
                            <Link to="/register" className="font-black text-indigo-600 transition hover:text-violet-600">
                                Daftar sekarang
                            </Link>
                        </p>

                        <button
                            onClick={() => navigate('/katalog')}
                            className="mt-5 w-full text-center text-xs font-bold text-slate-400 transition hover:text-slate-900"
                        >
                            ← Kembali ke katalog
                        </button>
                    </main>
                </div>
            </div>
        </div>
    );
}
