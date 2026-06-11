-- Teklif silindiğinde ilgili sipariş de silinsin (teklif silme özelliği için)
ALTER TABLE "orders" DROP CONSTRAINT "orders_offer_id_fkey";
ALTER TABLE "orders" ADD CONSTRAINT "orders_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
