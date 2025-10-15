# Test Order Sync - Quick Guide

## ✅ Đã fix gì?

1. **PlaceOrder.jsx**: Dùng `OrderContext.addOrder()` thay vì axios trực tiếp
2. **OrderContext.jsx**: 
   - Fix item mapping (support productId, _id, id)
   - Gọi `await fetchOrders()` ngay sau khi tạo order
   - Better error handling
   - Validate items trước khi gửi

## 🧪 Test Steps

### Bước 1: Clear localStorage
```javascript
// F12 Console trong del-shop
localStorage.clear()
location.reload()
```

### Bước 2: Verify backend running
Mở: `http://localhost:5001/api/orders`
Kết quả: `[]` (empty array)

### Bước 3: Create order
1. Home → Explore Menu
2. Add Greek Salad (click +)
3. Cart → PROCEED TO CHECKOUT
4. Fill form:
   - First Name: Phạm
   - Last Name: Thành Đông
   - Email: pham@example.com
   - Street: 123 Main St
   - City: Hanoi
   - State: HN
   - Zip: 10000
   - Country: Vietnam
   - Phone: 0123456789
5. PROCEED TO PAYMENT → PLACE ORDER

### Bước 4: Check console logs

**Expected logs:**
```
🚀 Adding order to API...
Order data: {...}
📡 Sending to API: http://localhost:5001/api/Orders
✅ Order created successfully! Response: {...}
📊 Order ID: 1
🔄 Refreshing orders from backend after creation...
🔄 OrderContext - Fetching orders from backend...
📊 Total orders from backend: 1
✅ OrderContext - Processed orders for My Orders
💾 Syncing to localStorage...
```

### Bước 5: Verify My Orders
- Navigate to My Orders
- Order hiển thị NGAY LẬP TỨC
- No delay!

### Bước 6: Verify Admin
Open: `http://localhost:5174/orders`

**After max 3 seconds:**
- 🔔 "New Order!" badge
- 🔊 Beep sound
- ✨ Order highlighted (orange gradient)
- 🔢 Order count = 1

**Console logs:**
```
Auto-refreshing orders...
📡 Admin Orders - Raw API Response: [...]
🔔 1 new order(s) received!
✅ Processed Orders for Admin
```

## ✅ Success Criteria

- [ ] Order created without errors
- [ ] My Orders shows order immediately
- [ ] Admin shows order within 3 seconds
- [ ] Admin notification appears
- [ ] Beep sound plays
- [ ] Order highlighted in admin
- [ ] Console logs show proper flow
- [ ] Backend has order (check /api/orders)

## 🐛 If Still Not Working

### Check 1: Backend running?
```powershell
cd d:\Del-shop\backend\DelShop.API
dotnet run
```

### Check 2: Console errors?
F12 → Console tab → Look for red errors

### Check 3: Network tab
F12 → Network tab → Filter: XHR
- Should see POST to /api/orders (Status 200)
- Should see GET to /api/orders (Status 200)

### Check 4: Backend logs
Terminal running backend should show:
```
📡 POST /api/orders - Received order request
Customer: Phạm Thành Đông, Email: pham@example.com
Items count: 1
✅ Order created successfully! Order ID: 1
```

## 🔧 Quick Fixes

### Fix 1: Clear everything
```javascript
localStorage.clear()
sessionStorage.clear()
```

### Fix 2: Restart backend
```powershell
# Ctrl+C to stop
cd backend/DelShop.API
dotnet clean && dotnet build && dotnet run
```

### Fix 3: Hard refresh browsers
- Del-shop: Ctrl+Shift+R
- Admin: Ctrl+Shift+R

## 📞 Support

If still not working, check:
1. All 3 services running (backend, admin, del-shop)
2. Correct ports (5001, 5174, 5173)
3. No firewall blocking localhost
4. Browser console for errors
5. Backend terminal for errors
