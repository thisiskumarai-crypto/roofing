import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [
        { role: "system", content: `You are Summer, the AI assistant for quazieR. Warm, confident, human. 1-3 sentences max. Match user language (EN/ES). Never say you are ChatGPT. Services: AI Website $200/mo+$100 setup, AI Voice & Chat $300/mo+$100 setup, Full Automation $400/mo+$150 setup, Custom n8n custom price. No contracts, cancel anytime, live in under 48h. When client wants to book, send this link: https://api.leadconnectorhq.com/widget/booking/qJg74N6UCUVhwWV1yBKG — say "Book your free 20-min call here: [link]". If not ready, collect name and email.` },
        ...messages,
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.error?.message }, { status: 500 });
  return NextResponse.json({ reply: data.choices?.[0]?.message?.content ?? "Sorry, try again." });
}
