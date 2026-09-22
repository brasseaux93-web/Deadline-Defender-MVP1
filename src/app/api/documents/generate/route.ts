import { NextRequest } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const PROMPTS: Record<string, (d: DocumentInput) => string> = {
  "Answer & Affirmative Defenses (RCW 59.18)": (d) => `
You are a paralegal assistant for a legal aid organization specializing in eviction defense in Washington State.
Draft a professional, court-ready Answer and Affirmative Defenses to an Unlawful Detainer complaint under RCW 59.18.

CASE DETAILS:
- Tenant: ${d.tenantName}
- Landlord / Plaintiff: ${d.landlordName}
- Case Number: ${d.caseNumber}
- Court Jurisdiction: ${d.courtJurisdiction}
- Notice Type: ${d.noticeType}
- Arrears Alleged: ${d.arrearsAmount || "not specified"}

INSTRUCTIONS:
- Use standard Washington State Superior/District Court pleading format (caption, introduction, numbered paragraphs, signature block).
- Include a General Denial of all allegations.
- Assert the following Affirmative Defenses where facts support them: (1) Landlord's Failure to Maintain Habitable Premises (RCW 59.18.060), (2) Retaliatory Eviction (RCW 59.18.240), (3) Waiver of Breach, (4) Improper Notice (RCW 59.12.030), (5) Violation of Just Cause Eviction Ordinance if applicable.
- Use bracketed placeholders [INSERT DATE], [ADVOCATE NAME], [BAR NUMBER] for any information not provided.
- Do not invent facts. Do not include legal advice disclaimers in the body of the pleading.
- Format as a clean markdown document with headings and numbered paragraphs.
`.trim(),

  "Motion to Stay Execution of Writ of Restitution": (d) => `
You are a paralegal assistant for a legal aid organization specializing in eviction defense in Washington State.
Draft a Motion to Stay Execution of Writ of Restitution for filing in ${d.courtJurisdiction}.

CASE DETAILS:
- Tenant / Movant: ${d.tenantName}
- Landlord / Respondent: ${d.landlordName}
- Case Number: ${d.caseNumber}
- Court Jurisdiction: ${d.courtJurisdiction}
- Notice Type: ${d.noticeType}
- Arrears at Issue: ${d.arrearsAmount || "not specified"}

INSTRUCTIONS:
- Use standard Washington State court caption and pleading format.
- Structure: (1) Introduction & Relief Requested, (2) Statement of Facts, (3) Legal Standard (cite RCW 59.18.370 and CR 62), (4) Argument — Irreparable Harm, Balance of Equities, Likelihood of Success, Public Interest, (5) Conclusion.
- Include a proposed Order granting the stay at the end.
- Use bracketed placeholders for missing information.
- Format as a clean markdown document suitable for court filing.
`.trim(),

  "Tenant Hardship Declaration & Payment Plan Proposal": (d) => `
You are a paralegal assistant for a legal aid organization specializing in eviction defense in Washington State.
Draft a Tenant Hardship Declaration and Payment Plan Proposal for ${d.tenantName}.

CASE DETAILS:
- Tenant: ${d.tenantName}
- Landlord: ${d.landlordName}
- Case Number: ${d.caseNumber}
- Court Jurisdiction: ${d.courtJurisdiction}
- Notice Type: ${d.noticeType}
- Total Arrears Alleged: ${d.arrearsAmount || "not specified"}

INSTRUCTIONS:
- Draft a sworn declaration in first person from the tenant's perspective.
- Sections: (1) Introduction (tenant identifying information), (2) Hardship Circumstances (economic disruption, job loss, medical, etc. — use [DESCRIBE HARDSHIP] placeholder), (3) Current Financial Situation (income, expenses — use placeholders), (4) Payment Plan Proposal (structured monthly catch-up payments — propose a 6-month plan using placeholder amounts), (5) Good Faith Statement, (6) Declaration Under Penalty of Perjury.
- Reference Washington's Eviction Resolution Program and any applicable rental assistance programs.
- Keep the tone factual, dignified, and non-adversarial.
- Format as a clean markdown document.
`.trim(),
};

interface DocumentInput {
  caseNumber: string;
  tenantName: string;
  landlordName: string;
  noticeType: string;
  arrearsAmount?: string;
  courtJurisdiction: string;
  documentType: string;
}

const MOCK_CONTENT: Record<string, string> = {
  "Answer & Affirmative Defenses (RCW 59.18)": `# IN THE DISTRICT COURT OF KING COUNTY, WASHINGTON

**[Landlord Name], Plaintiff,**
v.
**[Tenant Name], Defendant.**

**Case No.:** [CASE NUMBER]

---

## DEFENDANT'S ANSWER AND AFFIRMATIVE DEFENSES

**COMES NOW** the Defendant, [Tenant Name], by and through their advocate, and hereby answers the Complaint for Unlawful Detainer as follows:

### I. GENERAL DENIAL

Defendant denies each and every allegation contained in Plaintiff's Complaint not expressly admitted herein.

### II. AFFIRMATIVE DEFENSES

**First Defense — Failure to Maintain Habitable Premises (RCW 59.18.060)**
Plaintiff failed to maintain the premises in a habitable condition...

> *[MOCK DOCUMENT — Add your GROQ_API_KEY to .env.local to generate a complete, real document]*`,
};

export async function POST(request: NextRequest) {
  try {
    const body: DocumentInput = await request.json();
    const { caseNumber, tenantName, landlordName, noticeType, arrearsAmount, courtJurisdiction, documentType } = body;

    if (!tenantName || !documentType) {
      return new Response(
        JSON.stringify({ error: "tenantName and documentType are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const promptFn = PROMPTS[documentType];
    if (!promptFn) {
      return new Response(
        JSON.stringify({ error: `Unknown documentType: ${documentType}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    const hasRealKey = apiKey && apiKey !== "your_api_key_here" && apiKey.length > 10;

    if (!hasRealKey) {
      // Return mock SSE stream
      const mockContent = MOCK_CONTENT[documentType] || `# Mock Document\n\nThis is a mock draft for **${documentType}**.\n\nTenant: ${tenantName}\nCase: ${caseNumber}\n\n> Add your GROQ_API_KEY to .env.local for real AI-generated documents.`;
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Simulate streaming by chunking the mock content
          const words = mockContent.split(" ");
          for (let i = 0; i < words.length; i++) {
            const chunk = (i === 0 ? "" : " ") + words[i];
            const data = `data: ${JSON.stringify({ content: chunk })}\n\n`;
            controller.enqueue(encoder.encode(data));
            await new Promise((r) => setTimeout(r, 30));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no",
        },
      });
    }

    const prompt = promptFn({
      caseNumber,
      tenantName,
      landlordName,
      noticeType,
      arrearsAmount,
      courtJurisdiction,
      documentType,
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert paralegal assistant specializing in Washington State eviction defense law. Draft clear, professional, court-ready legal documents based on the information provided. Always use bracketed placeholders for missing information. Never fabricate facts.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 4096,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content ?? "";
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("[documents/generate] Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate document" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
