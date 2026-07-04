import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import ProductsHome from "./pages/ProductsHome";
import FavoriteProducts from "./pages/FavoriteProducts";
import FilterProducts from "./pages/FilterProducts";
import Login from "./pages/Login";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root/>}/>
          <Route path="/products" element={<ProductsHome/>}/>
          <Route path="/favorites" element={<FavoriteProducts/>}/>
          <Route path="/filter" element={<FilterProducts/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

function Root(){
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (<Navigate to="/products"/>) : (<Navigate to="/login"/>);
}

export default App
