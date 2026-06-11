-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'OFFER');

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "offer_id" TEXT,
ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'TEXT';

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
