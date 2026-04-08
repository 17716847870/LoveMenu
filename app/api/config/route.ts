import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logApiError } from '@/lib/error-log';

const CONFIG_KEYS = ["loveStartDate", "homeMoodText", "homeCravingText"] as const;

type ConfigKey = (typeof CONFIG_KEYS)[number];

export const GET = async () => {
  try {
    const configs = await prisma.systemConfig.findMany({
      where: {
        key: {
          in: [...CONFIG_KEYS],
        },
      },
    });

    const configMap = new Map(configs.map((item) => [item.key, item.value]));

    return NextResponse.json({
      success: true,
      data: {
        loveStartDate: configMap.get("loveStartDate") || "",
        homeMoodText: configMap.get("homeMoodText") || "",
        homeCravingText: configMap.get("homeCravingText") || "",
      },
    });
  } catch (error) {
    console.error("[api/config][GET] 获取配置失败", error);
    await logApiError({ scope: '/api/config[GET]', path: '/api/config', method: 'GET' }, error);
    return NextResponse.json({ message: "获取配置失败" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json() as Partial<Record<ConfigKey, string>>;

    await Promise.all(
      CONFIG_KEYS.map((key) =>
        prisma.systemConfig.upsert({
          where: { key },
          update: { value: body[key] || "" },
          create: { key, value: body[key] || "" },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/config][POST] 保存配置失败", error);
    await logApiError({ req, scope: '/api/config[POST]' }, error);
    return NextResponse.json({ message: "保存配置失败" }, { status: 500 });
  }
};
