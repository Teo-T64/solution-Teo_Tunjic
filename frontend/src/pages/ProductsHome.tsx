import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import type { Product } from "@/types";
import axiosConfig from "../util/axiosConfig";
import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User2Icon, Heart, Search, ShoppingBag } from "lucide-react";
import { API_ENDPOINTS } from "@/util/apiEndpoints";
import useUser from "@/hooks/useUser";

function ProductsHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  useUser();

  const { user } = useApp();

  useEffect(() => {
    async function getProducts() {
      try {
        setIsLoading(true);
        const res = await axiosConfig.get<Product[]>(API_ENDPOINTS.GET_PRODUCTS);
        setProducts(res.data);
      } catch (error) {
        console.error("Greška pri dohvaćanju proizvoda:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            placeholder="Pretraži proizvode..."
            className="pl-9 w-full bg-gray-50 dark:bg-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium dark:border-gray-800 dark:bg-gray-900">
          <User2Icon size={18} className="text-gray-500" />
          <span className="hidden sm:inline text-gray-700 dark:text-gray-300">
            {user ? user.username : "Guest"}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12">
        
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">All Products</h2>
          <p className="text-sm text-gray-500">Discover</p>
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
        ) : filteredProducts.length === 0 ? (
          
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group relative flex flex-col justify-between overflow-hidden transition-all hover:shadow-md">
                
                <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-950">
                  <img
                    src={product.thumbnail || product.title}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500 dark:bg-black/50"
                  >
                    <Heart size={18} />
                  </Button>
                </div>

                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base font-semibold group-hover:text-primary">
                      {product.title}
                    </CardTitle>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                </CardHeader>

                <CardFooter className="p-4  pt-2 flex items-center justify-between mt-auto">
                  <Badge variant="secondary" className="text-base font-bold">
                    {product.price.toFixed(2)} €
                  </Badge>
                  <Button className="p-4" size="sm">View</Button>
                </CardFooter>

              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductsHome;