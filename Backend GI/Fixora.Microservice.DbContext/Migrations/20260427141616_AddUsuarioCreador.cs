using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fixora.Microservice.DbContext.Migrations
{
    /// <inheritdoc />
    public partial class AddUsuarioCreador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UsuarioCreador",
                table: "Incidencias",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsuarioCreador",
                table: "Incidencias");
        }
    }
}
