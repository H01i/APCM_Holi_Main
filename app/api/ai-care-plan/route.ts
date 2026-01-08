import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not set" },
      { status: 500 },
    );
  }

  try {
    const { form } = (await request.json()) as { form: Record<string, unknown> };

    const prompt = [
      "You are an APCM care coordinator drafting an initial care plan.",
      "Use concise bullet points and keep it patient-friendly.",
      "Highlight: conditions, meds/polypharmacy, adherence, functional status, SDOH barriers, risk/safety, two goals with targets/barriers/interventions, follow-ups, consent status.",
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
