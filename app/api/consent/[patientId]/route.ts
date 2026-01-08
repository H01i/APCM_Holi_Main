import { NextRequest, NextResponse } from "next/server";
import { Consent } from "@/types/apcm";

const consentStore = new Map<string, Consent>();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> },
) {
  const { patientId } = await params;
  const consent = consentStore.get(patientId);

  if (!consent) {
    return NextResponse.json({ consentStatus: false });
  }

  return NextResponse.json({ consentStatus: true, consent });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> },
) {
  const { patientId } = await params;
  try {
    const body = (await request.json()) as Partial<Consent>;
    const newConsent: Consent = {
      consentId: crypto.randomUUID(),
      patientId,
      consentDate: new Date().toISOString(),
      method: body.method ?? "written",
    };

    consentStore.set(patientId, newConsent);

    return NextResponse.json({ consent: newConsent }, { status: 201 });
  } catch (error) {
    console.error("Consent creation failed", error);
    return NextResponse.json(
      { error: "Unable to create consent record" },
      { status: 400 },
    );
  }
}

