import { createContext, useReducer, useMemo } from "react";
import PropTypes from "prop-types";
import { getLocalStorageItem, updateLocalStorage } from "../lib/utils";

export const CartContext = createContext();

const initialState = {
  items: getLocalStorageItem("cartItems", JSON.parse) || [],
  totalAmount: getLocalStorageItem("cartTotalAmount", parseFloat) || 0,
  totalQuantity: getLocalStorageItem("cartTotalQuantity", parseInt) || 0,
};

const cartReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.item.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        console.log("i got here");
        updatedItems[existingItemIndex].quantity =
          updatedItems[existingItemIndex].quantity + 1;
        newState = {
          ...state,
          items: updatedItems,
          totalQuantity: state.totalQuantity + 1,
          totalAmount:
            state.totalAmount + updatedItems[existingItemIndex].price,
        };
      } else {
        const newItem = {
          ...action.item,
          quantity: 1,
        };
        newState = {
          ...state,
          items: [...state.items, newItem],
          totalQuantity: state.totalQuantity + 1,
          totalAmount: state.totalAmount + newItem.price,
        };
      }
      break;
    }

    case "REMOVE_ITEM": {
      const removedItem = state.items.find((item) => item.id === action.id);
      if (!removedItem) return state;

      newState = {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
        totalQuantity: state.totalQuantity - removedItem.quantity,
        totalAmount:
          state.totalAmount <= 0
            ? state.totalAmount
            : state.totalAmount - removedItem.price * removedItem.quantity,
      };
      break;
    }
    case "DECREASE_QUANTITY": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        const currentItem = updatedItems[existingItemIndex];

        if (currentItem.quantity === 1) {
          return cartReducer(state, { type: "REMOVE_ITEM", id: action.id });
        }

        currentItem.quantity -= 1;
        newState = {
          ...state,
          items: updatedItems,
          totalQuantity: state.totalQuantity - 1,
          totalAmount: state.totalAmount - currentItem.price,
        };
      } else {
        return state;
      }
      break;
    }

    case "CLEAR_CART":
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartTotalAmount");
      localStorage.removeItem("cartTotalQuantity");
      newState = {
        items: [],
        totalAmount: 0,
        totalQuantity: 0,
      };
      break;

    default:
      return state;
  }
  updateLocalStorage("cartItems", newState.items);
  updateLocalStorage("cartTotalAmount", newState.totalAmount);
  updateLocalStorage("cartTotalQuantity", newState.totalQuantity);

  return newState;
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => {
    if (!item?.id || !item?.price) {
      console.error(
        "Invalid item format. Item must have id and price properties."
      );
      return;
    }
    dispatch({ type: "ADD_ITEM", item });
  };

  const removeItem = (id) => {
    if (!id) {
      console.error("Invalid id provided for item removal");
      return;
    }
    dispatch({ type: "REMOVE_ITEM", id });
  };

  const decreaseQuantity = (id) => {
    if (!id) {
      console.error("Invalid id provided for quantity decrease");
      return;
    }
    dispatch({ type: "DECREASE_QUANTITY", id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const cartContext = useMemo(
    () => ({
      items: cart.items,
      totalAmount: cart.totalAmount,
      totalQuantity: cart.totalQuantity,
      addItem,
      removeItem,
      decreaseQuantity,
      clearCart,
    }),
    [cart.items, cart.totalAmount, cart.totalQuantity]
  );

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
