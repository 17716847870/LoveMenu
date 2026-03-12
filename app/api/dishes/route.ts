import { NextResponse } from "next/server";
import { dishes } from "../../../lib/mock-data";

export const GET = async () => {
  return NextResponse.json({ data: dishes });
};
