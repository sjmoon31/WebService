import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OauthLogin from './pages/OauthLogin.js';
import Main from './pages/Main';
import ProductInfo from './pages/product/ProductInfo';
import ProductList from './pages/product/ProductList';
import CartList from './pages/cart/CartList';
import PaymentInfo from './pages/payment/PaymentInfo';
import MyPage from './pages/member/MyPage';
import MyOrderList from './pages/order/MyOrderList';
import MyReviewInfo from './pages/review/MyReviewInfo';
import MyHeartList from './pages/heart/MyHeartList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/main" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/productInfo/:productSeq" element={<ProductInfo />} />
        <Route path="/productList" element={<ProductList />} />
        <Route path="/cartList" element={<CartList />} />
        <Route path="/paymentInfo" element={<PaymentInfo />} />
        <Route path="/auth/google/callback" element={<OauthLogin />}></Route>
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/myOrderList" element={<MyOrderList />} />
        <Route path="/myReviewInfo/:orderInfoSeq/:productSeq/:sizeType" element={<MyReviewInfo />} />
        <Route path="/myHeartList" element={<MyHeartList />} />
      </Routes>
    </Router>
  );
}

export default App;