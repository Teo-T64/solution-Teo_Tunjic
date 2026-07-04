import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import type { Product } from "@/types";
import { Heart, RefreshCw } from "lucide-react";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductDetails() {
  useUser(); 
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const productId = id ? parseInt(id, 10) : null;

  const { data: product, isLoading: isLoadingProduct, isError } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is missing");
      const res = await axiosConfig.get<Product>(`/products/${productId}`);
      return res.data;
    },
    enabled: !!productId,
  });

  const { data: favorites = [], isLoading: isLoadingFavorites } = useQuery<Product[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await axiosConfig.get<Product[]>(API_ENDPOINTS.GET_FAVORITES || "/favorites");
      return res.data || [];
    },
  });

  const isFavorite = favorites.some((fav) => fav.id === productId);

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

  if (isLoadingProduct || isLoadingFavorites) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold">Product not found.</p>
        <Link to="/products" className="text-primary underline mt-2 inline-block">Back to products</Link>
      </div>
    );
  }
    if (!localStorage.getItem("token")) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-950" />;
    }

return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-12">
    <div className="container mx-auto p-6 max-w-4xl">
      
      <Link 
        to="/products" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition font-medium"
      >
        &larr; Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm">
        <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-950 rounded-lg overflow-hidden border">
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full">
              {product.category || "General"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-3 leading-tight">
              {product.title}
            </h1>
            <div className="mt-3">
              <Badge variant="secondary" className="text-xl font-bold px-3 py-1">
                {product.price.toFixed(2)} €
              </Badge>
            </div>
            <hr className="my-4 border-gray-200 dark:border-gray-800" />
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {product.description || "No description provided for this product."}
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <Button 
              onClick={() => toggleFavoriteMutation.mutate({ id: product.id, isFavorite })}
              disabled={toggleFavoriteMutation.isPending}
              variant="outline"
              className={`p-6 rounded-lg transition-all border ${
                isFavorite 
                  ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100 dark:bg-red-950/30 dark:border-red-900" 
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-500 dark:border-gray-800 dark:text-gray-400"
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

    </div>
  </div>
);
}