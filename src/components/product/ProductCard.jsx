import { Card, Carousel, Button, Empty } from "antd";
import { ShoppingCartOutlined, CheckOutlined } from "@ant-design/icons";
import React, { useCallback, useContext, useState } from "react";
import PropTypes from "prop-types";
import { CartContext } from "../../context/cart.jsx";
import { formatPrice } from "../../lib/utils";

const getButtonStyles = (isInCart) =>
  `mt-auto w-full transition-all duration-200 ${
    isInCart ? "bg-green-50 text-green-600 border-green-600" : "hover:scale-105"
  }`;

export const ProductCard = React.memo(({ product }) => {
  const { title, price, description, category, images } = product;
  const { addItem, items } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);

  const isInCart = items?.some((item) => item.id === product.id);

  const handleAddItem = useCallback(() => {
    setIsAdding(true);
    addItem(product);
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  }, [addItem, product]);

  const renderImages = useCallback(() => {
    if (!images?.length) {
      return (
        <div className="h-64 bg-gray-100 flex items-center justify-center">
          <Empty description="No data" />
        </div>
      );
    }

    return images.length === 1 ? (
      <img src={images[0]} alt={title} className="w-full h-64 object-cover" />
    ) : (
      <Carousel autoplay className="bg-gray-100">
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="h-64">
            <img
              src={image}
              alt={`${title} - view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Carousel>
    );
  }, [images, title]);

  return (
    <Card hoverable className="h-full flex flex-col" cover={renderImages()}>
      <div className="flex flex-col h-full">
        <div className="mb-2">
          <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
            {category?.name}
          </span>
        </div>
        <div className="group cursor-pointer" onClick={() => setShowFullTitle(!showFullTitle)}>
          <h3 className={`text-lg font-medium mb-1 ${!showFullTitle ? 'line-clamp-1' : ''}`}>
            {title}
          </h3>
          <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {showFullTitle ? 'Show less' : 'Show more'}
          </span>
        </div>
        <p className="text-xl font-semibold text-blue-600 mb-2">
          {formatPrice(price)}
        </p>
        <div className="group cursor-pointer" onClick={() => setShowFullDescription(!showFullDescription)}>
          <p className={`text-gray-500 ${!showFullDescription ? 'line-clamp-2' : ''}`}>
            {description}
          </p>
          <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity mb-4">
            {showFullDescription ? 'Show less' : 'Show more'}
          </span>
        </div>
        <Button
          type={isInCart ? "default" : "primary"}
          icon={isInCart ? <CheckOutlined /> : <ShoppingCartOutlined />}
          size="large"
          className={getButtonStyles(isInCart)}
          onClick={handleAddItem}
          loading={isAdding}
          disabled={isInCart || isAdding}
        >
          {isAdding ? "Adding..." : isInCart ? "Added to Cart" : "Add to Cart"}
        </Button>
      </div>
    </Card>
  );
});

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};