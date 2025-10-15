using DelShop.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework with In-Memory database
builder.Services.AddDbContext<DelShopContext>(options =>
    options.UseInMemoryDatabase("DelShopDb"));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Add error handling
app.UseExceptionHandler("/error");
app.UseStatusCodePages();

// Enable routing
app.UseRouting();

// CORS must be after UseRouting and before UseEndpoints
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

// Map controllers with route attributes
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    
    // Health check endpoint
    endpoints.MapGet("/", async context =>
    {
        await context.Response.WriteAsync("DelShop API is running!");
    });
});

// Ensure database is created and seeded
using (var scope = app.Services.CreateScope())
{
    try 
    {
        var context = scope.ServiceProvider.GetRequiredService<DelShopContext>();
        Console.WriteLine("Ensuring database is created...");
        context.Database.EnsureCreated();
        Console.WriteLine("Seeding database...");
        SeedData.Initialize(context);
        Console.WriteLine("Database seeded successfully!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while seeding the database: {ex}");
    }
}

try
{
    Console.WriteLine("Starting web host...");
    Console.WriteLine($"Environment: {app.Environment.EnvironmentName}");
    Console.WriteLine($"Content root path: {app.Environment.ContentRootPath}");
    Console.WriteLine($"Web root path: {app.Environment.WebRootPath}");
    
    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"Host terminated unexpectedly: {ex}");
    throw;
}
