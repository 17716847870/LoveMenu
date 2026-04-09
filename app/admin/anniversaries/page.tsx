"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import PageHeader from "@/components/admin/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";
import LoveSelect from "@/components/admin/ui/LoveSelect/LoveSelect";
import { PageLoading } from "@/components/ui/Loading";
import { useMessage } from "@/components/ui/Message";
import {
  Plus,
  Edit2,
  Trash2,
  Bell,
  BellOff,
  Clock,
  Mail,
  CalendarDays,
  History,
} from "lucide-react";
import Link from "next/link";
import {
  Anniversary,
  useAnniversaries,
  useCreateAnniversary,
  useUpdateAnniversary,
  useDeleteAnniversary,
} from "@/apis/anniversary";

const REPEAT_LABELS: Record<string, string> = {
  once: "单次",
  weekly: "每周",
  monthly: "每月",
  quarterly: "每季度",
  halfyear: "每半年",
  yearly: "每年",
};
const WEEKDAY_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  done: "bg-gray-100 text-gray-500",
};
const STATUS_LABELS: Record<string, string> = {
  active: "启用",
  paused: "暂停",
  done: "已完成",
};
const EMPTY_FORM = {
  title: "",
  calendarType: "solar" as "solar" | "lunar",
  month: 1,
  day: 1,
  weekday: 1,
  repeatType: "yearly" as Anniversary["repeatType"],
  advanceDays: 0,
  emailTo: "",
  emailSubject: "【{title}】提醒",
  emailContent:
    "亲爱的，\n\n{title} 就要到了（{date}），记得准备哦！\n\n—— LoveMenu",
};

