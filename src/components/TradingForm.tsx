"use client";

import React, { useState } from "react";
import type { TradingProfileInput, ExperienceLevel, TradingStyle } from "@/types/trading";

interface TradingFormProps {
  onSubmit: (data: TradingProfileInput) => void;
  loading?: boolean;
}

export function TradingForm({ onSubmit, loading = false }: TradingFormProps) {
  const [formData, setFormData] = useState({
    fullname: "",
    experienceLevel: "debutant" as ExperienceLevel,
    capital: 10000,
    riskPerTradePct: 1,
    maxDailyLossPct: 3,
    maxTradesPerDay: 3,
    markets: "EURUSD, NASDAQ",
    timeframe: "M15",
    style: "day_trading" as TradingStyle,
    sessions: "London, New York",
    propFirm: "",
    mainGoal: "",
    constraints: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle number fields
    if (["capital", "riskPerTradePct", "maxDailyLossPct", "maxTradesPerDay"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const marketsArray = formData.markets.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
    const sessionsArray = formData.sessions.split(",").map((s) => s.trim()).filter((s) => s.length > 0);

    const payload: TradingProfileInput = {
      ...formData,
      markets: marketsArray,
      sessions: sessionsArray,
    };

    onSubmit(payload);
  };

  const inputClass = "w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-500";
  const labelClass = "block text-sm font-medium text-slate-400 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-slate-200">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700/50 pb-4">Configuration du Profil</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fullname */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="fullname" className={labelClass}>Nom complet</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className={inputClass}
            placeholder="John Doe"
            required
          />
        </div>

        {/* Experience Level */}
        <div>
          <label htmlFor="experienceLevel" className={labelClass}>Niveau d'expérience</label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
          </select>
        </div>

        {/* Style */}
        <div>
          <label htmlFor="style" className={labelClass}>Style de trading</label>
          <select
            id="style"
            name="style"
            value={formData.style}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="scalping">Scalping</option>
            <option value="day_trading">Day Trading</option>
            <option value="swing">Swing Trading</option>
            <option value="investing">Investing</option>
          </select>
        </div>

        {/* Capital */}
        <div>
          <label htmlFor="capital" className={labelClass}>Capital ($)</label>
          <input
            type="number"
            id="capital"
            name="capital"
            value={formData.capital}
            onChange={handleChange}
            className={inputClass}
            min="0"
            step="100"
            required
          />
        </div>

        {/* Prop Firm */}
        <div>
          <label htmlFor="propFirm" className={labelClass}>Prop Firm (Optionnel)</label>
          <input
            type="text"
            id="propFirm"
            name="propFirm"
            value={formData.propFirm}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ex: FTMO, Apex..."
          />
        </div>

        {/* Risk Per Trade */}
        <div>
          <label htmlFor="riskPerTradePct" className={labelClass}>Risque par trade (%)</label>
          <input
            type="number"
            id="riskPerTradePct"
            name="riskPerTradePct"
            value={formData.riskPerTradePct}
            onChange={handleChange}
            className={inputClass}
            min="0.1"
            step="0.1"
            required
          />
        </div>

        {/* Max Daily Loss */}
        <div>
          <label htmlFor="maxDailyLossPct" className={labelClass}>Perte max journalière (%)</label>
          <input
            type="number"
            id="maxDailyLossPct"
            name="maxDailyLossPct"
            value={formData.maxDailyLossPct}
            onChange={handleChange}
            className={inputClass}
            min="0.1"
            step="0.1"
            required
          />
        </div>

        {/* Max Trades Per Day */}
        <div>
          <label htmlFor="maxTradesPerDay" className={labelClass}>Max trades / jour</label>
          <input
            type="number"
            id="maxTradesPerDay"
            name="maxTradesPerDay"
            value={formData.maxTradesPerDay}
            onChange={handleChange}
            className={inputClass}
            min="1"
            step="1"
            required
          />
        </div>

        {/* Timeframe */}
        <div>
          <label htmlFor="timeframe" className={labelClass}>Timeframe(s)</label>
          <input
            type="text"
            id="timeframe"
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ex: M5, M15, H1"
            required
          />
        </div>

        {/* Markets */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="markets" className={labelClass}>Marchés (séparés par des virgules)</label>
          <input
            type="text"
            id="markets"
            name="markets"
            value={formData.markets}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ex: EURUSD, NASDAQ, GOLD, BTCUSD"
            required
          />
        </div>

        {/* Sessions */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="sessions" className={labelClass}>Sessions de trading (séparées par des virgules)</label>
          <input
            type="text"
            id="sessions"
            name="sessions"
            value={formData.sessions}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ex: London Open, New York AM"
            required
          />
        </div>

        {/* Main Goal */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="mainGoal" className={labelClass}>Objectif principal</label>
          <input
            type="text"
            id="mainGoal"
            name="mainGoal"
            value={formData.mainGoal}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ex: Générer 5% par mois avec constance"
            required
          />
        </div>

        {/* Constraints */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="constraints" className={labelClass}>Contraintes & Règles spécifiques</label>
          <textarea
            id="constraints"
            name="constraints"
            value={formData.constraints}
            onChange={handleChange}
            className={`${inputClass} h-32 resize-none`}
            placeholder="Ex: Pas de news trading, max 2 pertes consécutives..."
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
            loading
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Génération en cours...
            </span>
          ) : (
            "Générer mon plan de trading"
          )}
        </button>
      </div>
    </form>
  );
}
