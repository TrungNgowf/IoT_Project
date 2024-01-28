using System.ComponentModel;
using System.Data.SqlTypes;

abstract public class Entity
{
    public long Id { get; set; }
    public DateTime CreationTime { get; set; } = DateTime.Now;
    public DateTime? LastModifiedTime { get; set; }
}