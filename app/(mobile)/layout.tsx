import BottomTabBar from "@/components/mobile/navigation/BottomTabBar";

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>
      <BottomTabBar />
    </div>
  );
}
