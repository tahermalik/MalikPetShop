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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product" element={<Product/>}></Route>
          <Route path="/singleProductDisplay" element={<SingleProductDisplay/>}></Route>
          <Route path="/cart" element={<Cart/>}></Route>
          <Route path="/offer" element={<OfferSection/>}></Route>
          <Route path="/adminSetting" element={<AdminSetting/>}>
            <Route path="" element={<AddProduct/>}></Route>
            <Route path="addProduct" element={<AddProduct/>}></Route>
            <Route path="createCoupon" element={<CouponRuleCreator/>}></Route>
            <Route path="createOffer" element={<CreateOffer/>}></Route>
          </Route>
          <Route path="/WishListUI" element={<WishListUI/>}></Route>
          <Route path="/forgotPassword" element={<PasswordRecovery/>}></Route>
          <Route path="/orderSuccess" element={<OrderSuccess/>}></Route>
          <Route path="/addressForm" element={<UserAddressForm/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
