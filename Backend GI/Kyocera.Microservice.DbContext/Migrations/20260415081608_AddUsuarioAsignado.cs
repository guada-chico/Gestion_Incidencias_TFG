using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kyocera.Microservice.DbContext.Migrations
{
    /// <inheritdoc />
    public partial class AddUsuarioAsignado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Prioridad",
                table: "Incidencias",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "Estado",
                table: "Incidencias",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaActualizacion",
                table: "Incidencias",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UsuarioAsignado",
                table: "Incidencias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaActualizacion",
                table: "Incidencias");

            migrationBuilder.DropColumn(
                name: "UsuarioAsignado",
                table: "Incidencias");

            migrationBuilder.AlterColumn<string>(
                name: "Prioridad",
                table: "Incidencias",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Estado",
                table: "Incidencias",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
