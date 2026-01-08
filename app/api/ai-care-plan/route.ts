import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not set" },
      { status: 500 },
    );
  }

  try {
    const { form } = (await request.json()) as { form: Record<string, unknown> };

    // Instantiate inside handler so builds do not require the key.
    const client = new OpenAI({ apiKey });

    const prompt = [
      "You are an APCM care coordinator drafting an initial care plan.",
      "Return STRICT Markdown with headings and tables only (no prose outside tables).",
      "Use this exact section order and column headers:",
      "1) Demographics table (Patient Name | DOB/Age | MRN | Care Coordinator)",
      "2) Chronic Conditions table (Condition | Status | Changes | Provider Aware)",
      "3) Patient Goals & Progress table (Goal Description | Barriers | Progress | Coordinator Actions)",
      "4) Medication Review table (Medication/Dose | Adherence Status | Issues)",
      "5) Healthcare Utilization & Care Transitions table (Event Type | Occurred | Provider Details | Follow-up)",
      "6) Risk Assessment & Safety table (Risk Assessment | Score/Status | Safety Flags | Response)",
      "7) Education Provided table (Topics Covered | Patient Understanding | Resources)",
      "8) Coordinator Clinical Assessment table (Overall Assessment | Recommended Actions)",
      "9) Care Coordination & Communication table (Care Team Member | Communication Type | Date)",
      "10) APCM Service Elements Attestation table (# | Service Element | Documented Yes/No)",
      "Use concise, patient-friendly language that providers and billers can read.",
      "If data is missing, leave the cell blank, but keep the table structure.",
      "",
      `Form data (JSON): ${JSON.stringify(form, null, 2)}`,
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content:
            "Generate an APCM-compliant initial care plan. Keep to short bullets, clinical accuracy, and clear action items.",
        },
        { role: "user", content: prompt },
      ],
    });

    const plan = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("AI care plan generation failed", error);
    return NextResponse.json(
      { error: "Unable to generate care plan" },
      { status: 500 },
    );
  }
}
