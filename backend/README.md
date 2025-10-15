# Del-Shop Backend API

Backend API cho ứng dụng e-commerce Del-Shop được xây dựng bằng ASP.NET Core Web API.

## Tính năng

- **Products API**: Quản lý sản phẩm (CRUD operations)
- **Cart API**: Quản lý giỏ hàng theo session
- **Orders API**: Quản lý đơn hàng và xử lý thanh toán
- **In-Memory Database**: Sử dụng Entity Framework với In-Memory database
- **CORS**: Đã cấu hình để kết nối với React frontend
- **Swagger**: API documentation tự động

## Cấu trúc dự án

```
DelShop.API/
├── Controllers/
│   ├── ProductsController.cs
│   ├── CartController.cs
│   └── OrdersController.cs
├── Models/
│   ├── Product.cs
│   ├── CartItem.cs
│   └── Order.cs
├── Data/
│   ├── DelShopContext.cs
│   └── SeedData.cs
├── Program.cs
└── DelShop.API.csproj
```

## API Endpoints

### Products
- `GET /api/products` - Lấy tất cả sản phẩm
- `GET /api/products/{id}` - Lấy sản phẩm theo ID
- `GET /api/products/category/{category}` - Lấy sản phẩm theo danh mục
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/{id}` - Cập nhật sản phẩm
- `DELETE /api/products/{id}` - Xóa sản phẩm

### Cart
- `GET /api/cart/{sessionId}` - Lấy giỏ hàng theo session
- `POST /api/cart` - Thêm sản phẩm vào giỏ hàng
- `PUT /api/cart/{id}` - Cập nhật số lượng sản phẩm
- `DELETE /api/cart/{id}` - Xóa sản phẩm khỏi giỏ hàng
- `DELETE /api/cart/clear/{sessionId}` - Xóa toàn bộ giỏ hàng

### Orders
- `GET /api/orders` - Lấy tất cả đơn hàng
- `GET /api/orders/{id}` - Lấy đơn hàng theo ID
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/{id}/status` - Cập nhật trạng thái đơn hàng
- `DELETE /api/orders/{id}` - Xóa đơn hàng

## Cách chạy

1. **Cài đặt .NET 8 SDK** nếu chưa có
2. **Navigate to backend directory**:
   ```bash
   cd backend/DelShop.API
   ```
3. **Restore packages**:
   ```bash
   dotnet restore
   ```
4. **Run the application**:
   ```bash
   dotnet run
   ```
5. **Truy cập API**:
   - API endpoint: `http://localhost:5001`
   - Swagger UI: `http://localhost:5001/swagger`
   - Hoặc dùng HTTPS: `https://localhost:5003/swagger` (cần chạy với profile "https")

## Dữ liệu mẫu

API sẽ tự động tạo dữ liệu mẫu khi khởi động, bao gồm:
- 6 sản phẩm mẫu (Electronics, Fashion, Accessories)
- Các sản phẩm có thông tin đầy đủ: tên, mô tả, giá, hình ảnh, danh mục, tồn kho

## Kết nối với Frontend

Backend đã được cấu hình CORS để kết nối với React frontend chạy trên:
- `http://localhost:5173` (Del-shop - Vite dev server)
- `http://localhost:5174` (Admin - Vite dev server)
- `http://localhost:3000` (Create React App)

**Lưu ý**: 
- API mặc định chạy trên `http://localhost:5001`
- Frontend đã được cấu hình để kết nối với port 5001
- Nếu muốn dùng HTTPS, chạy với profile "https": `dotnet run --launch-profile https` (sẽ dùng port 5002 cho http và 5003 cho https)

## Công nghệ sử dụng

- **ASP.NET Core 8.0**
- **Entity Framework Core** với In-Memory Database
- **Swagger/OpenAPI** cho documentation
- **CORS** cho cross-origin requests
