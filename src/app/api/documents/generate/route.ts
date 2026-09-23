import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { CLIENTS } from "@/lib/caseload";
import { fillInstrument, INSTRUMENT_CATALOG } from "@/lib/wa-instruments";
import type { InstrumentKind } from "@/lib/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  const body = await request.json();
  const kind = (body.documentType ?? body.kind) as InstrumentKind;
  const tenantName = String(body.tenantName ?? "");
  const client =
    CLIENTS.find((c) => c.id === body.clientId) ??
    CLIENTS.find((c) => c.legalName === tenantName || c.preferredName === tenantName) ??
    {
      ...CLIENTS[0],
      legalName: tenantName || CLIENTS[0].legalName,
      preferredName: tenantName || CLIENTS[0].preferredName,
      landlord: body.landlordName || CLIENTS[0].landlord,
      docket: body.caseNumber || CLIENTS[0].docket,
      court: body.courtJurisdiction || CLIENTS[0].court,
      noticeType: body.noticeType || CLIENTS[0].noticeType,
      arrears: body.arrearsAmount || CLIENTS[0].arrears,
    };

  const known = INSTRUMENT_CATALOG.some((i) => i.kind === kind);
  const instrument = fillInstrument(known ? kind : "answer-affirmative-defenses", client);
  const base = instrument.markdown;
  const apiKey = process.env.GROQ_API_KEY;
  const live = Boolean(apiKey && apiKey !== "your_api_key_here" && apiKey.length > 10);
  const encoder = new TextEncoder();

  if (!live) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: base })}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });
    return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } });
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    max_tokens: 4096,
    stream: true,
    messages: [
      { role: "system", content: "You refine Washington unlawful-detainer drafts. Keep captions, RCW citations, and party names exactly as supplied. Do not invent facts. Keep name markers intact." },
      { role: "user", content: `Polish for court readability without adding facts:\n\n${base}` },
    ],
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content ?? "";
          if (content) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } });
}
