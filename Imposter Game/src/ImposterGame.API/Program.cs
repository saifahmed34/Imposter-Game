using ImposterGame.API.Hubs;
using ImposterGame.Application.Interfaces.Repositories;
using ImposterGame.Application.Interfaces.Services;
using ImposterGame.Application.Services;
using ImposterGame.Infrastructure.Persistence;
using ImposterGame.Infrastructure.Persistence.Repositories;
using ImpostorGame.Infrastructure.Words;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ImposterGameDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IGameRoomRepository, GameRoomRepository>();
builder.Services.AddSingleton<IWordProvider, WordProvider>();
builder.Services.AddScoped<IGameService, GameService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials().SetIsOriginAllowed(origin => true);
    });
});

var app = builder.Build();
app.UseRouting();

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHub<GameHub>("/gamehub");
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
