-- AlterTable: konuşmada teklif engelleme bayrağı
ALTER TABLE "conversations" ADD COLUMN     "offers_blocked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: mesajda teklif anlık görüntüsü (karşılıklı teklif geçmişi için)
ALTER TABLE "messages" ADD COLUMN     "offer_price" DECIMAL(12,2),
ADD COLUMN     "offer_delivery_time" TEXT,
ADD COLUMN     "offer_note" TEXT;
