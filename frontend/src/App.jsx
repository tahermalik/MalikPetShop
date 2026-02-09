import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import "./custom.css"
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import OfferSection from "./pages/Offer";
import CouponRuleCreator from "./pages/CoupanManagement";
import AddProduct from "./pages/addProduct";
import CreateOffer from "./pages/addOffer";
import AdminSetting from "./pages/adminSetting";
import SingleProductDisplay from "./pages/SingleProductDisplay";
import WishListUI from "./pages/WishListUI";
import PasswordRecovery from "./pages/forgotPasswd";
import OrderSuccess from "./pages/orderSuccess";
import Checkout from "./pages/Checkout";
import UserAddressForm from "./pages/userAddressForm";
import useLenis from "./hooks/useLenis";
import { USER_ENDPOINTS } from "./pages/endpoints";
import { useEffect } from "react";
import axios from "axios";
import ChatUI from "./pages/ChatUI";
import AIChatDrawer from "./pages/AIChatDrawer";

function App() {
  useLenis();
  useEffect(() => {
    async function setGuestId() {
      console.log
      try {
        await axios.get(`${USER_ENDPOINTS}/getGuestId`, { withCredentials: true });
      } catch (err) {
        console.error("Failed to set guest ID", err);
      }
    }

    setGuestId();
  }, []);

  return (
    <div className="h-auto w-screen bg-white font-serif">
      <BrowserRouter>
        <Routes>
          <Route path="" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Product_Page" element={<Product />}></Route>
          <Route path="/Product_Page/SingleProductDisplay" element={<SingleProductDisplay />}></Route>
          <Route path="/cart" element={<Cart />}></Route>

          {/* All offer routes */}
          <Route path="/Offer" element={<OfferSection />}></Route>
          <Route path="/Product_Page/Offer" element={<OfferSection />}></Route>
          <Route path="/Product_Page/SingleProductDisplay/Offer" element={<OfferSection />}></Route>

          {/* All cart routes */}
          <Route path="/Cart" element={<Cart />}></Route>
          <Route path="/Product_Page/Cart" element={<Cart />}></Route>
          <Route path="/Product_Page/SingleProductDisplay/Cart" element={<Cart />}></Route>

          {/* Admin Routes */}
          <Route path="/adminSetting" element={<AdminSetting />}>
            <Route path="" element={<AddProduct />}></Route>
            <Route path="addProduct" element={<AddProduct />}></Route>
            <Route path="createCoupon" element={<CouponRuleCreator />}></Route>
            <Route path="createOffer" element={<CreateOffer />}></Route>
          </Route>

          {/* All wishlist routes */}
          <Route path="/Wish_List" element={<WishListUI />}></Route>
          <Route path="/Product_Page/Wish_List" element={<WishListUI />}></Route>
          <Route path="/Product_Page/SingleProductDisplay/Wish_List" element={<WishListUI />}></Route>

          <Route path="/forgotPassword" element={<PasswordRecovery />}></Route>
          <Route path="/orderSuccess" element={<OrderSuccess />}></Route>
          <Route path="/addressForm" element={<UserAddressForm />}></Route>
          <Route path="/ChatUI" element={<ChatUI />}></Route>
          <Route path="/SingleProductDisplay" element={<SingleProductDisplay />}></Route>

        </Routes>
        <AIChatDrawer />
      </BrowserRouter>

    </div>
  );
}

export default App;
