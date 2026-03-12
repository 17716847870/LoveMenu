import { NextResponse } from "next/server";
import { orders } from "../../../lib/mock-data";

export const GET = async () => {
  return NextResponse.json({ data: orders });
};

export const POST = async () => {
  return NextResponse.json({ ok: true });
};
