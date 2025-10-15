import React from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import AddToCart from '../AddToCart/AddToCart'

const FoodItem = ({id, name, price, description, image}) => {
  const product = { id, name, price, description, image }

  return (
    <div className='food-item'>
      <div className="food-item-image-container">
        <img className='food-item-image' src={image} alt="" />
      </div>
      <div className="food-item-infor">
        <div className="food-item-name-rating">
            <p>{name}</p>
            <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${Number(price).toFixed(2)}</p>
        <AddToCart productId={id} product={product} />
      </div>
    </div>
  )
}

export default FoodItem
