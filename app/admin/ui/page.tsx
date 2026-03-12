import { PageContainer } from "../../../components/ui/PageContainer";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { ThemeSwitcher } from "../../../components/ui/ThemeSwitcher";

export default function AdminUiPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">UI 配置管理</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <h3 className="text-base font-semibold">主题选择</h3>
          <ThemeSwitcher />
        </Card>
        <Card className="space-y-3">
          <h3 className="text-base font-semibold">背景图片</h3>
          <Input placeholder="图片地址" />
        </Card>
        <Card className="space-y-3 md:col-span-2">
          <h3 className="text-base font-semibold">情侣文案</h3>
          <Textarea rows={4} placeholder="请输入情侣文案" />
        </Card>
      </div>
    </PageContainer>
  );
}
