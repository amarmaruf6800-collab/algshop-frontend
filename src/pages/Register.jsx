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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-5xl bg-white rounded-[32px] overflow-hidden shadow-xl grid md:grid-cols-2">

                {/* LEFT */}
                <div className="bg-[#020617] text-white p-10 md:p-14 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-20">
                            <div className="w-12 h-12 rounded-2xl bg-white text-slate-950 flex items-center justify-center font-black text-xl">
                                A
                            </div>

                            <span className="text-2xl font-black">
                                Algshop<span className="text-violet-500">.</span>
                            </span>
                        </div>

                        <p className="text-violet-300 font-bold tracking-[0.2em] text-sm mb-5">
                            PREMIUM MARKETPLACE
                        </p>

                        <h1 className="text-4xl md:text-5xl font-black leading-tight">
                            Mulai perjalanan
                            <br />
                            belanja Anda.
                        </h1>

                        <p className="text-slate-400 mt-6 leading-8">
                            Buat akun Algshop untuk menikmati katalog,
                            keranjang, pesanan, dan pengalaman belanja
                            yang lebih sederhana.
                        </p>
                    </div>

                    <p className="text-slate-500 mt-12">
                        Shop better. Live better.
                    </p>
                </div>

                {/* RIGHT */}
                <div className="p-8 md:p-14">
                    <p className="text-violet-500 font-bold tracking-[0.2em] text-sm mb-4">
                        CREATE ACCOUNT
                    </p>

                    <h2 className="text-4xl font-black text-slate-950">
                        Buat akun Anda
                    </h2>

                    <p className="text-slate-500 mt-3 mb-8">
                        Daftar untuk mulai menggunakan Algshop.
                    </p>

                    {error && (
                        <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-sm text-red-600 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">
                                NAMA
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Nama lengkap"
                                required
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-violet-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">
                                EMAIL
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="nama@email.com"
                                required
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-violet-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">
                                PASSWORD
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Minimal 8 karakter"
                                required
                                minLength={8}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-violet-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">
                                KONFIRMASI PASSWORD
                            </label>

                            <input
                                type="password"
                                name="password_confirmation"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                placeholder="Ulangi password"
                                required
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-violet-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-[#020617] text-white py-4 font-bold hover:bg-slate-800 transition disabled:opacity-50"
                        >
                            {loading ? 'Membuat akun...' : 'Daftar Sekarang'}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 mt-7">
                        Sudah punya akun?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-violet-600 hover:text-violet-700"
                        >
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}