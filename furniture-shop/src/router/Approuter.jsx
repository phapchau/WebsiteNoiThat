// import { Routes, Route, Navigate } from "react-router-dom";
// import Header from "../components/Header.jsx";
// import Footer from "../components/Footer.jsx";

// import Home from "../pages/Home.jsx";
// import Products from "../pages/Products.jsx";
// import ProductDetail from "../pages/ProductDetail.jsx";
// import Cart from "../pages/Cart.jsx";
// import NotFound from "../pages/NotFound.jsx";
// import Login from "../pages/Login.jsx";
// import Register from "../pages/Register.jsx";
// import AdminNewProduct from "../pages/AdminNewProduct.jsx";
// import AccountLayout from "../pages/account/AccountLayout";
// import Profile from "../pages/account/Profile";
// import Address from "../pages/account/Address";
// import Password from "../pages/account/Password";
// import ProtectedRoute from "../components/ProtectedRoute.jsx";
// import AdminLayout from "../pages/admin/AdminLayout.jsx";
// import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
// import AdminProducts from "../pages/admin/AdminProducts.jsx";
// import AdminProductForm from "../pages/admin/AdminProductForm.jsx";
// import AdminCategories from "../pages/admin/AdminCategories.jsx";
// import Checkout from "../pages/Checkout.jsx";
// import OrderDetail from "../pages/OrderDetail.jsx";
// import MyOrders from "../pages/MyOrders.jsx";
// import CheckoutReturn from "../pages/CheckoutReturn.jsx";
// import AdminOrders from "../pages/admin/AdminOrders.jsx";
// import About from "../pages/About.jsx";



// import NewRequest from "../pages/custom/NewRequest";
// import MyRequests from "../pages/custom/MyRequests";
// import AdminCustomRequests from "../pages/admin/AdminCustomRequests";



// function AppLayout({ children }) {
//   return (
//     <>
//       <Header />
//       <main className="min-h-[60vh] bg-slate-50">
//         <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-10 md:py-12">{children}</div>
//       </main>
//       <Footer />
//     </>
//   );
// }

// export default function AppRouter() {
//   return (
//     <Routes>
//       <Route path="/" element={<AppLayout><Home /></AppLayout>} />
//       <Route path="/products" element={<AppLayout><Products /></AppLayout>} />
//       <Route path="/products/:idOrSlug" element={<AppLayout><ProductDetail /></AppLayout>} />
//       <Route path="/cart" element={<AppLayout><Cart /></AppLayout>} />
//       <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
//       <Route path="/register" element={<AppLayout><Register /></AppLayout>} />
//       { /* Trang giới thiệu */ }
   
//        <Route path="/about" element={<AppLayout><About /></AppLayout>} />

//        {/* Checkout + Orders */}
//       <Route path="/checkout" element={<Checkout />} />
//       <Route path="/orders/:id" element={<OrderDetail />} />
//       <Route path="/checkout-return" element={<CheckoutReturn />} />
//       <Route path="/orders/me" element={<MyOrders />} />

// <Route path="/custom/new" element={<NewRequest/>} />
// <Route path="/custom/requests" element={<MyRequests/>} />


// {/* <Route path="/custom/new" element={<AppLayout><NewRequest /></AppLayout>} />
//       <Route path="/custom/requests" element={<AppLayout><MyRequests /></AppLayout>} /> */}






//       <Route path="/404" element={<AppLayout><NotFound /></AppLayout>} />
//       <Route path="*" element={<Navigate to="/404" replace />} />

// <Route element={<ProtectedRoute roles={['admin']} />}>
//   <Route path="/admin" element={<AdminLayout />}>
//     <Route index element={<AdminDashboard />} />
//     <Route path="products" element={<AdminProducts />} />
//    {/* Link yêu cầu: /admin/product/new  (singular) */}
//    <Route path="product/new" element={<AdminNewProduct />} />
//  {/* <Route path="product/new" element={<AdminProductForm />} /> */}

//     <Route path="product/:id/edit" element={<AdminProductForm />} /> 

//     <Route path="orders" element={<AdminOrders />} />

//     <Route path="categories" element={<AdminCategories />} />


//      <Route path="custom-requests" element={<AdminCustomRequests/>} />
 
//   </Route>
// </Route>


      
// {/* <Route path="/orders/me" element={<AppLayout><MyOrders /></AppLayout>} /> */}
// <Route path="/account" element={<AppLayout><AccountLayout /></AppLayout>}>
//   <Route index element={<Profile />} />
//   <Route path="profile" element={<Profile />} />
//   <Route path="address" element={<Address />} />
//   <Route path="password" element={<Password />} />
// </Route>

//     </Routes>
//   );
// }/4/11








// src/routes/AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import Home from "../pages/Home.jsx";
import Products from "../pages/Products.jsx";
import ProductDetail from "../pages/ProductDetail.jsx";
import Cart from "../pages/Cart.jsx";
import NotFound from "../pages/NotFound.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Checkout from "../pages/Checkout.jsx";
import CheckoutReturn from "../pages/CheckoutReturn.jsx";
import MyOrders from "../pages/MyOrders.jsx";
import OrderDetail from "../pages/OrderDetail.jsx";
import About from "../pages/About.jsx";

