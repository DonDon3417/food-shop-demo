import React, { useEffect, useState } from 'react'
import './List.css'
import { productsAPI } from '../../services/api'

// Import ALL 32 food images
import food_1 from '../../assets/food_1.png'
import food_2 from '../../assets/food_2.png'
import food_3 from '../../assets/food_3.png'
import food_4 from '../../assets/food_4.png'
import food_5 from '../../assets/food_5.png'
import food_6 from '../../assets/food_6.png'
import food_7 from '../../assets/food_7.png'
import food_8 from '../../assets/food_8.png'
import food_9 from '../../assets/food_9.png'
import food_10 from '../../assets/food_10.png'
import food_11 from '../../assets/food_11.png'
import food_12 from '../../assets/food_12.png'
import food_13 from '../../assets/food_13.png'
import food_14 from '../../assets/food_14.png'
import food_15 from '../../assets/food_15.png'
import food_16 from '../../assets/food_16.png'
import food_17 from '../../assets/food_17.png'
import food_18 from '../../assets/food_18.png'
import food_19 from '../../assets/food_19.png'
import food_20 from '../../assets/food_20.png'
import food_21 from '../../assets/food_21.png'
import food_22 from '../../assets/food_22.png'
import food_23 from '../../assets/food_23.png'
import food_24 from '../../assets/food_24.png'
import food_25 from '../../assets/food_25.png'
import food_26 from '../../assets/food_26.png'
import food_27 from '../../assets/food_27.png'
import food_28 from '../../assets/food_28.png'
import food_29 from '../../assets/food_29.png'
import food_30 from '../../assets/food_30.png'
import food_31 from '../../assets/food_31.png'
import food_32 from '../../assets/food_32.png'

// Image mapping for ALL 32 items
const imageMap = {
  1: food_1, 2: food_2, 3: food_3, 4: food_4, 5: food_5, 6: food_6,
  7: food_7, 8: food_8, 9: food_9, 10: food_10, 11: food_11, 12: food_12,
  13: food_13, 14: food_14, 15: food_15, 16: food_16, 17: food_17, 18: food_18,
  19: food_19, 20: food_20, 21: food_21, 22: food_22, 23: food_23, 24: food_24,
  25: food_25, 26: food_26, 27: food_27, 28: food_28, 29: food_29, 30: food_30,
  31: food_31, 32: food_32
}

// Default food items (hiển thị ngay)
const defaultFoodItems = [
  // Salad (4 items)
  { _id: "1", name: "Greek salad", image: food_1, category: "Salad", price: 12 },
  { _id: "2", name: "Veg salad", image: food_2, category: "Salad", price: 18 },
  { _id: "3", name: "Clover Salad", image: food_3, category: "Salad", price: 16 },
  { _id: "4", name: "Chicken Salad", image: food_4, category: "Salad", price: 24 },
  // Rolls (4 items)
  { _id: "5", name: "Lasagna Rolls", image: food_5, category: "Rolls", price: 14 },
  { _id: "6", name: "Peri Peri Rolls", image: food_6, category: "Rolls", price: 12 },
  { _id: "7", name: "Chicken Rolls", image: food_7, category: "Rolls", price: 20 },
  { _id: "8", name: "Veg Rolls", image: food_8, category: "Rolls", price: 15 },
  // Deserts (4 items)
  { _id: "9", name: "Ripple Ice Cream", image: food_9, category: "Deserts", price: 14 },
  { _id: "10", name: "Fruit Ice Cream", image: food_10, category: "Deserts", price: 22 },
  { _id: "11", name: "Jar Ice Cream", image: food_11, category: "Deserts", price: 10 },
  { _id: "12", name: "Vanilla Ice Cream", image: food_12, category: "Deserts", price: 12 },
  // Sandwich (4 items)
  { _id: "13", name: "Chicken Sandwich", image: food_13, category: "Sandwich", price: 12 },
  { _id: "14", name: "Vegan Sandwich", image: food_14, category: "Sandwich", price: 18 },
  { _id: "15", name: "Grilled Sandwich", image: food_15, category: "Sandwich", price: 16 },
  { _id: "16", name: "Bread Sandwich", image: food_16, category: "Sandwich", price: 24 },
  // Cake (4 items)
  { _id: "17", name: "Cup Cake", image: food_17, category: "Cake", price: 14 },
  { _id: "18", name: "Vegan Cake", image: food_18, category: "Cake", price: 12 },
  { _id: "19", name: "Butterscotch Cake", image: food_19, category: "Cake", price: 20 },
  { _id: "20", name: "Sliced Cake", image: food_20, category: "Cake", price: 15 },
  // Pure Veg (4 items)
  { _id: "21", name: "Garlic Mushroom", image: food_21, category: "Pure Veg", price: 14 },
  { _id: "22", name: "Fried Cauliflower", image: food_22, category: "Pure Veg", price: 22 },
  { _id: "23", name: "Mix Veg Pulao", image: food_23, category: "Pure Veg", price: 10 },
  { _id: "24", name: "Rice Zucchini", image: food_24, category: "Pure Veg", price: 12 },
  // Pasta (4 items)
  { _id: "25", name: "Cheese Pasta", image: food_25, category: "Pasta", price: 12 },
  { _id: "26", name: "Tomato Pasta", image: food_26, category: "Pasta", price: 18 },
  { _id: "27", name: "Creamy Pasta", image: food_27, category: "Pasta", price: 16 },
  { _id: "28", name: "Chicken Pasta", image: food_28, category: "Pasta", price: 24 },
  // Noodles (4 items)
  { _id: "29", name: "Butter Noodles", image: food_29, category: "Noodles", price: 14 },
  { _id: "30", name: "Veg Noodles", image: food_30, category: "Noodles", price: 12 },
  { _id: "31", name: "Somen Noodles", image: food_31, category: "Noodles", price: 20 },
  { _id: "32", name: "Cooked Noodles", image: food_32, category: "Noodles", price: 15 }
]

