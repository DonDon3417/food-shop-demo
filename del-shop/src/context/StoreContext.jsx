import React, { createContext, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
    const [cart, setCart] = useState({});

    // Add item to cart
    const addToCart = (id) => {
        setCart(prev => {
            const newCart = { ...prev };
            newCart[id] = (newCart[id] || 0) + 1;
            return newCart;
        });
    };

    // Remove one item from cart
    const removeFromCart = (id) => {
        setCart(prev => {
            const newCart = { ...prev };
            if (newCart[id] > 1) {
                newCart[id] -= 1;
            } else {
                delete newCart[id];
            }
            return newCart;
        });
    };

    // Remove all of this item from cart
    const removeAllFromCart = (id) => {
        setCart(prev => {
            const newCart = { ...prev };
            delete newCart[id];
            return newCart;
        });
    };

    // Clear entire cart
    const clearCart = () => {
        setCart({});
    };

    // Get total cart amount
    const getTotalCartAmount = () => {
        let total = 0;
        Object.keys(cart).forEach(itemId => {
            const item = food_list.find(product => product._id === itemId);
            if (item && cart[itemId] > 0) {
                total += item.price * cart[itemId];
            }
        });
        return total;
    };

    // Get total items count
    const getTotalItemsCount = () => {
        return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
    };

    // Check if cart has items
    const hasItems = () => {
        return Object.keys(cart).length > 0 && Object.values(cart).some(qty => qty > 0);
    };

    const contextValue = {
        food_list,
        cartItems: cart,
        addToCart,
        removeFromCart,
        removeAllFromCart,
        clearCart,
        getTotalCartAmount,
        getTotalItemsCount,
        hasItems
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;