/*export const BASE_URL = import.meta.env.VITE_BACKEND_URL;*/
export const BASE_URL = "http://localhost:8080/api"

export const API_ENDPOINTS = {
    LOGIN: "/auth/login",
    GET_USER: "/auth/me",
    GET_PRODUCTS:"/products",
    GET_SINGLE_PRODUCT: (id:number)=>`/products/${id}`,
    FILTER_PRODUCTS: "/products/filter",
    SEARCH_PRODUCTS: "/products/search",
    GET_FAVORITES: "/favorites",
    OPERATE_FAVORITE: (id:number)=>`/favorites/${id}`,

}