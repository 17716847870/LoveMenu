import BottomTabBar from "@/components/mobile/BottomTabBar";

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <main className="flex-1">{children}</main>
      <BottomTabBar />
    </div>
  );
}
