import { Button, Empty, Popconfirm } from "antd";
import { useCallback, useContext, useMemo } from "react";
import { CartContext } from "../../context/cart";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

export const CartItems = ({ onClose }) => {
  const { items, addItem, decreaseQuantity, totalAmount, removeItem } = useContext(CartContext);

  const handleIncrement = useCallback(
    (item) => {
      addItem({ ...item });
    },
    [addItem]
  );

  const handleDecrement = useCallback(
    (item) => {
      decreaseQuantity(item.id);
    },
    [decreaseQuantity]
  );

  const handleRemoveItem = useCallback(
    (itemId) => {
      removeItem(itemId);
    },
    [removeItem]
  );

  // Memoize the cart items rendering
  const renderCartItems = useMemo(() => {
    return items.map((item) => (
      <div
        key={item.id}
        className="flex items-center gap-3 py-2 border-b group"
      >
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-16 h-16 object-cover rounded"
        />
        <div className="flex-1">
          <h4 className="font-medium line-clamp-1">{item.title}</h4>
          <p className="text-sm text-gray-500">
            ${(item.price || 0).toFixed(2)} x {item.quantity}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => handleDecrement(item)}
            disabled={item.quantity <= 1}
          />
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleIncrement(item)}
          />
          <Popconfirm
            title="Remove item"
            description="Are you sure you want to remove this item?"
            onConfirm={() => handleRemoveItem(item.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Popconfirm>
        </div>
      </div>
    ));
  }, [items, handleDecrement, handleIncrement, handleRemoveItem]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[320px] max-w-[400px]">
      <h3 className="text-lg font-semibold mb-4">Shopping Cart</h3>
      {!items?.length ? (
        <Empty description="Your cart is empty" />
      ) : (
        <>
          <div className="max-h-[400px] overflow-y-auto">
            {renderCartItems}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Subtotal:</span>
              <span className="font-semibold">
                ${(totalAmount || 0).toFixed(2)}
              </span>
            </div>
            <Button type="primary" block onClick={onClose}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};