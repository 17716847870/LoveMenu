"use client";

import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import CoupleProfileCard from "@/components/mobile/CoupleProfileCard";
import LoveBalanceCard from "@/components/mobile/LoveBalanceCard";
import OrderPreviewCard from "@/components/mobile/OrderPreviewCard";
import ChatEntryCard from "@/components/mobile/ChatEntryCard";
import LogoutButton from "@/components/mobile/LogoutButton";

export default function ProfilePage() {
  const { user, setUser } = useUser();

  // 页面加载时从 API 获取最新用户数据
  useEffect(() => {
    if (user?.id) {
      const fetchLatestUser = async () => {
        try {
          const res = await fetch(`/api/users/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setUser(data.data || data);
          }
        } catch (error) {
          console.error("Failed to fetch latest user data:", error);
        }
      };
      fetchLatestUser();
    }
  }, [user?.id, setUser]);

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
