using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OLProject.Migrations
{
    /// <inheritdoc />
    public partial class wktUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ParcelWkt",
                table: "Parcels",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParcelWkt",
                table: "Parcels");
        }
    }
}
