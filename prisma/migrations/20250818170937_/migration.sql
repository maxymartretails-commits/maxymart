/*
  Warnings:

  - You are about to drop the column `userId` on the `OtpCode` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `OtpCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OtpCode" DROP CONSTRAINT "OtpCode_userId_fkey";

-- DropIndex
DROP INDEX "OtpCode_userId_idx";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "OtpCode" DROP COLUMN "userId",
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
