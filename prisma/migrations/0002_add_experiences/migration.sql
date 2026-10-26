-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "admin_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "experiences_admin_id_idx" ON "experiences"("admin_id");
CREATE INDEX "experiences_sort_order_idx" ON "experiences"("sort_order");
CREATE INDEX "experiences_isPublished_idx" ON "experiences"("isPublished");

ALTER TABLE "experiences" ADD CONSTRAINT "experiences_admin_id_fkey"
  FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
