// TEST ORDERS - Paste vào Console (F12)

console.log('=== TESTING ORDERS SYSTEM ===\n');

// 1. Check Backend
console.log('1️⃣ Testing Backend Connection...');
fetch('http://localhost:5001/api/orders')
  .then(r => {
    console.log('   Response status:', r.status);
    return r.json();
  })
  .then(data => {
    console.log('   ✅ Backend is running');
    console.log('   📊 Orders in backend:', data.length);
    if (data.length > 0) {
      console.log('   Latest order:', data[0]);
    } else {
      console.log('   ⚠️ No orders in backend database');
    }
  })
  .catch(err => {
    console.error('   ❌ Backend ERROR:', err.message);
    console.log('   💡 Fix: cd backend/DelShop.API && dotnet run');
  });

// 2. Check LocalStorage
console.log('\n2️⃣ Checking LocalStorage...');
const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
console.log('   📋 Orders in localStorage:', localOrders.length);
if (localOrders.length > 0) {
  console.log('   Orders:', localOrders);
} else {
  console.log('   ⚠️ No orders in localStorage');
}

// 3. Check Cart
console.log('\n3️⃣ Checking Cart...');
const cartItems = JSON.parse(localStorage.getItem('cartItems') || '{}');
const itemsInCart = Object.keys(cartItems).filter(k => cartItems[k] > 0);
console.log('   🛒 Items in cart:', itemsInCart.length);
if (itemsInCart.length > 0) {
  console.log('   Cart items:', cartItems);
} else {
  console.log('   ⚠️ Cart is empty - Add items before creating order');
}

// 4. Check Food List
console.log('\n4️⃣ Checking Food List...');
const foodList = JSON.parse(localStorage.getItem('food_list') || '[]');
console.log('   🍔 Food items loaded:', foodList.length);
if (foodList.length > 0) {
  const sample = foodList[0];
  console.log('   Sample item:', {
    name: sample.name,
    id: sample.id,
    _id: sample._id,
    price: sample.price
  });
  
  if (!sample.id && !sample._id) {
    console.error('   ❌ Food items missing ID field!');
  } else {
    console.log('   ✅ Food items have ID');
  }
} else {
  console.log('   ⚠️ No food items loaded');
}

// 5. Summary
console.log('\n=== SUMMARY ===');
console.log('Backend:', '?');
console.log('LocalStorage orders:', localOrders.length);
console.log('Cart items:', itemsInCart.length);
console.log('Food list:', foodList.length);

console.log('\n💡 Next steps:');
if (itemsInCart.length === 0) {
  console.log('   1. Add items to cart (Home → Menu → Click +)');
  console.log('   2. Go to Cart → PROCEED TO CHECKOUT');
  console.log('   3. Click PLACE ORDER');
} else {
  console.log('   1. Go to Cart');
  console.log('   2. PROCEED TO CHECKOUT');
  console.log('   3. PLACE ORDER');
  console.log('   4. Watch console for order creation logs');
}

console.log('\n=== TEST COMPLETE ===');
