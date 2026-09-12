import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const getProductImage = (product) => product?.images?.[0]?.path || product?.image;

export default function ConfirmOrder() {
    const navigate = useNavigate();

    const [carts, setCarts] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const [form, setForm] = useState({
        label: 'Rumah',
        recipient_name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        postal_code: '',
        address: '',
        notes: '',
        is_default: false,
    });

    // =========================================================
    // AMBIL DATA KERANJANG + ALAMAT
    // =========================================================

    const fetchData = async () => {
        try {
            setLoading(true);

            const [cartResponse, addressResponse] = await Promise.all([
                api.get('/keranjang'),
                api.get('/alamat'),
            ]);

            const cartData = cartResponse.data.data || [];
            const addressData = addressResponse.data.data || [];

            setCarts(cartData);
            setAddresses(addressData);

            // Pilih alamat default secara otomatis
            const defaultAddress =
                addressData.find((address) => address.is_default) ||
                addressData[0] ||
                null;

            setSelectedAddress(defaultAddress);
        } catch (error) {
            console.error('Gagal mengambil data checkout:', error);

            if (error.response?.status === 401) {
                navigate('/login');
                return;
            }

            alert(
                error.response?.data?.message ||
                'Gagal memuat data checkout.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // =========================================================
    // TOTAL
    // =========================================================

    const grandTotal = carts.reduce(
        (total, item) =>
            total +
            Number(item.product.price) * Number(item.quantity),
        0
    );

    const totalItems = carts.reduce(
        (total, item) => total + Number(item.quantity),
        0
    );

    // =========================================================
    // FORM ADDRESS
    // =========================================================

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm({
            label: 'Rumah',
            recipient_name: '',
            phone: '',
            province: '',
            city: '',
            district: '',
            postal_code: '',
            address: '',
            notes: '',
            is_default: false,
        });

        setEditingAddress(null);
    };

    const openAddAddress = () => {
        resetForm();
        setShowAddressForm(true);
    };

    const openEditAddress = (address) => {
        setEditingAddress(address);

        setForm({
            label: address.label || 'Rumah',
            recipient_name: address.recipient_name || '',
            phone: address.phone || '',
            province: address.province || '',
            city: address.city || '',
            district: address.district || '',
            postal_code: address.postal_code || '',
            address: address.address || '',
            notes: address.notes || '',
            is_default: Boolean(address.is_default),
        });

        setShowAddressForm(true);
    };

    // =========================================================
    // TAMBAH / EDIT ALAMAT
    // =========================================================

    const handleAddressSubmit = async (e) => {
        e.preventDefault();

        try {
            setProcessing(true);

            let response;

            if (editingAddress) {
                response = await api.put(
                    `/alamat/${editingAddress.id}`,
                    form
                );
            } else {
                response = await api.post('/alamat', form);
            }

            const savedAddress = response.data.data;

            alert(
                editingAddress
                    ? 'Alamat berhasil diperbarui.'
                    : 'Alamat berhasil ditambahkan.'
            );

            setShowAddressForm(false);
            resetForm();

            // Refresh alamat
            const addressResponse = await api.get('/alamat');
            const addressData = addressResponse.data.data || [];

            setAddresses(addressData);

            // Pilih alamat yang baru dibuat / diedit
            const updatedSelected =
                addressData.find(
                    (address) => address.id === savedAddress.id
                ) ||
                addressData.find((address) => address.is_default) ||
                addressData[0] ||
                null;

            setSelectedAddress(updatedSelected);
        } catch (error) {
            console.error('Gagal menyimpan alamat:', error);

            const validationErrors = error.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(validationErrors)[0]?.[0];

                alert(firstError || 'Data alamat tidak valid.');
            } else {
                alert(
                    error.response?.data?.message ||
                    'Gagal menyimpan alamat.'
                );
            }
        } finally {
            setProcessing(false);
        }
    };

    // =========================================================
    // HAPUS ALAMAT
    // =========================================================

    const handleDeleteAddress = async (id) => {
        const confirmDelete = window.confirm(
            'Apakah kamu yakin ingin menghapus alamat ini?'
        );

        if (!confirmDelete) return;

        try {
            setProcessing(true);

            await api.delete(`/alamat/${id}`);

            const addressResponse = await api.get('/alamat');
            const addressData = addressResponse.data.data || [];

            setAddresses(addressData);

            const defaultAddress =
                addressData.find((address) => address.is_default) ||
                addressData[0] ||
                null;

            setSelectedAddress(defaultAddress);

            alert('Alamat berhasil dihapus.');
        } catch (error) {
            console.error('Gagal menghapus alamat:', error);

            alert(
                error.response?.data?.message ||
                'Gagal menghapus alamat.'
            );
        } finally {
            setProcessing(false);
        }
    };

    // =========================================================
    // SET DEFAULT
    // =========================================================

    const handleSetDefault = async (id) => {
        try {
            setProcessing(true);

            const response = await api.put(
                `/alamat/${id}/default`
            );

            const updatedAddress = response.data.data;

            const addressResponse = await api.get('/alamat');
            const addressData = addressResponse.data.data || [];

            setAddresses(addressData);

            const selected =
                addressData.find(
                    (address) => address.id === updatedAddress.id
                ) || null;

            setSelectedAddress(selected);
        } catch (error) {
            console.error('Gagal mengubah alamat default:', error);

            alert(
                error.response?.data?.message ||
                'Gagal mengubah alamat utama.'
            );
        } finally {
            setProcessing(false);
        }
    };

    // =========================================================
    // LANJUT KE PEMBAYARAN
    // =========================================================

    const handleContinuePayment = async () => {
        if (!selectedAddress) {
            alert('Silakan pilih atau tambahkan alamat pengiriman terlebih dahulu.');
            return;
        }

        if (carts.length === 0) {
            alert('Keranjang kamu kosong.');
            navigate('/keranjang');
            return;
        }

        try {
            setProcessing(true);

            const response = await api.post(
                '/checkout-keranjang',
                {
                    address_id: selectedAddress.id,
                }
            );

            alert(response.data.message);

            navigate('/pembayaran', {
                state: {
                    invoiceData: response.data.data,
                },
            });
        } catch (error) {
            console.error('Gagal melakukan checkout:', error);

            alert(
                error.response?.data?.message ||
                'Gagal melakukan checkout.'
            );
        } finally {
            setProcessing(false);
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f8fc] font-sans text-slate-900">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
                        <p className="mt-4 text-sm font-bold text-slate-500">
                            Memuat checkout...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="min-h-screen bg-[#f7f8fc] font-sans text-slate-900">

            {/* HEADER */}
            <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-2xl">
                <div className="mx-auto flex min-h-[76px] max-w-6xl items-center justify-between px-4 sm:px-6">

                    <Link
                        to="/katalog"
                        className="flex items-center gap-3"
                    >
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                            A
                        </div>

                        <span className="text-xl font-black tracking-tight">
                            Algshop<span className="text-indigo-500">.</span>
                        </span>
                    </Link>

                    <Link
                        to="/keranjang"
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50"
                    >
                        ← Kembali ke Keranjang
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

                {/* TITLE */}
                <div className="mb-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">
                        Checkout
                    </p>

                    <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                        Konfirmasi Pesanan
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Periksa alamat dan pesanan kamu sebelum melanjutkan ke pembayaran.
                    </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_350px] lg:items-start">

                    {/* LEFT */}
                    <div className="space-y-5">

                        {/* ALAMAT */}
                        <section className="rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-200/30">

                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">
                                        Pengiriman
                                    </p>

                                    <h2 className="mt-2 text-xl font-black">
                                        Alamat Pengiriman
                                    </h2>
                                </div>

                                <button
                                    onClick={openAddAddress}
                                    className="rounded-2xl bg-slate-950 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-indigo-600"
                                >
                                    + Tambah
                                </button>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-sm">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-6 w-6 fill-none stroke-slate-500 stroke-2"
                                        >
                                            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                                            <circle cx="12" cy="10" r="2.5" />
                                        </svg>
                                    </div>

                                    <h3 className="mt-4 text-base font-black">
                                        Belum ada alamat
                                    </h3>

                                    <p className="mt-1 text-xs font-semibold text-slate-400">
                                        Tambahkan alamat pengiriman untuk melanjutkan.
                                    </p>

                                    <button
                                        onClick={openAddAddress}
                                        className="mt-5 rounded-2xl bg-indigo-500 px-5 py-3 text-xs font-extrabold text-white hover:bg-indigo-600"
                                    >
                                        + Tambah Alamat
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-3">
                                    {addresses.map((address) => {
                                        const selected =
                                            selectedAddress?.id === address.id;

                                        return (
                                            <div
                                                key={address.id}
                                                onClick={() =>
                                                    setSelectedAddress(address)
                                                }
                                                className={`cursor-pointer rounded-3xl border p-5 transition ${selected
                                                        ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-100'
                                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className="flex gap-4">

                                                    {/* RADIO */}
                                                    <div className="pt-1">
                                                        <div
                                                            className={`grid h-5 w-5 place-items-center rounded-full border-2 ${selected
                                                                    ? 'border-indigo-500'
                                                                    : 'border-slate-300'
                                                                }`}
                                                        >
                                                            {selected && (
                                                                <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-sm font-black">
                                                                {address.label}
                                                            </span>

                                                            {address.is_default && (
                                                                <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-indigo-600">
                                                                    Utama
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-2 text-sm font-black text-slate-800">
                                                            {address.recipient_name}
                                                        </p>

                                                        <p className="mt-1 text-xs font-semibold text-slate-500">
                                                            {address.phone}
                                                        </p>

                                                        <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
                                                            {address.address}
                                                        </p>

                                                        <p className="text-xs font-semibold leading-5 text-slate-500">
                                                            {address.district},{' '}
                                                            {address.city},{' '}
                                                            {address.province}{' '}
                                                            {address.postal_code}
                                                        </p>

                                                        {address.notes && (
                                                            <p className="mt-2 text-xs font-semibold text-slate-400">
                                                                Catatan: {address.notes}
                                                            </p>
                                                        )}

                                                        <div
                                                            className="mt-4 flex flex-wrap gap-2"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <button
                                                                onClick={() =>
                                                                    openEditAddress(
                                                                        address
                                                                    )
                                                                }
                                                                className="rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-extrabold text-slate-600 hover:bg-slate-50"
                                                            >
                                                                Edit
                                                            </button>

                                                            {!address.is_default && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleSetDefault(
                                                                            address.id
                                                                        )
                                                                    }
                                                                    disabled={processing}
                                                                    className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-[10px] font-extrabold text-indigo-600 hover:bg-indigo-100"
                                                                >
                                                                    Jadikan Utama
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteAddress(
                                                                        address.id
                                                                    )
                                                                }
                                                                disabled={processing}
                                                                className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[10px] font-extrabold text-red-500 hover:bg-red-100"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* PRODUK */}
                        <section className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white shadow-xl shadow-slate-200/30">

                            <div className="border-b border-slate-100 px-6 py-5">
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">
                                    Pesanan
                                </p>

                                <h2 className="mt-2 text-xl font-black">
                                    Produk yang Dibeli
                                </h2>
                            </div>

                            {carts.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <p className="text-sm font-bold text-slate-400">
                                        Keranjang kosong.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {carts.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={`flex gap-4 p-5 sm:p-6 ${index !== carts.length - 1
                                                    ? 'border-b border-slate-100'
                                                    : ''
                                                }`}
                                        >
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-24">
                                                {getProductImage(item.product) ? (
                                                    <img
                                                        src={`/storage/${getProductImage(item.product)}`}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="grid h-full place-items-center text-[9px] font-black uppercase text-slate-400">
                                                        No img
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="line-clamp-2 text-sm font-black text-slate-900 sm:text-base">
                                                    {item.product.name}
                                                </h3>

                                                <p className="mt-1 text-xs font-semibold text-slate-400">
                                                    {item.product.shop?.name}
                                                </p>

                                                <p className="mt-3 text-xs font-semibold text-slate-500">
                                                    {item.quantity} × Rp
                                                    {Number(
                                                        item.product.price
                                                    ).toLocaleString('id-ID')}
                                                </p>
                                            </div>

                                            <strong className="self-end whitespace-nowrap text-sm font-black text-slate-950">
                                                Rp
                                                {(
                                                    item.product.price *
                                                    item.quantity
                                                ).toLocaleString('id-ID')}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RIGHT - SUMMARY */}
                    <aside className="rounded-[30px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/30 lg:sticky lg:top-24">

                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-300">
                            Order Summary
                        </p>

                        <h2 className="mt-2 text-xl font-black">
                            Ringkasan Pesanan
                        </h2>

                        <div className="my-6 h-px bg-white/10" />

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">
                                Total produk
                            </span>

                            <span className="font-bold">
                                {totalItems} item
                            </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-slate-400">
                                Subtotal
                            </span>

                            <span className="font-bold">
                                Rp{grandTotal.toLocaleString('id-ID')}
                            </span>
                        </div>

                        <div className="my-6 h-px bg-white/10" />

                        <div className="flex items-end justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Total
                            </span>

                            <strong className="text-2xl font-black tracking-tight">
                                Rp{grandTotal.toLocaleString('id-ID')}
                            </strong>
                        </div>

                        {selectedAddress && (
                            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-300">
                                    Dikirim ke
                                </p>

                                <p className="mt-2 text-sm font-black">
                                    {selectedAddress.recipient_name}
                                </p>

                                <p className="mt-1 text-xs font-semibold text-slate-400">
                                    {selectedAddress.phone}
                                </p>

                                <p className="mt-2 line-clamp-3 text-xs font-semibold leading-5 text-slate-400">
                                    {selectedAddress.address},{' '}
                                    {selectedAddress.city},{' '}
                                    {selectedAddress.province}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleContinuePayment}
                            disabled={
                                processing ||
                                !selectedAddress ||
                                carts.length === 0
                            }
                            className="mt-7 w-full rounded-2xl bg-white py-4 text-sm font-extrabold text-slate-950 transition hover:bg-indigo-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {processing
                                ? 'Memproses...'
                                : 'Lanjut ke Pembayaran →'}
                        </button>

                        <p className="mt-4 text-center text-[10px] font-semibold leading-4 text-slate-500">
                            Pastikan alamat dan pesanan sudah benar sebelum melanjutkan.
                        </p>
                    </aside>
                </div>
            </main>

            {/* =====================================================
                MODAL TAMBAH / EDIT ALAMAT
            ====================================================== */}

            {showAddressForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[30px] bg-white shadow-2xl">

                        {/* MODAL HEADER */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">
                                    Alamat
                                </p>

                                <h2 className="mt-1 text-xl font-black">
                                    {editingAddress
                                        ? 'Edit Alamat'
                                        : 'Tambah Alamat Baru'}
                                </h2>
                            </div>

                            <button
                                onClick={() => {
                                    setShowAddressForm(false);
                                    resetForm();
                                }}
                                className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                            >
                                ✕
                            </button>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleAddressSubmit}
                            className="space-y-5 p-6"
                        >

                            {/* LABEL */}
                            <div>
                                <label className="mb-2 block text-xs font-black text-slate-700">
                                    Label Alamat
                                </label>

                                <div className="flex gap-2">
                                    {['Rumah', 'Kantor', 'Kos'].map(
                                        (label) => (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        label,
                                                    }))
                                                }
                                                className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${form.label === label
                                                        ? 'bg-indigo-500 text-white'
                                                        : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* NAMA + PHONE */}
                            <div className="grid gap-4 sm:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-xs font-black text-slate-700">
                                        Nama Penerima
                                    </label>

                                    <input
                                        type="text"
                                        name="recipient_name"
                                        value={form.recipient_name}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Nama lengkap"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-black text-slate-700">
                                        Nomor HP
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="08xxxxxxxxxx"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>
                            </div>

                            {/* PROVINSI + KOTA */}
                            <div className="grid gap-4 sm:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-xs font-black text-slate-700">
                                        Provinsi
                                    </label>

                                    <input
                                        type="text"
                                        name="province"
                                        value={form.province}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Contoh: Jawa Tengah"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-black text-slate-700">
                                        Kota / Kabupaten
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Contoh: Semarang"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>
                            </div>

                            {/* KECAMATAN + KODE POS */}
                            <div className="grid gap-4 sm:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-xs font-black text-slate-700">
                                        Kecamatan
                                    </label>

                                    <input
                                        type="text"
                                        name="district"
                                        value={form.district}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Nama kecamatan"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-black text-slate-700">
                                        Kode Pos
                                    </label>

                                    <input
                                        type="text"
                                        name="postal_code"
                                        value={form.postal_code}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="5xxxx"
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>
                            </div>

                            {/* ALAMAT */}
                            <div>
                                <label className="mb-2 block text-xs font-black text-slate-700">
                                    Alamat Lengkap
                                </label>

                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleFormChange}
                                    required
                                    rows="4"
                                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, patokan, dll."
                                    className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                />
                            </div>

                            {/* CATATAN */}
                            <div>
                                <label className="mb-2 block text-xs font-black text-slate-700">
                                    Catatan untuk Kurir
                                    <span className="ml-1 font-semibold text-slate-400">
                                        (opsional)
                                    </span>
                                </label>

                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleFormChange}
                                    rows="2"
                                    placeholder="Contoh: Rumah pagar hitam, sebelah minimarket."
                                    className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                />
                            </div>

                            {/* DEFAULT */}
                            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <input
                                    type="checkbox"
                                    name="is_default"
                                    checked={form.is_default}
                                    onChange={handleFormChange}
                                    className="h-4 w-4 accent-indigo-500"
                                />

                                <div>
                                    <p className="text-xs font-black text-slate-700">
                                        Jadikan alamat utama
                                    </p>

                                    <p className="mt-1 text-[10px] font-semibold text-slate-400">
                                        Alamat ini akan dipilih otomatis saat checkout berikutnya.
                                    </p>
                                </div>
                            </label>

                            {/* BUTTON */}
                            <div className="flex gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddressForm(false);
                                        resetForm();
                                    }}
                                    className="flex-1 rounded-2xl border border-slate-200 bg-white py-3.5 text-xs font-extrabold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-2xl bg-slate-950 py-3.5 text-xs font-extrabold text-white transition hover:bg-indigo-600 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : editingAddress
                                            ? 'Simpan Perubahan'
                                            : 'Simpan Alamat'}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}