using ImposterGame.API.Hubs;
using ImposterGame.Application.Interfaces.Repositories;
using ImposterGame.Application.Interfaces.Services;
using ImposterGame.Application.Services;
using ImposterGame.Infrastructure.Persistence;
using ImposterGame.Infrastructure.Persistence.Repositories;
using ImpostorGame.Infrastructure.Words;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ImposterGameDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddDbContext<ImposterGameDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("local")));

builder.Services.AddScoped<IGameRoomRepository, GameRoomRepository>();
builder.Services.AddSingleton<IWordProvider, WordProvider>();
builder.Services.AddSingleton<IPlayerConnectionTracker, PlayerConnectionTracker>();
builder.Services.AddScoped<IGameService, GameService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("NetlifyPolicy",
        policy =>
        {
            // Replace with your actual Netlify app URL
            policy.WithOrigins("https://impostergamees.netlify.app")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ImposterGameDbContext>();


    db.Database.Migrate();

}
app.UseRouting();

app.UseCors("NetlifyPolicy");


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHub<GameHub>("/gamehub");
//app.UseDefaultFiles();
//app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
