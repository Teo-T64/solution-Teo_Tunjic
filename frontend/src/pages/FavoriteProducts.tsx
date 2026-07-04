import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import type { Product } from "@/types";
import { Link } from "react-router-dom";
import { Trash2, Heart, RefreshCw } from "lucide-react";
import useUser from "@/hooks/useUser";

export default function FavoriteProducts() {
  useUser();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery<Product[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await axiosConfig.get<Product[]>(API_ENDPOINTS.GET_FAVORITES);
      return res.data || [];
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (productId: number | string) => {
      await axiosConfig.delete(API_ENDPOINTS.OPERATE_FAVORITE(Number(productId)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!localStorage.getItem("token")) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950" />;
  }
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart className="text-red-500 fill-red-500" /> My Favorite Products
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>You haven't added any favorites yet.</p>
          <Link to="/" className="text-primary underline mt-2 inline-block">Go back to shop</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between">
              <div>
                <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-cover rounded-md mb-4" />
                <h2 className="font-semibold text-lg line-clamp-1">{product.title}</h2>
                <p className="text-gray-600 font-bold mt-1">${product.price}</p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Link to={`/product/${product.id}`} className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md text-sm font-medium transition">
                  Details
                </Link>
                <button 
                  onClick={() => removeFavoriteMutation.mutate(product.id)}
                  disabled={removeFavoriteMutation.isPending}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}