const List = () => {
  // Hiển thị fallback data ngay lập tức
  const [list, setList] = useState(defaultFoodItems)

  const fetchList = async () => {
    try {
      const response = await productsAPI.getAll()
      if (response.data && response.data.length > 0) {
        const apiProducts = response.data.map(product => ({
          _id: product.id.toString(),
          name: product.name,
          image: imageMap[product.id] || food_1,
          category: product.category,
          price: product.price,
          description: product.description
        }))
        setList(apiProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // Keep using fallback data
      const allFoodItems = [
        // Salad (4 items)
        { _id: "1", name: "Greek salad", image: food_1, category: "Salad", price: 12 },
        { _id: "2", name: "Veg salad", image: food_2, category: "Salad", price: 18 },
        { _id: "3", name: "Clover Salad", image: food_3, category: "Salad", price: 16 },
        { _id: "4", name: "Chicken Salad", image: food_4, category: "Salad", price: 24 },
        // Rolls (4 items)
        { _id: "5", name: "Lasagna Rolls", image: food_5, category: "Rolls", price: 14 },
        { _id: "6", name: "Peri Peri Rolls", image: food_6, category: "Rolls", price: 12 },
        { _id: "7", name: "Chicken Rolls", image: food_7, category: "Rolls", price: 20 },
        { _id: "8", name: "Veg Rolls", image: food_8, category: "Rolls", price: 15 },
        // Deserts (4 items)
        { _id: "9", name: "Ripple Ice Cream", image: food_9, category: "Deserts", price: 14 },
        { _id: "10", name: "Fruit Ice Cream", image: food_10, category: "Deserts", price: 22 },
        { _id: "11", name: "Jar Ice Cream", image: food_11, category: "Deserts", price: 10 },
        { _id: "12", name: "Vanilla Ice Cream", image: food_12, category: "Deserts", price: 12 },
        // Sandwich (4 items)
        { _id: "13", name: "Chicken Sandwich", image: food_13, category: "Sandwich", price: 12 },
        { _id: "14", name: "Vegan Sandwich", image: food_14, category: "Sandwich", price: 18 },
        { _id: "15", name: "Grilled Sandwich", image: food_15, category: "Sandwich", price: 16 },
        { _id: "16", name: "Bread Sandwich", image: food_16, category: "Sandwich", price: 24 },
        // Cake (4 items)
        { _id: "17", name: "Cup Cake", image: food_17, category: "Cake", price: 14 },
        { _id: "18", name: "Vegan Cake", image: food_18, category: "Cake", price: 12 },
        { _id: "19", name: "Butterscotch Cake", image: food_19, category: "Cake", price: 20 },
        { _id: "20", name: "Sliced Cake", image: food_20, category: "Cake", price: 15 },
        // Pure Veg (4 items)
        { _id: "21", name: "Garlic Mushroom", image: food_21, category: "Pure Veg", price: 14 },
        { _id: "22", name: "Fried Cauliflower", image: food_22, category: "Pure Veg", price: 22 },
        { _id: "23", name: "Mix Veg Pulao", image: food_23, category: "Pure Veg", price: 10 },
        { _id: "24", name: "Rice Zucchini", image: food_24, category: "Pure Veg", price: 12 },
        // Pasta (4 items)
        { _id: "25", name: "Cheese Pasta", image: food_25, category: "Pasta", price: 12 },
        { _id: "26", name: "Tomato Pasta", image: food_26, category: "Pasta", price: 18 },
        { _id: "27", name: "Creamy Pasta", image: food_27, category: "Pasta", price: 16 },
        { _id: "28", name: "Chicken Pasta", image: food_28, category: "Pasta", price: 24 },
        // Noodles (4 items)
        { _id: "29", name: "Butter Noodles", image: food_29, category: "Noodles", price: 14 },
        { _id: "30", name: "Veg Noodles", image: food_30, category: "Noodles", price: 12 },
        { _id: "31", name: "Somen Noodles", image: food_31, category: "Noodles", price: 20 },
        { _id: "32", name: "Cooked Noodles", image: food_32, category: "Noodles", price: 15 }
      ]
      // Fallback data đã được set trong useState, không cần set lại
    }
  }

  const removeFood = async (foodId) => {
    try {
      await productsAPI.delete(foodId)
      setList(prev => prev.filter(item => item._id !== foodId))
      alert('Item removed successfully!')
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Error removing item')
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='list add flex-col'>
      <p className="list-title">All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