// Account
import AccountLayout from "../pages/account/AccountLayout.jsx";
import Profile from "../pages/account/Profile.jsx";
import Address from "../pages/account/Address.jsx";
import Password from "../pages/account/Password.jsx";

// Admin
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AdminLayout from "../pages/admin/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminProducts from "../pages/admin/AdminProducts.jsx";
import AdminProductForm from "../pages/admin/AdminProductForm.jsx";
import AdminCategories from "../pages/admin/AdminCategories.jsx";
import AdminOrders from "../pages/admin/AdminOrders.jsx";
import AdminNewProduct from "../pages/AdminNewProduct.jsx"; // nếu file thật ở /pages/admin, hãy sửa import lại
import AdminCustomers from "../pages/admin/AdminCustomers";
import AdminCustomerDetail from "../pages/admin/AdminCustomerDetail";
import AdminAnalytics from "../pages/admin/AdminAnalytics.jsx";
import AdminPayments from "../pages/admin/AdminPayments.jsx";
import AdminCustomPayments from "../pages/admin/AdminCustomPayments";



import StaffLayout from "../pages/staff/StaffLayout.jsx";
import StaffOrders from "../pages/staff/StaffOrders.jsx";
import StaffCustomRequests from "../pages/staff/StaffCustomRequests.jsx";
import StaffProducts from "../pages/staff/StaffProducts.jsx";
import StaffCustomPayments from "../pages/staff/StaffCustomPayments.jsx";


// Custom Design Requests
import NewRequest from "../pages/custom/NewRequest.jsx";
import MyRequests from "../pages/custom/MyRequests.jsx";
import AdminCustomRequests from "../pages/admin/AdminCustomRequests.jsx";
import PaymentReturn from "../pages/PaymentReturn.jsx";
import SalePage from "../pages/SalePage.jsx";
import FlashSalePro from "../pages/FlashSalePro";


import House3D from "../pages/House3D.jsx";
import HouseViewer from "../pages/HouseViewer.jsx";
function AppLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-10 md:py-12">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public pages (có Header/Footer) */}
      <Route path="/" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/products" element={<AppLayout><Products /></AppLayout>} />
      <Route path="/products/:idOrSlug" element={<AppLayout><ProductDetail /></AppLayout>} />
      <Route path="/cart" element={<AppLayout><Cart /></AppLayout>} />
      <Route path="/about" element={<AppLayout><About /></AppLayout>} />
      <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
      <Route path="/register" element={<AppLayout><Register /></AppLayout>} />

      {/* Checkout + Orders (nên có layout nhất quán) */}
      <Route path="/checkout" element={<AppLayout><Checkout /></AppLayout>} />
      <Route path="/checkout-return" element={<AppLayout><CheckoutReturn /></AppLayout>} />
      <Route path="/orders/:id" element={<AppLayout><OrderDetail /></AppLayout>} />
 <Route path="/payment-return" element={<PaymentReturn />} />
      {/* Custom Design (có layout + yêu cầu đăng nhập cho trang của tôi) */}
      <Route path="/custom/new" element={<AppLayout><NewRequest /></AppLayout>} />

      <Route path="/models" element={<House3D />} />
<Route path="/models/view" element={<HouseViewer />} />
<Route path="/sale" element={<SalePage />} />
<Route path="/flash-sale" element={<FlashSalePro />} />

      <Route
        path="/custom/requests"
        element={
          <AppLayout>
              <MyRequests />
          </AppLayout>
        }
      />

      {/* Account area (cần đăng nhập, có layout ngoài) */}
      <Route
        path="/account"
        element={
          <AppLayout>
           
              <AccountLayout />
            
          </AppLayout>
        }
      >
        <Route index element={<Profile />} />
        <Route path="profile" element={<Profile />} />
        <Route path="address" element={<Address />} />
        <Route path="password" element={<Password />} />
      </Route>

      {/* Đơn hàng của tôi (cần đăng nhập) */}
      <Route
        path="/orders/me"
        element={
          <AppLayout>
           
              <MyOrders />
           
          </AppLayout>
        }
      />

      {/* Admin (yêu cầu role=admin) */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          {/* new product (singular) */}
          <Route path="product/new" element={<AdminNewProduct />} />
          <Route path="product/:id/edit" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="custom-requests" element={<AdminCustomRequests />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/customers/:id" element={<AdminCustomerDetail />} />
         <Route path="/admin/analytics" element={<AdminAnalytics />} />
<Route path="/admin/custom-payments" element={<AdminCustomPayments />} />


        </Route>
      </Route>


      {/* STAFF AREA */}
<Route element={<ProtectedRoute roles={['staff']} />}>
  <Route path="/staff" element={<StaffLayout />}>
    <Route index element={<StaffOrders />} />
    <Route path="custom-requests" element={<StaffCustomRequests />} />
    <Route path="products" element={<StaffProducts />} />
    <Route path="product/new" element={<AdminNewProduct />} />
    <Route path="product/:id/edit" element={<AdminProductForm />} />
    <Route path="analytics" element={<AdminAnalytics />} />
    <Route path="/staff/custom-payments" element={<StaffCustomPayments />} />
  </Route>
</Route>


      {/* 404 */}
      <Route path="/404" element={<AppLayout><NotFound /></AppLayout>} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

