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
      "Respond in clear Markdown with headings and bullets only; avoid long paragraphs.",
      "Sections: Summary, Conditions & Meds, Functional Status, SDOH & Risk, Goals (2+ with targets, barriers, interventions), Follow-up Plan, Consent/Access.",
      "Tone: professional, patient-friendly plain language that providers and billers can follow.",
      "Keep it concise and action-oriented.",
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
