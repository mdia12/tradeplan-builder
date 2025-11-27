import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, plan, profile } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Config Error" }, { status: 500 });
    }

    const systemPrompt = `
Tu es un Coach de Trading expert et psychologue.
Ton but est d'aider le trader à respecter son plan et à s'améliorer.
Voici le profil du trader : ${JSON.stringify(profile)}
Voici son plan de trading actuel :
${plan}

Réponds aux questions du trader en te basant STRICTEMENT sur ce plan.
Sois concis, direct, et encourageant mais ferme sur la discipline.
Si le trader demande quelque chose qui viole son plan (ex: augmenter le risque), rappelle-lui à l'ordre.
`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            ...messages
        ],
        temperature: 0.7
      })
    });

    if (!res.ok) throw new Error("OpenAI Error");
    const data = await res.json();
    return NextResponse.json({ message: data.choices[0].message.content });

  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
