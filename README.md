<img width="1846" height="926" alt="image" src="https://github.com/user-attachments/assets/d5f9ba98-6a79-497c-b869-82a58769d861" />

# Del-Shop - Hệ thống Đặt Đồ Ăn Trực Tuyến
Dự án **Del-Shop** là một hệ thống đặt đồ ăn trực tuyến hoàn chỉnh với 3 phần chính: Website khách hàng, Admin Panel và Backend API.
## Tổng quan dự án
Del-Shop là một ứng dụng web full-stack cho phép:
- **Khách hàng**: Xem menu, đặt món ăn, thanh toán và theo dõi đơn hàng
- **Quản trị viên**: Quản lý sản phẩm, xem và cập nhật trạng thái đơn hàng
- **Hệ thống**: Xử lý đơn hàng real-time với database in-memory
## Công nghệ sử dụng
### Frontend (del-shop - Website khách hàng)
- **React 19.1.1** - UI Framework
- **React Router DOM 7.9.3** - Routing
- **Axios 1.12.2** - HTTP Client
- **Vite 7.1.7** - Build tool
- **Context API** - State management (AuthContext, OrderContext)

### Admin Panel
- **React 18.2.0** - UI Framework
- **React Router DOM 6.8.1** - Routing
- **Axios 1.6.0** - HTTP Client
- **Vite 5.0.8** - Build tool

### Backend API
- **ASP.NET Core 8.0** - Web API Framework
- **Entity Framework Core 8.0** - ORM
- **In-Memory Database** - Lưu trữ dữ liệu tạm thời
- **Swagger** - API Documentation

## Tính năng nổi bật
- Real-time Order Management - Cập nhật trạng thái đơn hàng ngay lập tức
- Authentication System - Hệ thống đăng nhập/đăng ký
- Shopping Cart - Giỏ hàng với Context API

