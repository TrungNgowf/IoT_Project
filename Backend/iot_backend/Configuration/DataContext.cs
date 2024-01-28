using iot_backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace iot_backend.Configuration
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        public DbSet<SwitchHistory> SwitchHistory { get; set; }
        public DbSet<SensorHistory> SensorHistory { get; set; }
    }
}
