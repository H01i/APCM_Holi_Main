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
      "Return STRICT Markdown with only headings and tables (no prose, no bullet lists, no code fences).",
      "Formatting rules (must follow exactly):",
      "- Start with `## Demographics` and use level-2 headings (`##`) for every section.",
      "- Each table must have: header row, separator row with `---` per column, then at least one data row.",
      "- No blank lines between a header row and its separator. Use a single blank line between sections only.",
      "- No extra text before/after the tables.",
      "Section order and columns (must match exactly):",
      "## Demographics",
      "| Patient Name | DOB/Age | MRN | Care Coordinator |",
      "| --- | --- | --- | --- |",
      "## Chronic Conditions",
      "| Condition | Status | Changes | Provider Aware |",
      "| --- | --- | --- | --- |",
      "## Patient Goals & Progress",
      "| Goal Description | Barriers | Progress | Coordinator Actions |",
      "| --- | --- | --- | --- |",
      "## Medication Review",
      "| Medication/Dose | Adherence Status | Issues |",
      "| --- | --- | --- |",
      "## Healthcare Utilization & Care Transitions",
      "| Event Type | Occurred | Provider Details | Follow-up |",
      "| --- | --- | --- | --- |",
      "## Risk Assessment & Safety",
      "| Risk Assessment | Score/Status | Safety Flags | Response |",
      "| --- | --- | --- | --- |",
      "## Education Provided",
      "| Topics Covered | Patient Understanding | Resources |",
      "| --- | --- | --- |",
      "## Coordinator Clinical Assessment",
      "| Overall Assessment | Recommended Actions |",
      "| --- | --- |",
      "## Care Coordination & Communication",
      "| Care Team Member | Communication Type | Date |",
      "| --- | --- | --- |",
      "## APCM Service Elements Attestation",
      "| # | Service Element | Documented Yes/No |",
      "| --- | --- | --- |",
      "Use concise, patient-friendly language that providers and billers can read.",
      "If data is missing, leave the cell blank, but keep the table structure and at least one row per table.",
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
