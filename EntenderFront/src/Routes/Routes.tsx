import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../Pages/LoginPage";
import Register from "../Pages/RegisterPage";
import Main from "../Pages/MainPage";
import ProductPage from "../Pages/ProductPage";
import CartPage from "../Pages/CartPage";
import SearchPage from '../Pages/SearchPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Main />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
};

export default AppRoutes;