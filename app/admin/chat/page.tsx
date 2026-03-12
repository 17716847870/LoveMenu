import { PageContainer } from "../../../components/ui/PageContainer";
import { ChatBubble } from "../../../components/chat/ChatBubble";
import { chatMessages } from "../../../lib/mock-data";

export default function AdminChatPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">聊天管理</h1>
      <div className="mt-6 space-y-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        {chatMessages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isSelf={message.senderId === "user-a"}
          />
        ))}
      </div>
    </PageContainer>
  );
}
