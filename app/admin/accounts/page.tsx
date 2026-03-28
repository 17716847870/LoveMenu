"use client";

import React, { useState, useRef, useEffect } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import PageHeader from "@/components/admin/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User } from "@/types";
import { Plus, Edit2, Trash2, Shield, User as UserIcon, Coins, Camera } from "lucide-react";
import Modal from "@/components/ui/Modal";
import LoveSelect from "@/components/admin/ui/LoveSelect/LoveSelect";
import { PageLoading } from "@/components/ui/Loading";
import { useMessage } from "@/components/ui/Message";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { useUser } from "@/context/UserContext";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useTopUpBalance,
} from "@/apis/user";

export default function AccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [balanceUser, setBalanceUser] = useState<User | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { user: currentUser, setUser: setCurrentUser } = useUser();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!lightboxSrc) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxSrc(null); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxSrc]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    role: "user" as "user" | "admin",
    avatar: "",
  });

  const [balanceData, setBalanceData] = useState({
    kissAmount: 0,
    hugAmount: 0,
  });

  const message = useMessage();

  const { data: users = [], isLoading, error } = useUsers();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const topUpBalance = useTopUpBalance();

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || "",
        password: "",
        name: user.name || "",
        role: user.role || "user",
        avatar: user.avatar || "",
      });
      setAvatarPreview(user.avatar || null);
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        password: "",
        name: "",
        role: "user",
        avatar: "",
      });
      setAvatarPreview(null);
    }
    setIsModalOpen(true);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 本地预览
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    // 上传
    setIsUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("path", "avatars");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "上传失败");
      const url: string = json.data?.url || json.data;
      if (!url || typeof url !== "string") throw new Error("获取上传地址失败");
      const secureUrl = url.replace(/^http:\/\//, "https://");
      setFormData((prev) => ({ ...prev, avatar: secureUrl }));
      setAvatarPreview(secureUrl);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "头像上传失败");
      setAvatarPreview(editingUser?.avatar || null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleOpenBalanceModal = (user: User) => {
    setBalanceUser(user);
    setBalanceData({ kissAmount: 0, hugAmount: 0 });
    setIsBalanceModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        const payload: any = { ...formData };
        if (!payload.password) delete payload.password;
        if (!payload.avatar) delete payload.avatar;

        const updatedUser = await updateUser.mutateAsync({
          id: editingUser.id,
          data: payload,
        });

        // 如果修改的是当前登录用户，同步更新 context
        if (currentUser && editingUser.id === currentUser.id && updatedUser) {
          setCurrentUser({ ...currentUser, ...updatedUser });
        }

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

  const handleBalanceSave = async () => {
    if (!balanceUser) return;
    
    if (balanceData.kissAmount === 0 && balanceData.hugAmount === 0) {
      message.warning("请输入要充值的金额");
      return;
    }

    try {
      await topUpBalance.mutateAsync({
        id: balanceUser.id,
        kissAmount: balanceData.kissAmount,
        hugAmount: balanceData.hugAmount,
      });
      message.success("余额更新成功");
      setIsBalanceModalOpen(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "更新失败");
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
                <th className="p-4 font-medium">头像</th>
                <th className="p-4 font-medium">账号</th>
                <th className="p-4 font-medium">昵称</th>
                <th className="p-4 font-medium">角色</th>
                <th className="p-4 font-medium">余额</th>
                <th className="p-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <Avatar
                      className={`w-9 h-9 ${user.avatar ? "cursor-zoom-in" : ""}`}
                      onClick={() => user.avatar && setLightboxSrc(user.avatar)}
                    >
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-pink-100 text-pink-500 text-sm font-medium">
                          {(user.name || user.username || "?").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </td>
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
                  <td className="p-4">
                    {user.role !== "admin" && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-pink-500">
                          ❤️ {user.kissBalance ?? 0}
                        </span>
                        <span className="text-sm text-orange-500">
                          🤗 {user.hugBalance ?? 0}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    {user.role !== "admin" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenBalanceModal(user)}
                      >
                        <Coins className="w-4 h-4 mr-1" /> 充值
                      </Button>
                    )}
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
                <div className="flex items-center gap-3">
                  <Avatar
                    className={`w-10 h-10 ${user.avatar ? "cursor-zoom-in" : ""}`}
                    onClick={() => user.avatar && setLightboxSrc(user.avatar)}
                  >
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-pink-100 text-pink-500 text-sm font-medium">
                        {(user.name || user.username || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-800 text-lg">
                      {user.username}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">{user.name}</div>
                  </div>
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
              {user.role !== "admin" && (
                <div className="flex items-center gap-3 mb-3 text-sm">
                  <span className="text-pink-500">❤️ {user.kissBalance ?? 0}</span>
                  <span className="text-orange-500">🤗 {user.hugBalance ?? 0}</span>
                </div>
              )}
              <div className="flex gap-2 justify-end border-t border-gray-100 pt-3">
                {user.role !== "admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenBalanceModal(user)}
                    className="flex-1"
                  >
                    <Coins className="w-4 h-4 mr-1" /> 充值
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(user)}
                  className="flex-1"
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
            {/* 头像上传：仅编辑当前登录账号时显示 */}
            {editingUser && currentUser && editingUser.id === currentUser.id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  头像
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      {avatarPreview ? (
                        <AvatarImage src={avatarPreview} alt="头像预览" />
                      ) : (
                        <AvatarFallback className="bg-pink-100 text-pink-500 text-xl font-medium">
                          {(formData.name || formData.username || "?").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUploadingAvatar}
                      onClick={() => avatarInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      {isUploadingAvatar ? "上传中..." : "更换头像"}
                    </Button>
                    <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG，最大 5MB</p>
                  </div>
                </div>
              </div>
            )}
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
                {!editingUser && <span className="text-red-500">*</span>}
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={
                  editingUser ? "不修改请留空" : "请输入登录密码"
                }
                className="w-full"
              />
              {editingUser && (
                <p className="text-xs text-gray-400 mt-1">
                  不修改请留空，修改则输入新密码
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                昵称
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="请输入用户昵称"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                角色
              </label>
              <LoveSelect
                value={formData.role}
                onChange={(val) =>
                  setFormData({ ...formData, role: val as "user" | "admin" })
                }
                options={[
                  { label: "前台用户", value: "user" },
                  { label: "管理员", value: "admin" },
                ]}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
              <Button
                onClick={handleSave}
                disabled={createUser.isPending || updateUser.isPending}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                {(createUser.isPending || updateUser.isPending)
                  ? "保存中..."
                  : "保存"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Balance Modal */}
        <Modal
          open={isBalanceModalOpen}
          onClose={() => setIsBalanceModalOpen(false)}
          title="充值余额"
        >
          {balanceUser && (
            <div className="space-y-4 py-4">
              <div className="bg-pink-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-2">当前余额</div>
                <div className="flex items-center gap-6">
                  <span className="text-pink-500 text-lg font-medium">
                    ❤️ {balanceUser.kissBalance ?? 0}
                  </span>
                  <span className="text-orange-500 text-lg font-medium">
                    🤗 {balanceUser.hugBalance ?? 0}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  增加/减少 亲亲数
                </label>
                <Input
                  type="number"
                  value={balanceData.kissAmount}
                  onChange={(e) =>
                    setBalanceData({
                      ...balanceData,
                      kissAmount: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="输入正数增加，负数减少"
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">
                  输入正数增加余额，输入负数减少余额
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  增加/减少 贴贴数
                </label>
                <Input
                  type="number"
                  value={balanceData.hugAmount}
                  onChange={(e) =>
                    setBalanceData({
                      ...balanceData,
                      hugAmount: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="输入正数增加，负数减少"
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">
                  输入正数增加余额，输入负数减少余额
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-2">充值后余额</div>
                <div className="flex items-center gap-6">
                  <span className="text-pink-500 text-lg font-medium">
                    ❤️ {(balanceUser.kissBalance ?? 0) + balanceData.kissAmount}
                  </span>
                  <span className="text-orange-500 text-lg font-medium">
                    🤗 {(balanceUser.hugBalance ?? 0) + balanceData.hugAmount}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsBalanceModalOpen(false)}>
                  取消
                </Button>
                <Button
                  onClick={handleBalanceSave}
                  disabled={topUpBalance.isPending}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  {topUpBalance.isPending ? "保存中..." : "保存"}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>

      {/* Avatar Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxSrc}
              alt="头像预览"
              className="max-w-[80vw] max-h-[80vh] rounded-2xl shadow-2xl object-contain"
            />
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
