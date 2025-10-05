/*
  Warnings:

  - Added the required column `gstTotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subTotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cgst` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hsnCode` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `igst` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sgst` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "gstTotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "invoice" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "invoiceId" TEXT,
ADD COLUMN     "isIGST" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subTotal" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cgst" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "hsnCode" TEXT NOT NULL,
ADD COLUMN     "igst" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sgst" DOUBLE PRECISION NOT NULL;
