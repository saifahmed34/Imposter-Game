using ImposterGame.Application.Interfaces.Repositories;
using ImposterGame.Application.Interfaces.Services;
using ImposterGame.Infrastructure.Persistence.Repositories;
using ImpostorGame.Application.Services;
using ImpostorGame.Infrastructure.Words;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSingleton<IGameRoomRepository, InMemoryGameRoomRepository>();
builder.Services.AddSingleton<IWordProvider, WordProvider>();
builder.Services.AddSingleton<IGameService, GameService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
