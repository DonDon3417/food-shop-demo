# Del-Shop Admin Panel

Admin panel cho hệ thống quản lý Del-shop e-commerce được xây dựng bằng React + Vite.

## Tính năng

### 1. **Add Items** (+)
Thêm sản phẩm mới vào hệ thống:
- Upload ảnh sản phẩm (click vào khu vực upload)
- Nhập tên sản phẩm (Product name)
- Mô tả chi tiết (Product description)
- Chọn category: Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles
- Nhập giá (Product Price)
- Nút ADD để lưu sản phẩm

### 2. **List Items** (☰)
Xem và quản lý danh sách tất cả sản phẩm:
- Hiển thị dạng bảng: Image, Name, Category, Price, Action
- Nút "X" để xóa sản phẩm
- Tự động đồng bộ với backend API
- Hiển thị 32 food items từ del-shop

### 3. **Orders** (☑)
Theo dõi và quản lý đơn hàng:
- Hiển thị orders mới nhất từ khách hàng
- Thông tin: Items + số lượng, Customer name, Address, Phone, Amount
- **Chỉnh sửa status** qua dropdown:
  - `Food Processing` - Đang xử lý
  - `Out for delivery` - Đang giao hàng
  - `Delivered` - Đã giao
- Tự động refresh mỗi 3 giây để cập nhật orders mới
- Nút "Refresh Orders" để cập nhật thủ công
- Status tự động đồng bộ với del-shop frontend

## Cấu trúc dự án

```
admin/
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   └── Sidebar/
│   ├── pages/
│   │   ├── Add/
│   │   ├── List/
│   │   └── Orders/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Cách chạy

1. **Cài đặt dependencies**:
   ```bash
   cd admin
   npm install
   ```

2. **Chạy development server**:
   ```bash
   npm run dev
   ```

3. **Truy cập admin panel**: `http://localhost:5174`

## Giao diện

**Design Philosophy:**
- Giao diện fit trong 1 trang, không cần scroll ngang
- Layout responsive và clean
- Color scheme: Tomato (#ff6347) primary color
- Modern card-based design

**Components:**
- **Navbar**: Logo "Tomato." + Admin Panel subtitle
- **Sidebar**: Navigation menu với icons đơn giản
- **Main Content**: Tự động điều chỉnh theo nội dung
- **Add Items**: Form layout gọn gàng với upload image preview
- **List Items**: Table với image thumbnails
- **Orders**: Card-based layout với parcel icon lớn

## Kết nối Backend

Admin panel kết nối với Del-shop API backend trên **http://localhost:5001**

### API Endpoints

**Products:**
- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/products` - Thêm sản phẩm mới
- `DELETE /api/products/{id}` - Xóa sản phẩm

**Orders:**
- `GET /api/orders` - Lấy danh sách orders
- `PUT /api/orders/{id}/status` - Cập nhật status

### Khởi động Backend
```bash
cd backend/DelShop.API
dotnet run
```

Backend sẽ chạy trên: http://localhost:5001

## Công nghệ sử dụng

- **React 18**
- **Vite** (build tool)
- **React Router** (routing)
- **CSS Modules** (styling)
- **Axios** (HTTP client)
