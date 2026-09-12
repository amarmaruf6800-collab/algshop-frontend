import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import OrderHistory from './pages/OrderHistory';
import SellerDashboard from './pages/SellerDashboard';
import ProductDetail from './pages/ProductDetail';
import MyProducts from './pages/MyProducts';
import CreateShop from './pages/CreateShop';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/katalog" element={<Catalog />} />
        <Route path="/keranjang" element={<Cart />} />
        <Route path="/pembayaran" element={<Payment />} />
        <Route path="/riwayat-belanja" element={<OrderHistory />} />
        <Route path="/pesanan-masuk" element={<SellerDashboard />} />
        <Route path="/produk/:id" element={<ProductDetail />} />
        <Route path="/manajemen-produk" element={<MyProducts />} />
        <Route path="/buka-toko" element={<CreateShop />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Navigate to="/katalog" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;