using DelShop.API.Data;
using DelShop.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DelShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly DelShopContext _context;

        public CartController(DelShopContext context)
        {
            _context = context;
        }

        // GET: api/cart/{sessionId}
        [HttpGet("{sessionId}")]
        public async Task<ActionResult<IEnumerable<CartItem>>> GetCartItems(string sessionId)
        {
            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.SessionId == sessionId)
                .ToListAsync();

            return cartItems;
        }

        // POST: api/cart
        [HttpPost]
        public async Task<ActionResult<CartItem>> AddToCart(AddToCartRequest request)
        {
            var existingCartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.SessionId == request.SessionId && c.ProductId == request.ProductId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += request.Quantity;
                await _context.SaveChangesAsync();
                return Ok(existingCartItem);
            }

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                return NotFound("Product not found");
            }

            var cartItem = new CartItem
            {
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                SessionId = request.SessionId
            };

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            // Load the product for the response
            await _context.Entry(cartItem)
                .Reference(c => c.Product)
                .LoadAsync();

            return CreatedAtAction("GetCartItems", new { sessionId = request.SessionId }, cartItem);
        }

        // PUT: api/cart/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, UpdateCartItemRequest request)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null)
            {
                return NotFound();
            }

            cartItem.Quantity = request.Quantity;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/cart/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null)
            {
                return NotFound();
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/cart/clear/{sessionId}
        [HttpDelete("clear/{sessionId}")]
        public async Task<IActionResult> ClearCart(string sessionId)
        {
            var cartItems = await _context.CartItems
                .Where(c => c.SessionId == sessionId)
                .ToListAsync();

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class AddToCartRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string SessionId { get; set; } = string.Empty;
    }

    public class UpdateCartItemRequest
    {
        public int Quantity { get; set; }
    }
}
