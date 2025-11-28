import React from "react";

export function FAQ() {
  const items = [
    {
      question: "Niveau d'expérience",
      answer: "Indiquez votre niveau actuel (Débutant, Intermédiaire, Avancé). L'IA adaptera la complexité du plan et les recommandations psychologiques en conséquence."
    },
    {
      question: "Style de trading",
      answer: "Définit votre horizon de temps : Scalping (très court terme), Day Trading (intraday, positions fermées le soir) ou Swing Trading (moyen/long terme)."
    },
    {
      question: "Capital ($)",
      answer: "Le montant total de votre compte. Ce chiffre est utilisé pour calculer les montants exacts de risque (en euros/dollars) dans votre plan."
    },
    {
      question: "Prop Firm (Optionnel)",
      answer: "Si vous tradez pour une firme (ex: FTMO, Apex), mentionnez-le. L'IA intégrera des règles spécifiques de gestion du drawdown et de respect des règles de la firme."
    },
    {
      question: "Risque par trade (%)",
      answer: "Le pourcentage de votre capital que vous acceptez de perdre sur une seule transaction. C'est la clé de la survie (généralement entre 0.5% et 2%)."
    },
    {
      question: "Perte max journalière (%)",
      answer: "Votre 'disjoncteur'. Si vous atteignez ce pourcentage de perte dans la journée, vous devez impérativement arrêter de trader pour protéger votre capital."
    },
    {
      question: "Max trades / jour",
      answer: "Une limite stricte pour éviter l'overtrading (trader par ennui ou vengeance). Moins de trades signifie souvent une meilleure sélectivité."
    },
    {
      question: "Timeframe(s)",
      answer: "Les unités de temps graphiques que vous utilisez pour l'analyse et la prise de décision (ex: M5 = 5 minutes, H1 = 1 heure, D1 = Journalier)."
    },
    {
      question: "Marchés",
      answer: "Les actifs sur lesquels vous intervenez (Paires Forex comme EURUSD, Indices comme NASDAQ/CAC40, Cryptos, ou Matières premières)."
    },
    {
      question: "Sessions de trading",
      answer: "Les plages horaires où vous êtes devant les écrans (ex: Session de Londres 09h-11h, Session US 15h30-17h30)."
    },
    {
      question: "Objectif principal",
      answer: "Votre but à court/moyen terme (ex: Valider un challenge, générer 5% par mois, apprendre à ne plus perdre)."
    },
    {
      question: "Contraintes & Règles spécifiques",
      answer: "Toute autre règle personnelle ou contrainte (ex: 'Pas de trading pendant les annonces économiques', 'Je ne trade que le mardi et jeudi')."
    }
  ];

  return (
    <section className="w-full max-w-4xl mx-auto mt-20 px-4">
      <h2 className="text-3xl font-bold text-center text-white mb-10">
        Comprendre les paramètres
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:bg-slate-800/50 transition-colors"
          >
            <h3 className="text-blue-400 font-semibold text-lg mb-2">{item.question}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
