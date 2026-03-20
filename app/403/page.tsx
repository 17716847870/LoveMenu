"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">暂无权限</h1>
        <p className="text-gray-500 mb-8">
          抱歉，您没有访问此页面的权限。只有管理员可以访问后台页面。
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => router.push("/menu")}
            className="w-32"
          >
            返回首页
          </Button>
          <Button
            variant="default"
            onClick={() => {
              router.push("/login");
            }}
            className="w-32 bg-pink-500 hover:bg-pink-600 text-white"
          >
            切换账号
          </Button>
        </div>
      </div>
    </div>
  );
}
