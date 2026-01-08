import { NextResponse } from "next/server";
import { RiskLevel } from "@/types/apcm";

type StratifyInput = {
  chronicConditions?: string[];
  recentAdmissions?: number;
  edVisits?: number;
};

const determineRiskLevel = ({
  chronicConditions = [],
  recentAdmissions = 0,
  edVisits = 0,
}: StratifyInput): RiskLevel => {
  const conditionCount = chronicConditions.length;
  const acuteUtilization = recentAdmissions + edVisits;

  if (conditionCount >= 3 || recentAdmissions >= 1 || edVisits >= 2) {
    return "Level 3";
  }

  if (conditionCount >= 2 || acuteUtilization >= 1) {
    return "Level 2";
  }

  return "Level 1";
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StratifyInput;
    const riskLevel = determineRiskLevel(body);

    return NextResponse.json({ riskLevel });
  } catch (error) {
    console.error("Stratification error", error);
    return NextResponse.json(
      { error: "Unable to stratify patient" },
      { status: 400 },
    );
  }
}

