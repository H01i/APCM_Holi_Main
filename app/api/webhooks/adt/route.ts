import { NextRequest, NextResponse } from "next/server";
import { triggerOutreach } from "@/lib/outreach";

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    const result = await triggerOutreach(event);

    return NextResponse.json({
      status: "received",
      outreach: result,
    });
  } catch (error) {
    console.error("ADT webhook failed", error);
    return NextResponse.json(
      { error: "Unable to process ADT message" },
      { status: 400 },
    );
  }
}

