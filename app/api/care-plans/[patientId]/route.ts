import { NextRequest, NextResponse } from "next/server";
import { CarePlan, CarePlanRevision } from "@/types/apcm";

const carePlans = new Map<string, CarePlan>();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> },
) {
  const { patientId } = await params;
  const plan = carePlans.get(patientId);

  if (!plan) {
    return NextResponse.json({ error: "Care plan not found" }, { status: 404 });
  }

  return NextResponse.json({ carePlan: plan });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> },
) {
  const { patientId } = await params;
  try {
    const body = (await request.json()) as Partial<CarePlan>;

    const plan: CarePlan = {
      planId: body.planId ?? crypto.randomUUID(),
      patientId,
      goals: body.goals ?? [],
      needs: body.needs ?? [],
      selfManagementActivities: body.selfManagementActivities ?? [],
      revisionHistory: [],
    };

    carePlans.set(patientId, plan);

    return NextResponse.json({ carePlan: plan }, { status: 201 });
  } catch (error) {
    console.error("Care plan create failed", error);
    return NextResponse.json(
      { error: "Unable to create care plan" },
      { status: 400 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> },
) {
  const { patientId } = await params;
  const existing = carePlans.get(patientId);

  if (!existing) {
    return NextResponse.json({ error: "Care plan not found" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as Partial<CarePlan> & {
      updatedBy?: string;
      summary?: string;
    };

    const revision: CarePlanRevision = {
      version: (existing.revisionHistory.at(-1)?.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: body.updatedBy ?? "system",
      summary: body.revisionHistory?.[0]?.summary ?? body.summary ?? "Plan updated",
    };

    const updatedPlan: CarePlan = {
      ...existing,
      goals: body.goals ?? existing.goals,
      needs: body.needs ?? existing.needs,
      selfManagementActivities:
        body.selfManagementActivities ?? existing.selfManagementActivities,
      revisionHistory: [...existing.revisionHistory, revision],
    };

    carePlans.set(patientId, updatedPlan);

    return NextResponse.json({ carePlan: updatedPlan });
  } catch (error) {
    console.error("Care plan update failed", error);
    return NextResponse.json(
      { error: "Unable to update care plan" },
      { status: 400 },
    );
  }
}

