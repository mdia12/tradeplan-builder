import { NextResponse } from "next/server";
import type { TradingProfileInput } from "@/types/trading";

function buildPrompt(p: TradingProfileInput, riskAmount: number, dailyLossAmount: number): string {
  return `
Crée un plan de trading complet en français, au format Markdown, pour le profil suivant :

Nom : ${p.fullname}
Niveau : ${p.experienceLevel}
Capital : ${p.capital}
Risque par trade : ${p.riskPerTradePct}% (soit ${riskAmount} €)
Perte max journalière : ${p.maxDailyLossPct}% (soit ${dailyLossAmount} €)
Max trades par jour : ${p.maxTradesPerDay}
Marchés : ${p.markets.join(", ")}
Timeframe : ${p.timeframe}
Style : ${p.style}
Sessions : ${p.sessions.join(", ")}
${p.propFirm ? `Prop Firm : ${p.propFirm}` : ""}
Objectif principal : ${p.mainGoal}
${p.constraints ? `Contraintes : ${p.constraints}` : ""}

Le plan doit commencer par une section "Résumé du plan (10 points clés)" contenant exactement 10 bullet points courts et percutants (à relire chaque matin) résumant :
1. Le profil du trader
2. Le style de trading
3. Les marchés
4. Le niveau de risque
5. Les horaires
6. Les règles principales d’entrée/sortie
7. Les règles de risk management
8. La discipline / psychologie
9. L’objectif principal
10. Un rappel “respect du plan avant tout”

Ensuite, le plan doit détailler les sections suivantes :
1. Objectif du plan
2. Profil du trader
3. Marchés & horaires autorisés
4. Règles d’entrée
5. Règles de sortie
6. Gestion du risque & taille de position
   - Rappeler le montant risqué par trade (${riskAmount} €) et la perte max journalière (${dailyLossAmount} €).
   - Donner une formule claire pour calculer la taille de position (Lots/Contrats) en fonction du Stop Loss.
   - Fournir un exemple concret (ex: Indices ou Forex).
   - Insister sur le respect strict de ce montant.
7. Score de discipline & engagement
   - Estimer un score sur 100 (ex: "Score discipline estimé : 72/100") basé sur le profil (expérience, risque, max trades, contraintes).
   - Expliquer ce score en quelques phrases (ton bienveillant mais direct).
   - Proposer 3 axes d’amélioration concrets pour augmenter ce score.
   - Préciser que c'est une estimation pédagogique pour aider à la responsabilisation.
8. Gestion émotionnelle
9. Routine journalière
10. Règles strictes (interdictions)
11. Plan d’amélioration continue
12. Plan d’action sur 30 jours
    - Structuré par semaine (Semaine 1 à 4).
    - Semaine 1 : Prise en main, habitudes, backtest.
    - Semaine 2 : Application en démo/taille réduite, journal de trading.
    - Semaine 3 : Montée progressive, discipline, routines.
    - Semaine 4 : Bilan complet, ajustements.
    - Chaque semaine doit contenir 3 à 5 actions concrètes (bullet points).
    - Ton réaliste, focus sur la discipline et la régularité, pas de promesses de gains.

Ton : Pédagogique, professionnel, réaliste. Pas de promesses de gains.
`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const profile: TradingProfileInput = body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY non configurée" },
        { status: 500 }
      );
    }

    const riskAmountPerTrade = (profile.capital * profile.riskPerTradePct) / 100;
    const maxDailyLossAmount = (profile.capital * profile.maxDailyLossPct) / 100;

    const prompt = buildPrompt(profile, riskAmountPerTrade, maxDailyLossAmount);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en trading et en risk management. Tu crées des plans de trading clairs, structurés, réalistes, sans promesses irréalistes."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("OpenAI API Error:", errorText);
      return NextResponse.json({ error: "Erreur OpenAI" }, { status: 500 });
    }

    const json = await res.json();
    const markdown = json.choices?.[0]?.message?.content ?? "Impossible de générer le plan. Réessaie.";

    return NextResponse.json({ markdown });

  } catch (error) {
    console.error("Error generating plan:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue" },
      { status: 500 }
    );
  }
}
