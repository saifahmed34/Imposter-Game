using Microsoft.EntityFrameworkCore;
using ImposterGame.Domain.Entites;

namespace ImpostorGame.Infrastructure.Persistence.DbContexts
{
    public class ImpostorGameDbContext :DbContext
    {
        public ImpostorGameDbContext(DbContextOptions<ImpostorGameDbContext> options) : base(options)
        {
        }

        public DbSet<GameRoom> GameRooms { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Vote> Votes { get; set; }
    }
}
