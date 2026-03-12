"use client";

import FoodRouletteCard from "@/components/mobile/FoodRouletteCard";
import CoupleMoodCard from "@/components/mobile/CoupleMoodCard";
import TodayOrderedCard from "@/components/mobile/TodayOrderedCard";
import WeeklyFavoriteCard from "@/components/mobile/WeeklyFavoriteCard";
import TodayRecommendCard from "@/components/mobile/TodayRecommendCard";
import WishlistCard from "@/components/mobile/WishlistCard";
import UrgentCravingCard from "@/components/mobile/UrgentCravingCard";
import RecentFeedbackCard from "@/components/mobile/RecentFeedbackCard";

export default function HomePage() {

  return (
    <div className="flex flex-col gap-6 p-4 pt-8 w-full">
      {/* Mood Card */}
      <CoupleMoodCard />

      {/* Random Dish */}
      <FoodRouletteCard />

      {/* Today Recommend */}
      <TodayRecommendCard />

      {/* Today's Orders */}
      <TodayOrderedCard />

      {/* Weekly Favorites */}
      <WeeklyFavoriteCard />

      {/* Wishlist */}
      <WishlistCard />

      {/* Urgent Craving */}
      <UrgentCravingCard />

      {/* Recent Feedback */}
      <RecentFeedbackCard />
    </div>
  );
}
