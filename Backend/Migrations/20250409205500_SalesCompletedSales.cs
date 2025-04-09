using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class SalesCompletedSales : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaymentDetails");

            migrationBuilder.CreateTable(
                name: "CompletedSale",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CompletedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SaleId = table.Column<int>(type: "integer", nullable: false),
                    PaymentMethod = table.Column<string>(type: "text", nullable: false),
                    TransactionId = table.Column<string>(type: "text", nullable: true),
                    AmountTendered = table.Column<decimal>(type: "numeric", nullable: false),
                    ChangeDue = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompletedSale", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompletedSale_Sales_SaleId",
                        column: x => x.SaleId,
                        principalTable: "Sales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompletedSale_SaleId",
                table: "CompletedSale",
                column: "SaleId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompletedSale");

            migrationBuilder.CreateTable(
                name: "PaymentDetails",
                columns: table => new
                {
                    SaleId = table.Column<int>(type: "integer", nullable: false),
                    AmountTendered = table.Column<decimal>(type: "numeric", nullable: false),
                    ChangeDue = table.Column<decimal>(type: "numeric", nullable: false),
                    Method = table.Column<string>(type: "text", nullable: false),
                    TransactionId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentDetails", x => x.SaleId);
                    table.ForeignKey(
                        name: "FK_PaymentDetails_Sales_SaleId",
                        column: x => x.SaleId,
                        principalTable: "Sales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }
    }
}
