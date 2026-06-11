-- DropColumn: konuşma bazlı engelleme yerini ilan bazlı engellemeye bıraktı
ALTER TABLE "conversations" DROP COLUMN "offers_blocked";

-- CreateTable
CREATE TABLE "offer_blocks" (
    "id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "blocked_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "offer_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "offer_blocks_blocked_user_id_idx" ON "offer_blocks"("blocked_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "offer_blocks_listing_id_blocked_user_id_key" ON "offer_blocks"("listing_id", "blocked_user_id");

-- AddForeignKey
ALTER TABLE "offer_blocks" ADD CONSTRAINT "offer_blocks_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_blocks" ADD CONSTRAINT "offer_blocks_blocked_user_id_fkey" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
