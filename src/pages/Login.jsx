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
        <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] font-sans text-slate-900">
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-20 h-[460px] w-[460px] rounded-full bg-violet-200/40 blur-3xl" />

            <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
                <div className="grid w-full overflow-hidden rounded-[34px] border border-white bg-white/80 shadow-2xl shadow-slate-300/40 backdrop-blur-xl lg:grid-cols-2">
                    <div className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
                        <div>
                            <div className="mb-12 flex items-center gap-3">
                                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sm font-black text-slate-950">A</div>
                                <div className="text-xl font-black tracking-tight">Algshop<span className="text-indigo-400">.</span></div>
                            </div>
                            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-indigo-300">Premium marketplace</p>
                            <h1 className="max-w-md text-5xl font-black leading-[1] tracking-[-0.05em]">
                                Belanja lebih sederhana. Terasa lebih premium.
                            </h1>
                            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
                                Masuk ke akunmu untuk mengakses katalog, keranjang, pesanan, dan riwayat belanja.
                            </p>
                        </div>
                        <p className="text-xs font-semibold text-slate-500">Shop better. Live better.</p>
                    </div>

                    <div className="p-7 sm:p-10 lg:p-12">
                        <div className="mb-8 lg:hidden">
                            <div className="mb-6 grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg">A</div>
                            <h1 className="text-3xl font-black tracking-tight">Selamat datang.</h1>
                            <p className="mt-2 text-sm text-slate-500">Masuk untuk melanjutkan ke Algshop.</p>
                        </div>

                        <div className="mb-8 hidden lg:block">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">Welcome back</p>
                            <h2 className="mt-2 text-3xl font-black tracking-tight">Masuk ke akun Anda</h2>
                            <p className="mt-2 text-sm text-slate-500">Kelola pengalaman belanja Anda dari satu tempat.</p>
                        </div>

                        {error && (
                            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
                                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white font-black">!</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Email</label>
                                <input
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Password</label>
                                <input
                                    type="password"
                                    placeholder="Masukkan password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-13 w-full items-center justify-center rounded-2xl bg-slate-950 text-sm font-extrabold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? 'Memproses...' : 'Masuk Sekarang'}
                            </button>
                        </form>

                        <p className="text-center text-slate-500 mt-7">
                            Belum punya akun?{' '}
                            <Link
                                to="/register"
                                className="font-bold text-violet-600 hover:text-violet-700"
                            >
                                Daftar sekarang
                            </Link>
                        </p>

                        <button
                            onClick={() => navigate('/katalog')}
                            className="mt-5 w-full text-center text-xs font-bold text-slate-400 transition hover:text-slate-900"
                        >
                            ← Kembali ke katalog
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
