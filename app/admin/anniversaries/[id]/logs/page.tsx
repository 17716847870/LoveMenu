"use client";

import { use } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import PageHeader from "@/components/admin/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/Loading";
import { CheckCircle2, XCircle, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAnniversary } from "@/apis/anniversary";

export default function AnniversaryLogsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useAnniversary(id);

  if (isLoading) return <PageLoading />;

  const ann = data;
  const logs = data?.logs ?? [];

  return (
    <PageContainer>
      <div className="mb-4">
        <Link
          href="/admin/anniversaries"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-pink-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 返回纪念日列表
        </Link>
      </div>

      <PageHeader
        title={ann ? `「${ann.title}」发送历史` : "发送历史"}
        subtitle={ann ? `收件邮箱：${ann.emailTo}` : ""}
      />

      <div className="space-y-3">
        {logs.length === 0 && (
          <Card className="p-12 text-center text-gray-400">
            <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>暂无发送记录</p>
          </Card>
        )}
        {logs.map((log) => (
          <Card key={log.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                {log.status === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      log.status === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {log.status === "success" ? "发送成功" : "发送失败"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(log.sentAt).toLocaleString("zh-CN", {
                      timeZone: "Asia/Shanghai",
                    })}
                  </span>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {log.emailTo}
                  </span>
                </div>
                {log.error && (
                  <p className="mt-1 text-sm text-red-500 truncate">
                    {log.error}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
