import React from 'react';
import { ARCHETYPES } from '../config/archetypes';

const Producers = () => {
    const rarityGroups = {
        rare: ARCHETYPES.filter(a => a.rarity === 'rare'),
        epic: ARCHETYPES.filter(a => a.rarity === 'epic'),
        legendary: ARCHETYPES.filter(a => a.rarity === 'legendary')
    };

    const rarityColors = {
        rare: {
            border: 'border-blue-500/50',
            bg: 'bg-blue-500/10',
            text: 'text-blue-400',
            label: 'Rare'
        },
        epic: {
            border: 'border-purple-500/50',
            bg: 'bg-purple-500/10',
            text: 'text-purple-400',
            label: 'Epic'
        },
        legendary: {
            border: 'border-yellow-500/50',
            bg: 'bg-yellow-500/10',
            text: 'text-yellow-400',
            label: 'Legendary'
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-200 mb-2">Producer Directory</h1>
                    <p className="text-slate-400">All available producers in the market</p>
                </div>

                {Object.entries(rarityGroups).map(([rarity, producers]) => (
                    <div key={rarity} className="mb-8">
                        <div className={`flex items-center gap-3 mb-4 p-3 rounded-lg ${rarityColors[rarity].bg} ${rarityColors[rarity].border} border-2`}>
                            <h2 className={`text-xl font-bold ${rarityColors[rarity].text}`}>
                                {rarityColors[rarity].label} Producers
                            </h2>
                            <span className="text-sm text-slate-400">({producers.length})</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {producers.map((producer, idx) => (
                                <div 
                                    key={idx}
                                    className={`bg-slate-900 p-5 rounded-xl border-2 ${rarityColors[rarity].border} hover:border-opacity-100 transition-all`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-bold text-slate-200">{producer.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded font-bold ${rarityColors[rarity].bg} ${rarityColors[rarity].text}`}>
                                            {rarityColors[rarity].label}
                                        </span>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="text-xs text-slate-500 mb-1">Type</div>
                                        <div className="text-sm text-slate-300">{producer.type}</div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-xs text-slate-500 mb-1">Taste</div>
                                        <div className="text-sm bg-indigo-500/20 text-indigo-400 font-semibold px-2 py-1 rounded inline-block">
                                            {producer.taste}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-xs text-slate-500 mb-1">Pitch Cost</div>
                                        <div className="text-lg font-bold text-emerald-400">${producer.pitchCost.toFixed(2)}</div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-xs text-slate-500 mb-1">Winning Keywords</div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {producer.wins.slice(0, 3).map((keyword, kIdx) => (
                                                <span key={kIdx} className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Content Examples</div>
                                        <div className="text-xs text-slate-400 italic">
                                            "{producer.postTemplates[0]}"
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Producers;

