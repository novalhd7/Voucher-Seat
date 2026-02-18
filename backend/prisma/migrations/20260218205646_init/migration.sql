-- CreateTable
CREATE TABLE "Voucher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "crew_name" TEXT NOT NULL,
    "crew_id" TEXT NOT NULL,
    "flight_number" TEXT NOT NULL,
    "flight_date" TEXT NOT NULL,
    "aircraft_type" TEXT NOT NULL,
    "seat1" TEXT NOT NULL,
    "seat2" TEXT NOT NULL,
    "seat3" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_flight_number_flight_date_key" ON "Voucher"("flight_number", "flight_date");
