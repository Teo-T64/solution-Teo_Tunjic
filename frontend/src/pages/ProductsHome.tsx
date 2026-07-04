import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; 
import { useApp } from "@/context/AppContext";
import type { Product } from "@/types";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "@/util/apiEndpoints";
import useUser from "@/hooks/useUser";

import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { User2Icon, Heart, Search, ShoppingBag, SlidersHorizontal, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProductsHome() {
  useUser();
  const { user,clearUser } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: favorites = [], isLoading: isLoadingFavorites } = useQuery<Product[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await axiosConfig.get<Product[]>(API_ENDPOINTS.GET_FAVORITES || "/favorites");
      return res.data || [];
    }
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: number; isFavorite: boolean }) => {
      if (!id) return;
      
      const url = API_ENDPOINTS.OPERATE_FAVORITE(id); 
      
      if (isFavorite) {
        await axiosConfig.delete(url);
      } else {
        await axiosConfig.post(url);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    }
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosConfig.get<string[]>(API_ENDPOINTS.GET_CATEGORIES);      
      return res.data || [];
    },
    staleTime: 1000 * 60 * 2
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["products", selectedCategory, sortBy, debouncedSearchQuery],
    queryFn: async () => {
      if (debouncedSearchQuery.trim() !== "") {
        const res = await axiosConfig.get<Product[]>(API_ENDPOINTS.SEARCH_PRODUCTS, {
          params: { q: debouncedSearchQuery }
        });
        return res.data || [];
      }

      if (selectedCategory !== "all" || sortBy !== "default") {
        const params: Record<string, string> = {};
        if (selectedCategory !== "all") params.category = selectedCategory;
        if (sortBy !== "default") params.sort = sortBy;
        
        const res = await axiosConfig.get<Product[]>(API_ENDPOINTS.FILTER_PRODUCTS, { params });
        return res.data || [];
      }

      const res = await axiosConfig.get<Product[]>(API_ENDPOINTS.GET_PRODUCTS);
      return res.data || [];
    },
    staleTime: 1000 * 60 * 2, 
  });

  const isLoading = isLoadingCategories || isLoadingProducts || isLoadingFavorites;
  
  const handleCategoryChange = (value: string | null) => {
    const safeValue = value ?? "all"; 
    setSelectedCategory(safeValue);
    setSearchQuery(""); 
    setDebouncedSearchQuery(""); 
  };
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    clearUser(); 
    navigate("/login"); 
  };
  const handleSortChange = (value: string | null) => {
    const safeValue = value ?? "default"; 
    setSortBy(safeValue);
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedCategory("all");
    setSortBy("default");
  };
  if (!localStorage.getItem("token")) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">WebShop</h1>
        </div>

        <div className="relative w-full max-w-md mx-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="search"
            type="text"
            placeholder="Search products..."
            className="pl-9 w-full bg-gray-50 dark:bg-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium dark:border-gray-800 dark:bg-gray-900">
          <Button onClick={() => navigate("/favorites")} className="flex items-center gap-2 rounded-3xl" size="sm">
            <Heart size={16} className="text-white fill-white"/>
            <span className="text-white hidden sm:inline">Favorites</span>
          </Button>
          <Button onClick={handleLogout} className="flex items-center gap-2 rounded-3xl" size="sm">
            <span className="text-white hidden sm:inline">Logout</span>
          </Button>
          <User2Icon size={18} className="text-gray-500" />
          <span className="hidden sm:inline text-gray-700 dark:text-gray-300">
            {user ? user.username : "Guest"}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12">
        
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Featured Products</h2>
            <p className="text-sm text-gray-500">Discover our collection ({products.length} items)</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mr-2">
              <SlidersHorizontal size={16} />
              <span>Filters:</span>
            </div>

            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-40 bg-white dark:bg-gray-900">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: string) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-40 bg-white dark:bg-gray-900">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {(selectedCategory !== "all" || sortBy !== "default" || searchQuery !== "") && (
              <Button variant="ghost" size="icon" onClick={resetFilters}>
                <RefreshCw size={16} />
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader className="p-4 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardFooter className="p-4 flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-9 w-20" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-lg border-gray-300 dark:border-gray-800 p-8">
            <p className="text-lg font-medium text-gray-500 mb-4">No products found</p>
            <Button variant="outline" size="sm" onClick={resetFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product: Product) => {
              const isFavorite = favorites.some((fav) => fav.id === product.id);

              return (
                <Card key={product.id} className="group relative flex flex-col justify-between overflow-hidden transition-all hover:shadow-md bg-white dark:bg-gray-900">
                  <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-950">
                    <img
                      src={product.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500"}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Button 
                      onClick={() => toggleFavoriteMutation.mutate({ id: product.id, isFavorite })} 
                      disabled={toggleFavoriteMutation.isPending}
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500 dark:bg-black/50 z-10"
                    >
                      <Heart size={18} className={isFavorite ? "text-red-500 fill-red-500" : ""} />
                    </Button>
                  </div>

                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="line-clamp-2 text-base font-semibold group-hover:text-primary">
                      {product.title}
                    </CardTitle>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                  </CardHeader>

                  <CardFooter className="p-4 pt-2 flex items-center justify-between mt-auto">
                    <Badge variant="secondary" className="text-base font-bold">
                      {product.price.toFixed(2)} €
                    </Badge>
                    <Button onClick={() => navigate(`/product/${product.id}`)} className="px-4" size="sm">View</Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductsHome;