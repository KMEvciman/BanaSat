-- AlterTable: kullanıcıya il/ilçe
ALTER TABLE "users" ADD COLUMN     "province" TEXT,
ADD COLUMN     "district" TEXT;

-- AlterTable: ilana il/ilçe
ALTER TABLE "listings" ADD COLUMN     "province" TEXT,
ADD COLUMN     "district" TEXT;

-- CreateIndex
CREATE INDEX "listings_province_idx" ON "listings"("province");

-- CreateTable: iller
CREATE TABLE "provinces" (
    "id" TEXT NOT NULL,
    "plate" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "provinces_plate_key" ON "provinces"("plate");
CREATE UNIQUE INDEX "provinces_name_key" ON "provinces"("name");

-- CreateTable: ilçeler
CREATE TABLE "districts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "province_id" TEXT NOT NULL,
    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "districts_province_id_idx" ON "districts"("province_id");
CREATE UNIQUE INDEX "districts_province_id_name_key" ON "districts"("province_id", "name");
ALTER TABLE "districts" ADD CONSTRAINT "districts_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: adresler
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "full_address" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "addresses_user_id_idx" ON "addresses"("user_id");
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
