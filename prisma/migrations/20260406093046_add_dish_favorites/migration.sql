-- CreateTable
CREATE TABLE "DishFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DishFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DishFavorite_userId_idx" ON "DishFavorite"("userId");

-- CreateIndex
CREATE INDEX "DishFavorite_dishId_idx" ON "DishFavorite"("dishId");

-- CreateIndex
CREATE UNIQUE INDEX "DishFavorite_userId_dishId_key" ON "DishFavorite"("userId", "dishId");

-- AddForeignKey
ALTER TABLE "DishFavorite" ADD CONSTRAINT "DishFavorite_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishFavorite" ADD CONSTRAINT "DishFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
