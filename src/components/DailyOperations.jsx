import React from 'react';
import { useGame } from '../context/GameContext';

const DailyOperations = () => {
    const { 
        isDayActive, 
        dayProgress, 
        prospects, 
        preparePitch, 
        startWorkDay, 
        generateDailyProspects,
        clients,
        maxClientSlots,
        money
    } = useGame();

    return (
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col gap-4 h-full max-h-[80vh]">
            <h2 className="text-lg font-bold text-slate-200 flex justify-between items-center border-b-2 border-slate-800 pb-4">
                <span>Daily Operations</span>
                <span className={`text-xs px-3 py-1 rounded font-bold ${
                    isDayActive 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                    {isDayActive ? 'Work Day Active' : 'Planning Phase'}
                </span>
            </h2>

            {/* Progress Bar */}
            {isDayActive && (
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div 
                        className="h-full bg-indigo-500 transition-all duration-100 ease-linear shadow-lg shadow-indigo-500/50"
                        style={{ width: `${dayProgress}%` }}
                    />
                </div>
            )}

            <p className="text-sm text-slate-400 mt-0">
                Review today's prospects. Pitch to them to sign contracts. When ready, start the workday to generate revenue.
            </p>

            <button
                onClick={startWorkDay}
                disabled={isDayActive}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
                <span>☀️</span> Start Work Day (20s)
            </button>

            <div className="mt-6 border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-sm text-slate-300">Prospects (Expires Tonight)</span>
                    <span className="text-sm text-slate-500">{prospects.length}</span>
                </div>
                <div className="mb-2 text-xs text-slate-500">
                    Client Slots: {clients.length}/{maxClientSlots}
                </div>

                <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1 max-h-[300px]">
                    {prospects.length === 0 ? (
                        <div className="text-center p-5 text-slate-600 italic text-sm">
                            No more prospects today.
                        </div>
                    ) : (
                        prospects.map((p, idx) => {
                            const canAfford = money >= p.pitchCost;
                            const hasSlot = clients.length < maxClientSlots;
                            const rarityColors = {
                                rare: 'border-blue-500/50 bg-blue-500/10',
                                epic: 'border-purple-500/50 bg-purple-500/10',
                                legendary: 'border-yellow-500/50 bg-yellow-500/10'
                            };
                            const rarityLabels = {
                                rare: 'Rare',
                                epic: 'Epic',
                                legendary: 'Legendary'
                            };

                            return (
                                <div 
                                    key={p.id}
                                    className={`border ${rarityColors[p.rarity] || 'border-slate-700'} bg-slate-800/50 hover:bg-slate-800 hover:border-indigo-500/50 p-4 rounded-lg transition-all`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="font-bold text-sm text-slate-200">{p.name}</div>
                                                <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                                                    p.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    p.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                    {rarityLabels[p.rarity] || 'Rare'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Taste: {p.taste} • {p.contractDays} Day Contract
                                            </div>
                                            {p.requiresPreparation && (
                                                <div className="text-xs text-orange-400 mt-1">
                                                    ⏳ Requires {p.preparationTurn} turn(s) preparation
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => preparePitch(idx)}
                                        disabled={!canAfford || !hasSlot || isDayActive}
                                        className={`w-full font-semibold text-xs px-3 py-2 rounded-md transition-colors shadow-lg ${
                                            canAfford && hasSlot
                                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {!canAfford ? `Need $${p.pitchCost.toFixed(2)}` :
                                         !hasSlot ? 'Slots Full' :
                                         `Prepare Pitch ($${p.pitchCost.toFixed(2)})`}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                <button
                    onClick={generateDailyProspects}
                    disabled={isDayActive}
                    className="mt-4 w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:cursor-not-allowed disabled:text-slate-700 text-slate-300 font-semibold text-xs py-2 px-4 rounded-lg transition-all uppercase tracking-wider border border-slate-700"
                >
                    Reroll Prospects
                </button>
            </div>
        </div>
    );
};

export default DailyOperations;
