import { NextResponse } from "next/server";
import { generatePatientReport } from "@/lib/reporting";

export async function GET(
  _request: Request,
  { params }: { params: { patientId: string } },
) {
  const report = generatePatientReport(params.patientId);

  return new NextResponse(report, {
    status: 200,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  });
}

