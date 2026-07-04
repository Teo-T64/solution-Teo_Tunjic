import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProductsHome from "./pages/ProductsHome";
import FavoriteProducts from "./pages/FavoriteProducts";
import Login from "./pages/Login";
import { Toaster } from "sonner";
import ProductDetails from "./pages/ProductDetails";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root/>}/>

          <Route path="/login" element={<Login/>}/>
          <Route path="/products" element={<ProductsHome/>}/> 
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/favorites" element={<FavoriteProducts/>}/>
        </Routes>
      </BrowserRouter>
      <Toaster/>
    </>
  );
}

function Root(){
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (<Navigate to="/products" replace />) : (<Navigate to="/login" replace />);
}

export default App;