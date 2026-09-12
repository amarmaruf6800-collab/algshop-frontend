import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.password_confirmation) {
            setError('Konfirmasi password tidak cocok.');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/register', form);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/katalog');
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)?.[0]?.[0];
                setError(firstError || 'Data registrasi tidak valid.');
            } else {
                setError(
                    err.response?.data?.message ||
                    'Registrasi gagal. Silakan coba lagi.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f6f7fb] font-sans text-slate-900">
            <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-violet-200/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-48 -right-32 h-[560px] w-[560px] rounded-full bg-indigo-200/50 blur-3xl" />

            <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:py-12">
                <div className="grid w-full overflow-hidden rounded-[36px] border border-white/90 bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-[0.95fr_1.05fr]">

                    <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
                        <div className="pointer-events-none absolute -right-28 top-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-indigo-600/15 blur-3xl" />

                        <div className="relative">
                            <Link to="/katalog" className="flex items-center gap-3">
                                <div className="grid h-11 w-11 place-items-center rounded-[15px] bg-white text-sm font-black text-slate-950 shadow-xl">
                                    A
                                </div>
                                <div className="text-xl font-black tracking-[-0.04em]">
                                    Algshop<span className="text-violet-400">.</span>
                                </div>
                            </Link>

                            <div className="mt-20">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-violet-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Create your account
                                </div>

                                <h1 className="max-w-md text-5xl font-black leading-[0.96] tracking-[-0.06em] xl:text-6xl">
                                    Mulai perjalanan
                                    <span className="mt-1 block text-slate-400">belanja Anda.</span>
                                </h1>

                                <p className="mt-7 max-w-md text-sm leading-7 text-slate-400">
                                    Buat akun untuk mengakses katalog, keranjang,
                                    pesanan, dan pengalaman belanja Algshop.
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
                                    Algshop<span className="text-violet-500">.</span>
                                </div>
                            </Link>
                        </div>

                        <div className="mb-8">
                            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-violet-500">
                                Create account
                            </p>
                            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                                Buat akun Anda
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Daftar sekali, lalu mulai menjelajah Algshop.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
                                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white font-black">!</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                ['name', 'Nama', 'Nama lengkap', 'text'],
                                ['email', 'Email', 'nama@email.com', 'email'],
                                ['password', 'Password', 'Minimal 8 karakter', 'password'],
                                ['password_confirmation', 'Konfirmasi Password', 'Ulangi password', 'password'],
                            ].map(([name, label, placeholder, type]) => (
                                <div key={name}>
                                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        placeholder={placeholder}
                                        required
                                        minLength={name === 'password' ? 8 : undefined}
                                        className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                                    />
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-slate-950 text-sm font-extrabold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? 'Membuat akun...' : 'Daftar Sekarang →'}
                            </button>
                        </form>

                        <p className="mt-7 text-center text-sm font-medium text-slate-500">
                            Sudah punya akun?{' '}
                            <Link to="/login" className="font-black text-violet-600 transition hover:text-indigo-600">
                                Masuk di sini
                            </Link>
                        </p>
                    </main>
                </div>
            </div>
        </div>
    );
}
