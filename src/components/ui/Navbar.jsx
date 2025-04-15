import { Button, Input, Badge, Popover } from "antd";
import { useContext, useState } from "react";
import debounce from "lodash/debounce";
import {
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { CartContext } from "../../context/Cart.jsx";
import { CartItems } from "../cart/CartItems.jsx";

export const Navbar = ({ onSearch }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalQuantity } = useContext(CartContext);
  const handleSearch = debounce((value) => {
    onSearch(value);
  }, 300);
  const handleSearchInputChange = (e) => {
    setSearchVisible(true);
    handleSearch(e.target.value);
  };

  const handleCartClick = () => {
    setCartOpen(!cartOpen);
  };

  const handleCheckout = () => {
    setCartOpen(false);
  };

  return (
    <div className="sticky top-0 z-10 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex  items-center justify-between">
          <div className="flex gap-x-3">
            <Button
              type="text"
              icon={<MenuOutlined />}
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600 mr-2">
                <span className="text-black">fincart</span>
                {"  "}task
              </div>
            </div>
          </div>
          <div className="hidden md:block flex-1 mx-4 max-w-lg">
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={(e) => handleSearchInputChange(e)}
              className="rounded-full"
              allowClear
              size="large"
            />
          </div>
          <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-1">
            <Popover
              content={<CartItems onClose={() => setCartOpen(false)} />}
              trigger="click"
              open={cartOpen}
              onOpenChange={setCartOpen}
              placement="bottomRight"
              arrow={false}
            >
              <Badge count={totalQuantity} color="#1677ff">
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined className="text-xl" />}
                  onClick={handleCartClick}
                  className="flex items-center justify-center hover:bg-gray-100 rounded-full h-10 w-10"
                />
              </Badge>
            </Popover>
          </div>
          </div>
        </div>
        {searchVisible && (
          <div className="md:hidden py-3">
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={(e) => handleSearchInputChange(e)}
              className="rounded-full"
              allowClear
              autoFocus
              size="large"
            />
          </div>
        )}
      </div>
    </div>
  );
};
