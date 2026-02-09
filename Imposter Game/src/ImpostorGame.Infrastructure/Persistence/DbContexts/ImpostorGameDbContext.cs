using Microsoft.EntityFrameworkCore;
using ImposterGame.Domain.Entites;

namespace ImposterGame.Infrastructure.Persistence
{
    public class ImposterGameDbContext : DbContext
    {
        public ImposterGameDbContext(DbContextOptions<ImposterGameDbContext> options)
            : base(options)
        {
        }

        public DbSet<GameRoom> GameRooms { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Vote> Votes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // GameRoom → Players
            modelBuilder.Entity<GameRoom>()
                .HasMany(r => r.Players)
                .WithOne(p => p.Room)
                .HasForeignKey(p => p.RoomId)
                .OnDelete(DeleteBehavior.Cascade);

            // GameRoom → Votes
            modelBuilder.Entity<GameRoom>()
                .HasMany(r => r.Votes)
                .WithOne(v => v.Room)
                .HasForeignKey(v => v.RoomId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
