import { NextResponse } from "next/server";
import { dishCategories } from "../../../lib/mock-data";

export const GET = async () => {
  return NextResponse.json({ data: dishCategories });
};
