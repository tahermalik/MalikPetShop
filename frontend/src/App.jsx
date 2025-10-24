import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import "./custom.css"
import Product from "./pages/Product";
import TopSeller from "./pages/TopSeller";
import Cat from "./pages/Cat"
import Dog from "./pages/Dog"
import SmallPets from "./pages/SmallPets"
import ProductDisplay from "./pages/ProductDisplay";
import Cart from "./pages/Cart";
import OfferSection from "./pages/Offer";
import CouponRuleCreator from "./pages/CoupanManagement";
import AddProduct from "./pages/addProduct";

function App() {
  return (
    <div className="h-auto w-screen bg-white font-serif">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product" element={<Product/>}>
            <Route path="" element={<TopSeller/>}></Route>
            <Route path="cat" element={<Cat/>}></Route>
            <Route path="dog" element={<Dog/>}></Route>
            <Route path="small_pets" element={<SmallPets/>}></Route>
          </Route>
          <Route path="/ProductDisplay" element={<ProductDisplay/>}></Route>
          <Route path="/cart" element={<Cart/>}></Route>
          <Route path="/offer" element={<OfferSection/>}></Route>
          <Route path="/addProduct" element={<AddProduct/>}></Route>
          <Route path="/CouponRuleCreator" element={<CouponRuleCreator/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
