"use client";

import FoodRouletteCard from "@/components/mobile/FoodRouletteCard";
import CoupleMoodCard from "@/components/mobile/CoupleMoodCard";
import TodayOrderedCard from "@/components/mobile/TodayOrderedCard";
import WeeklyFavoriteCard from "@/components/mobile/WeeklyFavoriteCard";
import DailyRecommendation from "@/components/mobile/recommendation/DailyRecommendation";
import WishlistCard from "@/components/mobile/WishlistCard";
import UrgentCravingCard from "@/components/mobile/UrgentCravingCard";
import RecentFeedbackCard from "@/components/mobile/RecentFeedbackCard";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 p-4 pt-8 w-full pb-24">
      {/* Mood Card */}
      <CoupleMoodCard />

      {/* Random Dish */}
      <FoodRouletteCard />

      {/* Today Recommend */}
      <DailyRecommendation compact={true} />

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
