import React, { useState } from 'react'
import './Add.css'

const Add = () => {
  const [image, setImage] = useState(null)
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad"
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", Number(data.price))
    formData.append("category", data.category)
    formData.append("image", image)

    try {
      // TODO: Send to backend API
      console.log('Product data:', data)
      alert('Product added successfully!')
      
      // Reset form
      setData({
        name: "",
        description: "",
        price: "",
        category: "Salad"
      })
      setImage(null)
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Error adding product')
    }
  }

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <div className="upload-area">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Preview" className="preview-img" />
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">📷</div>
                  <p>Upload</p>
                </div>
              )}
            </div>
          </label>
          <input 
            onChange={(e) => setImage(e.target.files[0])} 
            type="file" 
            id="image" 
            hidden 
            required 
          />
        </div>
        
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input 
            onChange={onChangeHandler} 
            value={data.name} 
            type="text" 
            name='name' 
            placeholder='Type here' 
            required
          />
        </div>
        
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea 
            onChange={onChangeHandler} 
            value={data.description} 
            name="description" 
            rows="6" 
            placeholder='Write content here' 
            required
          ></textarea>
        </div>
        
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input 
              onChange={onChangeHandler} 
              value={data.price} 
              type="number" 
              name='price' 
              placeholder='$20' 
              required
            />
          </div>
        </div>
        
        <button type="submit" className='add-btn'>ADD</button>
      </form>
    </div>
  )
}

export default Add
