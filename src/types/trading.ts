export type ExperienceLevel = "debutant" | "intermediaire" | "avance";
export type TradingStyle = "scalping" | "day_trading" | "swing" | "investing";

export interface TradingProfileInput {
  fullname: string;
  experienceLevel: ExperienceLevel;
  capital: number;
  riskPerTradePct: number;
  maxDailyLossPct: number;
  maxTradesPerDay: number;
  markets: string[];
  timeframe: string;
  style: TradingStyle;
  sessions: string[];
  propFirm?: string;
  mainGoal: string;
  constraints: string;
}