export default function AnniversariesPage() {
  const message = useMessage();
  const { data: list = [], isLoading } = useAnniversaries();
  const createMutation = useCreateAnniversary();
  const updateMutation = useUpdateAnniversary();
  const deleteMutation = useDeleteAnniversary();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Anniversary | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setIsModalOpen(true);
  };
  const openEdit = (ann: Anniversary) => {
    setEditing(ann);
    setForm({
      title: ann.title,
      calendarType: ann.calendarType,
      month: ann.month,
      day: ann.day,
      weekday: ann.weekday ?? 1,
      repeatType: ann.repeatType,
      advanceDays: ann.advanceDays,
      emailTo: ann.emailTo,
      emailSubject: ann.emailSubject,
      emailContent: ann.emailContent,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.emailTo ||
      !form.emailSubject ||
      !form.emailContent
    ) {
      message.error("请填写所有必填字段");
      return;
    }
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data: form });
        message.success("更新成功");
      } else {
        await createMutation.mutateAsync(form);
        message.success("创建成功");
      }
      setIsModalOpen(false);
    } catch (e) {
      message.error(e instanceof Error ? e.message : "操作失败");
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await deleteMutation.mutateAsync(confirmId);
      message.success("已删除");
    } catch {
      message.error("删除失败");
    } finally {
      setConfirmId(null);
    }
  };

  const handleToggleStatus = async (ann: Anniversary) => {
    const newStatus = ann.status === "active" ? "paused" : "active";
    try {
      await updateMutation.mutateAsync({
        id: ann.id,
        data: { ...ann, status: newStatus },
      });
      message.success(newStatus === "active" ? "已启用" : "已暂停");
    } catch {
      message.error("操作失败");
    }
  };

  if (isLoading) return <PageLoading />;

  return (
    <PageContainer>
      <PageHeader
        title="纪念日提醒"
        subtitle="管理纪念日邮件提醒，支持国历/农历、多种循环方式"
        action={
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> 新增提醒
          </Button>
        }
      />
      <div className="space-y-3">
        {list.length === 0 && (
          <Card className="p-12 text-center text-gray-400">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>暂无纪念日提醒</p>
          </Card>
        )}
        {list.map((ann) => (
          <Card key={ann.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800">
                    {ann.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[ann.status] ?? "bg-gray-100 text-gray-500"}`}
                  >
                    {STATUS_LABELS[ann.status]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600">
                    {REPEAT_LABELS[ann.repeatType]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-600">
                    {ann.calendarType === "lunar" ? "农历" : "国历"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {ann.repeatType === "weekly"
                      ? `每${WEEKDAY_LABELS[ann.weekday ?? 1]}`
                      : `${ann.month}月${ann.day}日`}
                    {ann.advanceDays > 0 && `（提前 ${ann.advanceDays} 天）`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {ann.emailTo}
                  </span>
                  {ann.nextRemindAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      下次：
                      {new Date(ann.nextRemindAt).toLocaleDateString("zh-CN", {
                        timeZone: "Asia/Shanghai",
                      })}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/anniversaries/${ann.id}/logs`}
                  className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                  title="发送历史"
                >
                  <History className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleToggleStatus(ann)}
                  disabled={ann.status === "done"}
                  className="p-2 rounded-lg text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors"
                  title={ann.status === "active" ? "暂停" : "启用"}
                >
                  {ann.status === "active" ? (
                    <BellOff className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => openEdit(ann)}
                  className="p-2 rounded-lg text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setConfirmId(ann.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "编辑提醒" : "新增提醒"}
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标题 *
            </label>
            <Input
              placeholder="例：结婚纪念日"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                历法
              </label>
              <LoveSelect
                value={form.calendarType}
                onChange={(v) =>
                  setForm({ ...form, calendarType: v as "solar" | "lunar" })
                }
                options={[
                  { label: "国历（公历）", value: "solar" },
                  { label: "农历", value: "lunar" },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                循环方式
              </label>
              <LoveSelect
                value={form.repeatType}
                onChange={(v) =>
                  setForm({
                    ...form,
                    repeatType: v as Anniversary["repeatType"],
                  })
                }
                options={[
                  { label: "单次", value: "once" },
                  { label: "每周", value: "weekly" },
                  { label: "每月", value: "monthly" },
                  { label: "每季度", value: "quarterly" },
                  { label: "每半年", value: "halfyear" },
                  { label: "每年", value: "yearly" },
                ]}
              />
            </div>
          </div>
          {form.repeatType === "weekly" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                提醒星期
              </label>
              <LoveSelect
                value={String(form.weekday)}
                onChange={(v) => setForm({ ...form, weekday: Number(v) })}
                options={WEEKDAY_LABELS.map((l, i) => ({
                  label: l,
                  value: String(i),
                }))}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {form.calendarType === "lunar" ? "农历月" : "月"} *
                </label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={form.month}
                  onChange={(e) =>
                    setForm({ ...form, month: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {form.calendarType === "lunar" ? "农历日" : "日"} *
                </label>
                <Input
                  type="number"
                  min={1}
                  max={31}
                  value={form.day}
                  onChange={(e) =>
                    setForm({ ...form, day: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          )}
          {form.repeatType !== "weekly" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                提前提醒天数（0=当天，最多7天）
              </label>
              <Input
                type="number"
                min={0}
                max={7}
                value={form.advanceDays}
                onChange={(e) =>
                  setForm({
                    ...form,
                    advanceDays: Math.min(7, Number(e.target.value)),
                  })
                }
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              收件邮箱 *
            </label>
            <Input
              type="email"
              placeholder="example@email.com"
              value={form.emailTo}
              onChange={(e) => setForm({ ...form, emailTo: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮件主题 *{" "}
              <span className="text-xs text-gray-400">
                （支持 {`{title}`} {`{date}`}）
              </span>
            </label>
            <Input
              value={form.emailSubject}
              onChange={(e) =>
                setForm({ ...form, emailSubject: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮件内容 *{" "}
              <span className="text-xs text-gray-400">
                （支持 {`{title}`} {`{date}`}）
              </span>
            </label>
            <textarea
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              value={form.emailContent}
              onChange={(e) =>
                setForm({ ...form, emailContent: e.target.value })
              }
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              取消
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "保存中..."
                : "保存"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="确认删除"
        message="确定要删除这条纪念日提醒吗？删除后无法恢复。"
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
