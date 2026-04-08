"use client";

import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import CoupleProfileCard from "@/components/mobile/CoupleProfileCard";
import LoveBalanceCard from "@/components/mobile/LoveBalanceCard";
import OrderPreviewCard from "@/components/mobile/OrderPreviewCard";
import ChatEntryCard from "@/components/mobile/ChatEntryCard";
import LogoutButton from "@/components/mobile/LogoutButton";

export default function ProfilePage() {
  const { refreshUser } = useUser();

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      {/* Header - Couple Profile Card */}
      <CoupleProfileCard />

      {/* Love Balance Card */}
      <LoveBalanceCard />

      {/* Chat Entry Card */}
      <ChatEntryCard />

      {/* Order History Preview */}
      <OrderPreviewCard />

      {/* Logout Button */}
      <LogoutButton />
    </div>
  );
}
