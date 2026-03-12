import ChatBubble from "@/components/chat/ChatBubble";

export default function AdminChatPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">聊天管理</h1>
      <div className="border rounded-lg p-4 bg-muted/10">
        <p className="text-muted-foreground text-center">暂无消息</p>
      </div>
    </div>
  );
}
