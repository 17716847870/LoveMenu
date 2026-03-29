"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/admin/shared/PageHeader";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface Config {
  loveStartDate: string;
}

export default function ConfigPage() {
  const [config, setConfig] = useState<Config>({ loveStartDate: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const data = await res.json();
          setConfig(data.data || { loveStartDate: "" });
        }
      } catch (error) {
        console.error("Failed to fetch config:", error);
        toast.error("加载配置失败");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        toast.success("配置保存成功");
      } else {
        toast.error("保存失败");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("保存失败，请稍后重试");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="系统配置" subtitle="管理应用全局配置" />

      <div className="max-w-2xl">
        <Card className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              在一起的日期
            </label>
            <input
              type="date"
              value={config.loveStartDate}
              onChange={(e) =>
                setConfig({ ...config, loveStartDate: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              设置这个日期后，前台页面会自动计算在一起的天数
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all",
              isSaving
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-pink-500 text-white hover:bg-pink-600"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                保存配置
              </>
            )}
          </button>
        </Card>
      </div>
    </PageContainer>
  );
}
