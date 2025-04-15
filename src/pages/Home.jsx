import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/product/ProductCard";
import { ProductCardSkeleton } from "../components/ui/ProductCardSkeleton";
import { Pagination } from "antd";
import { ProductError } from "../components/ui/ProductError";
import { useState } from "react";
import { Navbar } from "../components/ui/Navbar";

const Home = () => {
  const [params, setParams] = useState({
    offset: 0,
    limit: 10,
    title: "",
  });
  const handleSearch = (searchValue) => {
    setParams({
      offset: 0, 
      limit: 10,
      title: searchValue,
    });
  };
  const { data: products, isLoading, isError } = useProducts(params);
  if (isError) return <ProductError />;

  return (
    <div>
      <div className="w-full">
        <Navbar onSearch={handleSearch} />
      </div>
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <ProductCardSkeleton />
        ) : products?.length > 0 ? (
          <div>
            <h1 className="text-center my-2 font-bold mb-6">Our Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="flex justify-end my-5">
              <Pagination
                className="mt-10"
                current={params.offset}
                pageSize={params.limit}
                total={62} // i get this from the api response length of products
                showSizeChanger={false}
                onChange={(page) => {
                  setParams({
                    ...params,
                    offset: page,
                  });
                }}
              />
            </div>
          </div>
        ) : (
          <div className="h-screen flex items-center justify-center">
            <p className="text-3xl text-gray-500 font-semibold">
              No products available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
