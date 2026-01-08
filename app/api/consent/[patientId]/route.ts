import { NextRequest, NextResponse } from "next/server";
import { Consent } from "@/types/apcm";

const consentStore = new Map<string, Consent>();

export async function GET(
  _request: NextRequest,
  { params }: { params: { patientId: string } },
) {
  const consent = consentStore.get(params.patientId);

  if (!consent) {
    return NextResponse.json({ consentStatus: false });
  }

  return NextResponse.json({ consentStatus: true, consent });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { patientId: string } },
) {
  try {
    const body = (await request.json()) as Partial<Consent>;
    const newConsent: Consent = {
      consentId: crypto.randomUUID(),
      patientId: params.patientId,
      consentDate: new Date().toISOString(),
      method: body.method ?? "written",
    };

    consentStore.set(params.patientId, newConsent);

    return NextResponse.json({ consent: newConsent }, { status: 201 });
  } catch (error) {
    console.error("Consent creation failed", error);
    return NextResponse.json(
      { error: "Unable to create consent record" },
      { status: 400 },
    );
  }
}

