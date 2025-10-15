using DelShop.API.Models;

namespace DelShop.API.Data
{
    public static class SeedData
    {
        public static void Initialize(DelShopContext context)
        {
            if (context.Products.Any())
            {
                return; // Database has been seeded
            }

            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Green Papaya Salad with Beef Jerky", Description = "Refreshing green papaya salad with savory beef jerky, herbs and peanuts", Price = 4.99m, ImageUrl = "/food_1.png", Category = "Salad", Stock = 50 },
                new Product { Id = 2, Name = "Lotus Stem Salad", Description = "Crispy lotus stems with shrimp, pork, and Vietnamese herbs", Price = 5.99m, ImageUrl = "/food_2.png", Category = "Salad", Stock = 50 },
                new Product { Id = 3, Name = "Green Mango Salad", Description = "Tangy green mango with dried shrimp, herbs and fish sauce dressing", Price = 4.99m, ImageUrl = "/food_3.png", Category = "Salad", Stock = 50 },
                new Product { Id = 4, Name = "Shredded Chicken Salad", Description = "Tender shredded chicken with fresh herbs and crispy shallots", Price = 6.99m, ImageUrl = "/food_4.png", Category = "Salad", Stock = 50 },
                new Product { Id = 5, Name = "Vietnamese Grilled Pork Baguette", Description = "Crusty baguette with grilled pork, pickles and herbs", Price = 3.99m, ImageUrl = "/food_5.png", Category = "Banh Mi", Stock = 50 },
                new Product { Id = 6, Name = "Classic Pate Baguette", Description = "Traditional Vietnamese pate with ham, pickles and chili", Price = 2.99m, ImageUrl = "/food_6.png", Category = "Banh Mi", Stock = 50 },
                new Product { Id = 7, Name = "Grilled Pork Baguette", Description = "Char-grilled pork with fresh vegetables and herbs", Price = 3.99m, ImageUrl = "/food_7.png", Category = "Banh Mi", Stock = 50 },
                new Product { Id = 8, Name = "Vegetarian Baguette", Description = "Tofu, mushrooms and fresh vegetables in a baguette", Price = 2.99m, ImageUrl = "/food_8.png", Category = "Banh Mi", Stock = 50 },
                new Product { Id = 9, Name = "Coconut Ice Cream", Description = "Creamy coconut ice cream with tropical fruits and peanuts", Price = 3.99m, ImageUrl = "/food_9.png", Category = "Desserts", Stock = 50 },
                new Product { Id = 10, Name = "Vietnamese Milk Pudding", Description = "Silky milk pudding with caramel sauce", Price = 2.99m, ImageUrl = "/food_10.png", Category = "Desserts", Stock = 50 },
                new Product { Id = 11, Name = "Yogurt with Black Sticky Rice", Description = "Creamy yogurt with sweet black sticky rice", Price = 3.49m, ImageUrl = "/food_11.png", Category = "Desserts", Stock = 50 },
                new Product { Id = 12, Name = "Sweet Black Bean Soup", Description = "Warm black bean soup with coconut milk", Price = 2.49m, ImageUrl = "/food_12.png", Category = "Desserts", Stock = 50 }
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
