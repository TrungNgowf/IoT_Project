using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace iot_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddWindSpeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "WindSpeed",
                table: "SensorHistory",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WindSpeed",
                table: "SensorHistory");
        }
    }
}
