import React, { useContext } from 'react';
import './AddToCart.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const AddToCart = ({ productId }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
    
    const quantity = cartItems[productId] || 0;

    return (
        <div className='add-to-cart-container'>
            {quantity === 0 ? (
                <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(productId)}
                >
                    <img src={assets.add_icon_white} alt="Add" />
                    <span>Add to Cart</span>
                </button>
            ) : (
                <div className='quantity-controls'>
                    <button 
                        className='quantity-btn decrease'
                        onClick={() => removeFromCart(productId)}
                    >
                        <img src={assets.remove_icon_red} alt="Remove" />
                    </button>
                    <span className='quantity-display'>{quantity}</span>
                    <button 
                        className='quantity-btn increase'
                        onClick={() => addToCart(productId)}
                    >
                        <img src={assets.add_icon_green} alt="Add" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddToCart;
