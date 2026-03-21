"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import PageHeader from "@/components/admin/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User } from "@/types";
import { Plus, Edit2, Trash2, Shield, User as UserIcon } from "lucide-react";
import Modal from "@/components/ui/Modal";
import LoveSelect from "@/components/admin/ui/LoveSelect/LoveSelect";
import { PageLoading } from "@/components/ui/Loading";
import { useMessage } from "@/components/ui/Message";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/apis/user";

export default function AccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    role: "user" as "user" | "admin",
  });

  const message = useMessage();

  const { data: users = [], isLoading, error } = useUsers();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || "",
        password: "",
        name: user.name || "",
        role: user.role || "user",
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        password: "",
        name: "",
        role: "user",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        const payload: any = { ...formData };
        if (!payload.password) delete payload.password;

        await updateUser.mutateAsync({
          id: editingUser.id,
          data: payload,
        });

        message.success("账号更新成功");
      } else {
        if (!formData.username || !formData.password) {
          message.warning("账号和密码不能为空");
          return;
        }
        await createUser.mutateAsync(formData);

        message.success("账号创建成功");
      }
      setIsModalOpen(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "保存失败");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser.mutateAsync(id);
      message.success("账号删除成功");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "删除失败");
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="账号管理" subtitle="管理管理员和前台用户账号" />
        <PageLoading text="加载账号列表" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="账号管理" subtitle="管理管理员和前台用户账号" />
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8 text-center">
            <p className="text-red-500">加载失败: {error.message}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              刷新重试
            </Button>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mx-auto pb-20 md:pb-0">
        <PageHeader
          title="账号管理"
          subtitle="管理管理员和前台用户账号"
          action={
            <Button
              onClick={() => handleOpenModal()}
              className="bg-pink-500 hover:bg-pink-600 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> 新增账号
            </Button>
          }
        />

        {/* Desktop View */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border border-pink-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50 text-gray-600 text-sm border-b border-pink-100">
                <th className="p-4 font-medium">账号</th>
                <th className="p-4 font-medium">昵称</th>
                <th className="p-4 font-medium">角色</th>
                <th className="p-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {user.username}
                  </td>
                  <td className="p-4 text-gray-600">{user.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {user.role === "admin" ? (
                        <Shield className="w-3 h-3" />
                      ) : (
                        <UserIcon className="w-3 h-3" />
                      )}
                      {user.role === "admin" ? "管理员" : "前台用户"}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(user)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" /> 编辑
                    </Button>
                    {user.role !== "admin" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("确定要删除该用户吗？")) {
                            handleDelete(user.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                        disabled={deleteUser.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {deleteUser.isPending ? "删除中..." : "删除"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium text-gray-800 text-lg">
                    {user.username}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">{user.name}</div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {user.role === "admin" ? (
                    <Shield className="w-3 h-3" />
                  ) : (
                    <UserIcon className="w-3 h-3" />
                  )}
                  {user.role === "admin" ? "管理员" : "前台用户"}
                </span>
              </div>
              <div className="flex gap-2 justify-end border-t border-gray-100 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(user)}
                  className="flex-1"
                >
                  <Edit2 className="w-4 h-4 mr-1" /> 修改密码/编辑
                </Button>
                {user.role !== "admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("确定要删除该用户吗？")) {
                        handleDelete(user.id);
                      }
                    }}
                    className="flex-1 text-red-500 border-red-200"
                    disabled={deleteUser.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {deleteUser.isPending ? "删除中..." : "删除"}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Form Modal */}
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingUser ? "编辑账号" : "新增账号"}
        >
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                登录账号
              </label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={!!editingUser}
                placeholder="请输入登录账号"
                className="w-full"
              />
              {!!editingUser && (
                <p className="text-xs text-gray-400 mt-1">账号不可修改</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                登录密码{" "}
                {editingUser && (
                  <span className="text-gray-400 font-normal">
                    (不修改请留空)
                  </span>
                )}
              </label>
              <Input
                type="text"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={editingUser ? "输入新密码" : "请输入密码"}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用户昵称
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="请输入昵称"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                角色权限
              </label>
              <LoveSelect
                value={formData.role}
                onChange={(val) =>
                  setFormData({ ...formData, role: val as "user" | "admin" })
                }
                options={[
                  { value: "user", label: "前台用户" },
                  { value: "admin", label: "管理员" },
                ]}
                disabled={editingUser?.role === "admin"}
                placeholder="请选择角色"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              取消
            </Button>
            <Button
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
              onClick={handleSave}
              disabled={createUser.isPending || updateUser.isPending}
            >
              {createUser.isPending || updateUser.isPending
                ? "保存中..."
                : "保存"}
            </Button>
          </div>
        </Modal>
      </div>
    </PageContainer>
  );
}
