-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "status" "CarStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "durationSec" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sessionId" TEXT;
