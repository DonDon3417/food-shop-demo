using DelShop.API.Data;
using DelShop.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace DelShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly DelShopContext _context;

        public OrdersController(DelShopContext context)
        {
            _context = context;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<object>> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                return Ok(new List<object>()); // Return empty array instead of 404
            }

            var result = orders.Select(order => new
            {
                id = order.Id,
                customerName = !string.IsNullOrWhiteSpace(order.CustomerName)
                    ? order.CustomerName
                    : ($"{order.FirstName} {order.LastName}").Trim(),
                customerEmail = order.CustomerEmail,
                customerPhone = order.CustomerPhone,
                phone = order.Phone,
                totalAmount = order.TotalAmount,
                status = order.Status,
                orderDate = order.OrderDate,
                street = order.Street,
                city = order.City,
                state = order.State,
                country = order.Country,
                zipCode = order.ZipCode,
                address = new
                {
                    street = order.Street,
                    city = order.City,
                    state = order.State,
                    country = order.Country,
                    zipCode = order.ZipCode
                },
                orderItems = order.OrderItems.Select(oi => new
                {
                    productId = oi.ProductId,
                    productName = oi.ProductName,
                    quantity = oi.Quantity,
                    price = oi.Price
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        // GET: api/orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            var result = new
            {
                id = order.Id,
                customerName = !string.IsNullOrWhiteSpace(order.CustomerName)
                    ? order.CustomerName
                    : ($"{order.FirstName} {order.LastName}").Trim(),
                customerEmail = order.CustomerEmail,
                totalAmount = order.TotalAmount,
                status = order.Status,
                orderDate = order.OrderDate,
                street = order.Street,
                city = order.City,
                state = order.State,
                country = order.Country,
                zipCode = order.ZipCode,
                phone = order.Phone,
                orderItems = order.OrderItems.Select(oi => new
                {
                    productId = oi.ProductId,
                    productName = oi.ProductName,
                    quantity = oi.Quantity,
                    price = oi.Price
                })
            };

            return Ok(result);
        }

        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<object>> CreateOrder([FromBody] CreateOrderRequest request)
        {
            if (request == null)
            {
                Console.WriteLine("❌ POST /api/orders - Request body is null");
                return BadRequest(new { success = false, message = "Request body is required" });
            }

            Console.WriteLine($"📡 POST /api/orders - Received order request:");
            Console.WriteLine($"Customer: {request.CustomerName}, Email: {request.CustomerEmail}");
            Console.WriteLine($"Items count: {request.Items?.Count ?? 0}");
            Console.WriteLine($"Full request: {System.Text.Json.JsonSerializer.Serialize(request)}");

            // Validate required fields
            if (string.IsNullOrWhiteSpace(request.CustomerName) && string.IsNullOrWhiteSpace(request.FirstName) && string.IsNullOrWhiteSpace(request.LastName))
            {
                return BadRequest(new { success = false, message = "Customer name is required" });
            }

            if (string.IsNullOrWhiteSpace(request.Phone) && string.IsNullOrWhiteSpace(request.CustomerPhone))
            {
                return BadRequest(new { success = false, message = "Phone number is required" });
            }

            if (string.IsNullOrWhiteSpace(request.Street) || string.IsNullOrWhiteSpace(request.City) || string.IsNullOrWhiteSpace(request.Country))
            {
                return BadRequest(new { success = false, message = "Address information is incomplete" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                if (request.Items == null || !request.Items.Any())
                {
                    return BadRequest(new { success = false, message = "No items in the order" });
                }
                // Create delivery address from components
                var deliveryAddress = $"{request.Street}, {request.City}, {request.State}, {request.Country}";
                
                // Calculate total amount
                var totalAmount = request.Items.Sum(i => i.Quantity * i.Price);

                var order = new Order
                {
                    CustomerName = !string.IsNullOrEmpty(request.FirstName) || !string.IsNullOrEmpty(request.LastName)
                        ? $"{request.FirstName} {request.LastName}".Trim()
                        : request.CustomerName ?? "Guest Customer",
                    CustomerEmail = request.CustomerEmail ?? "guest@example.com",
                    CustomerPhone = request.CustomerPhone ?? request.Phone ?? "0000000000",
                    DeliveryAddress = deliveryAddress,
                    Status = request.Status ?? "Food Processing",
                    FirstName = request.FirstName ?? "Guest",
                    LastName = request.LastName ?? "Customer",
                    Street = request.Street ?? "Not specified",
                    City = request.City ?? "Not specified",
                    State = request.State ?? "Not specified",
                    Country = request.Country ?? "Vietnam",
                    ZipCode = request.ZipCode ?? "000000",
                    Phone = request.CustomerPhone ?? request.Phone ?? "0000000000",
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = totalAmount,
                    SessionId = request.SessionId ?? Guid.NewGuid().ToString()
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Create order items
                var orderItems = new List<OrderItem>();
                foreach (var item in request.Items)
                {
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        ProductName = item.ProductName ?? $"Product {item.ProductId}",
                        Quantity = item.Quantity > 0 ? item.Quantity : 1,
                        Price = item.Price > 0 ? item.Price : 0
                    };
                    orderItems.Add(orderItem);
                }

                _context.OrderItems.AddRange(orderItems);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new 
                { 
                    success = true,
                    message = "Order created successfully",
                    orderId = order.Id,
                    customerName = order.CustomerName,
                    status = order.Status,
                    totalAmount = order.TotalAmount,
                    orderDate = order.OrderDate,
                    orderItems = orderItems.Select(oi => new
                    {
                        productId = oi.ProductId,
                        productName = oi.ProductName,
                        quantity = oi.Quantity,
                        price = oi.Price
                    })
                };

                Console.WriteLine($"✅ Order created successfully! Order ID: {order.Id}");
                Console.WriteLine($"Customer: {order.CustomerName}, Total: ${order.TotalAmount}");
                Console.WriteLine($"Items: {orderItems.Count}");
                return Ok(response);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error creating order: {ex}");
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = "An error occurred while processing your order",
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        // POST: api/orders/from-cart
        [HttpPost("from-cart")]
        public async Task<ActionResult<object>> CreateOrderFromCart(CreateOrderRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                if (string.IsNullOrEmpty(request.SessionId))
                {
                    return BadRequest("Session ID is required to fetch cart items");
                }

                // Get cart items for this session
                var cartItems = await _context.CartItems
                    .Include(c => c.Product)
                    .Where(c => c.SessionId == request.SessionId)
                    .ToListAsync();

                if (!cartItems.Any())
                {
                    return BadRequest("No items found in the cart");
                }

                // Calculate total amount from cart items
                decimal totalAmount = cartItems.Sum(item => item.Quantity * item.Product.Price);

                var order = new Order
                {
                    CustomerName = request.CustomerName ?? "Unknown",
                    CustomerEmail = request.CustomerEmail ?? "unknown@example.com",
                    CustomerPhone = request.CustomerPhone ?? "0000000000",
                    DeliveryAddress = request.DeliveryAddress ?? "No address",
                    Status = "Food Processing",
                    FirstName = request.FirstName ?? "Unknown",
                    LastName = request.LastName ?? "User",
                    Street = request.Street ?? "No street",
                    City = request.City ?? "No city",
                    State = request.State ?? "No state",
                    Country = request.Country ?? "Vietnam",
                    ZipCode = request.ZipCode ?? "00000",
                    Phone = request.CustomerPhone ?? request.Phone ?? "0000000000",
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = totalAmount,
                    SessionId = request.SessionId // Store the session ID with the order
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Convert cart items to order items
                var orderItems = cartItems.Select(cartItem => new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = cartItem.ProductId,
                    ProductName = cartItem.Product.Name,
                    Quantity = cartItem.Quantity,
                    Price = cartItem.Product.Price
                }).ToList();

                _context.OrderItems.AddRange(orderItems);
                
                // Clear the cart after creating the order
                _context.CartItems.RemoveRange(cartItems);
                
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Load the complete order with items for response
                return Ok(new { 
                    id = order.Id, 
                    message = "Order created successfully",
                    customerName = order.CustomerName,
                    status = order.Status,
                    totalAmount = order.TotalAmount,
                    orderItems = orderItems.Select(oi => new
                    {
                        productId = oi.ProductId,
                        productName = oi.ProductName,
                        quantity = oi.Quantity,
                        price = oi.Price
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, innerError = ex.InnerException?.Message });
            }
        }

        // DELETE: api/orders
        [HttpDelete]
        public async Task<IActionResult> DeleteAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ToListAsync();

            if (!orders.Any())
            {
                return NoContent();
            }

            var allItems = orders.SelectMany(o => o.OrderItems).ToList();
            if (allItems.Any())
            {
                _context.OrderItems.RemoveRange(allItems);
            }

            _context.Orders.RemoveRange(orders);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/orders/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<object>> UpdateOrder(int id, [FromBody] UpdateOrderRequest request)
        {
            Console.WriteLine($"📝 PUT /api/orders/{id} - Updating order...");
            
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);
                
            if (order == null)
            {
                Console.WriteLine($"❌ Order {id} not found");
                return NotFound(new { success = false, message = "Order not found" });
            }

            try
            {
                // Update customer information
                if (!string.IsNullOrEmpty(request.CustomerName))
                    order.CustomerName = request.CustomerName;
                if (!string.IsNullOrEmpty(request.CustomerEmail))
                    order.CustomerEmail = request.CustomerEmail;
                if (!string.IsNullOrEmpty(request.CustomerPhone))
                    order.CustomerPhone = request.CustomerPhone;
                
                // Update address
                if (!string.IsNullOrEmpty(request.Street))
                    order.Street = request.Street;
                if (!string.IsNullOrEmpty(request.City))
                    order.City = request.City;
                if (!string.IsNullOrEmpty(request.State))
                    order.State = request.State;
                if (!string.IsNullOrEmpty(request.Country))
                    order.Country = request.Country;
                if (!string.IsNullOrEmpty(request.ZipCode))
                    order.ZipCode = request.ZipCode;
                    
                // Update delivery address
                order.DeliveryAddress = $"{order.Street}, {order.City}, {order.State}, {order.Country}";
                
                // Update status
                if (!string.IsNullOrEmpty(request.Status))
                    order.Status = request.Status;
                
                // Update phone
                if (!string.IsNullOrEmpty(request.Phone))
                    order.Phone = request.Phone;

                // Update items if provided
                if (request.Items != null && request.Items.Any())
                {
                    // Remove old items
                    _context.OrderItems.RemoveRange(order.OrderItems);
                    
                    // Add new items
                    var newOrderItems = request.Items.Select(item => new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        ProductName = item.ProductName ?? $"Product {item.ProductId}",
                        Quantity = item.Quantity > 0 ? item.Quantity : 1,
                        Price = item.Price > 0 ? item.Price : 0
                    }).ToList();
                    
                    _context.OrderItems.AddRange(newOrderItems);
                    
                    // Recalculate total amount
                    order.TotalAmount = newOrderItems.Sum(oi => oi.Quantity * oi.Price);
                }

                await _context.SaveChangesAsync();
                
                // Fetch updated order with items
                var updatedOrder = await _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == id);

                var response = new
                {
                    success = true,
                    message = "Order updated successfully",
                    order = new
                    {
                        id = updatedOrder.Id,
                        customerName = updatedOrder.CustomerName,
                        customerEmail = updatedOrder.CustomerEmail,
                        customerPhone = updatedOrder.CustomerPhone,
                        phone = updatedOrder.Phone,
                        street = updatedOrder.Street,
                        city = updatedOrder.City,
                        state = updatedOrder.State,
                        country = updatedOrder.Country,
                        zipCode = updatedOrder.ZipCode,
                        status = updatedOrder.Status,
                        totalAmount = updatedOrder.TotalAmount,
                        orderDate = updatedOrder.OrderDate,
                        orderItems = updatedOrder.OrderItems.Select(oi => new
                        {
                            productId = oi.ProductId,
                            productName = oi.ProductName,
                            quantity = oi.Quantity,
                            price = oi.Price
                        }).ToList()
                    }
                };

                Console.WriteLine($"✅ Order {id} updated successfully");
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error updating order {id}: {ex.Message}");
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = "An error occurred while updating the order",
                    error = ex.Message 
                });
            }
        }

        // PUT: api/orders/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, UpdateOrderStatusRequest request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            Console.WriteLine($"📝 Updating order {id} status to: {request.Status}");
            order.Status = request.Status;
            await _context.SaveChangesAsync();
            Console.WriteLine($"✅ Order {id} status updated");

            return NoContent();
        }

        // DELETE: api/orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class CreateOrderRequest
    {
        // Customer Information
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
        public string? CustomerPhone { get; set; }
        
        // Address Information
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Street { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? ZipCode { get; set; }
        public string? Phone { get; set; }
        
        // Order Information
        public string? SessionId { get; set; }
        public string? Status { get; set; }
        public List<OrderItemRequest> Items { get; set; } = new List<OrderItemRequest>();
        
        // For backward compatibility
        [JsonIgnore]
        public string? DeliveryAddress { get; set; }
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public int Quantity { get; set; } = 1;
        public decimal Price { get; set; }
        
        // Additional fields that might be sent from frontend
        public string? Image { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateOrderRequest
    {
        // Customer Information
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
        public string? CustomerPhone { get; set; }
        
        // Address Information
        public string? Street { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? ZipCode { get; set; }
        public string? Phone { get; set; }
        
        // Order Information
        public string? Status { get; set; }
        public List<OrderItemRequest>? Items { get; set; }
    }

    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}
