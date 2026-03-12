import { NextResponse } from "next/server";

const config = {
  background_image: "",
  theme: "couple",
  couple_text: "今天也想和你一起吃饭",
  empty_state_image: "",
};

export const GET = async () => {
  return NextResponse.json({ data: config });
};

export const POST = async () => {
  return NextResponse.json({ ok: true });
};
