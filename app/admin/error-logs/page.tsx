"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bug,
  MonitorSmartphone,
  RefreshCw,
  Search,
  ServerCrash,
  Trash2,
} from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";
import PageHeader from "@/components/admin/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/Loading";
import { Input } from "@/components/ui/Input";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";
import {
  useClearErrorLogs,
  useDeleteErrorLog,
  useErrorLogs,
} from "@/apis/error-log";

const FILTERS = [
  { label: "全部", value: "all" },
  { label: "API 报错", value: "api" },
  { label: "前端报错", value: "frontend" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

export default function ErrorLogsPage() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isClearOpen, setIsClearOpen] = useState(false);

  const source = filter === "all" ? undefined : filter;
  const query = { source, keyword, limit: 100 } as const;
  const {
    data: logs = [],
    isLoading,
    refetch,
    isRefetching,
  } = useErrorLogs(query);
  const deleteMutation = useDeleteErrorLog();
  const clearMutation = useClearErrorLogs();

  const stats = useMemo(
    () => ({
      total: logs.length,
      api: logs.filter((item) => item.source === "api").length,
      frontend: logs.filter((item) => item.source === "frontend").length,
    }),
    [logs]
  );

  const handleSearch = () => {
    setKeyword(keywordInput.trim());
  };

  const handleDeleteOne = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleClear = async () => {
    await clearMutation.mutateAsync(query);
    setIsClearOpen(false);
  };

  if (isLoading) return <PageLoading />;

  return (
    <PageContainer>
      <PageHeader
        title="错误日志"
        subtitle="集中查看接口异常和前端运行异常，支持关键词搜索与批量清理"
        action={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => refetch()}
              className="flex items-center gap-2"
              disabled={isRefetching}
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
              />
              刷新
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsClearOpen(true)}
              disabled={logs.length === 0 || clearMutation.isPending}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              清空当前结果
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-3 mb-6">
        <Card className="p-4 bg-white/90 border-pink-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600
              flex items-center justify-center"
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">当前结果数</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white/90 border-blue-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600
              flex items-center justify-center"
            >
              <ServerCrash className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">API 报错</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.api}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white/90 border-violet-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-600
              flex items-center justify-center"
            >
              <MonitorSmartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">前端报错</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.frontend}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 mb-4 bg-white/95 border-pink-100">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={[
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  filter === item.value
                    ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                    : "bg-white text-gray-600 border border-pink-100 hover:bg-pink-50",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="搜索 message / scope / path / method / url"
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch}>搜索</Button>
            <Button
              variant="outline"
              onClick={() => {
                setKeywordInput("");
                setKeyword("");
              }}
            >
              重置
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {logs.length === 0 && (
          <Card className="p-12 text-center text-gray-400">
            <Bug className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>当前没有匹配的错误日志</p>
          </Card>
        )}

        {logs.map((log) => {
          const isApi = log.source === "api";
          return (
            <Card key={log.id} className="p-4 bg-white/95">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isApi
                          ? "bg-blue-100 text-blue-700"
                          : "bg-violet-100 text-violet-700"
                      }`}
                    >
                      {isApi ? "API" : "前端"}
                    </span>
                    {log.method && (
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium
                          bg-gray-100 text-gray-600"
                      >
                        {log.method}
                      </span>
                    )}
                    {log.scope && (
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium
                          bg-pink-50 text-pink-600"
                      >
                        {log.scope}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString("zh-CN", {
                        timeZone: "Asia/Shanghai",
                      })}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(log.id)}
                    className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    删除
                  </Button>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 wrap-break-word">
                    {log.message}
                  </p>
                  {log.path && (
                    <p className="mt-1 text-sm text-gray-500 break-all">
                      路径：{log.path}
                    </p>
                  )}
                  {log.url && (
                    <p className="mt-1 text-xs text-gray-400 break-all">
                      URL：{log.url}
                    </p>
                  )}
                </div>

                {log.stack && (
                  <pre
                    className="rounded-2xl bg-slate-950 text-slate-100 text-xs p-4
                      overflow-x-auto whitespace-pre-wrap wrap-break-word"
                  >
                    {log.stack}
                  </pre>
                )}

                {log.metadata && (
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2">
                      附加信息
                    </p>
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap wrap-break-word">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteOne}
        title="删除错误日志"
        message="确认删除这条错误日志吗？删除后无法恢复。"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmDialog
        isOpen={isClearOpen}
        onClose={() => setIsClearOpen(false)}
        onConfirm={handleClear}
        title="清空当前错误日志结果"
        message="确认清空当前筛选结果吗？这会删除当前列表里的所有日志。"
        isLoading={clearMutation.isPending}
      />
    </PageContainer>
  );
}
