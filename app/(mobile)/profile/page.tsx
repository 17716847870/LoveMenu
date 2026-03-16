import CoupleProfileCard from "@/components/mobile/CoupleProfileCard";
import LoveBalanceCard from "@/components/mobile/LoveBalanceCard";
import OrderPreviewCard from "@/components/mobile/OrderPreviewCard";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      {/* Header - Couple Profile Card */}
      <CoupleProfileCard />

      {/* Love Balance Card */}
      <LoveBalanceCard />

      {/* Order History Preview */}
      <OrderPreviewCard />
    </div>
  );
}
