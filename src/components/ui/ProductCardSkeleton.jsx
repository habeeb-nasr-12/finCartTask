import { Card, Skeleton } from "antd";

export const ProductCardSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-6">Our Products</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="h-full">
          <Card className="h-full">
            <div>
              {" "}
              <Skeleton.Image className="w-full h-64" active />
            </div>
            <div className="mt-4">
              <Skeleton.Button className="w-16 h-6 mb-2" active size="small" />
              <Skeleton.Input className="w-full h-6 mb-2" active size="small" />
              <Skeleton.Input className="w-1/4 h-6 mb-2" active size="small" />
              <Skeleton paragraph={{ rows: 3 }} active />
              <Skeleton.Button
                className="w-full h-10 mt-4"
                active
                size="large"
              />
            </div>
          </Card>
        </div>
      ))}
    </div>
  </div>
);
