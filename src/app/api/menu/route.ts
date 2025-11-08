import { NextResponse } from "next/server";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = db.select().from(menuItems);
    
    if (category) {
      query = db.select().from(menuItems).where(eq(menuItems.category, category));
    }

    const items = await query;

    return NextResponse.json({
      success: true,
      menuItems: items,
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}
