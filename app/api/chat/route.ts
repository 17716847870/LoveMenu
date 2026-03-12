import { NextResponse } from "next/server";
import { chatMessages } from "../../../lib/mock-data";

export const GET = async () => {
  return NextResponse.json({ data: chatMessages });
};

export const POST = async () => {
  return NextResponse.json({ ok: true });
};
