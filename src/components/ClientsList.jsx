import React from 'react';
import { useGame } from '../context/GameContext';

const ClientsList = () => {
    const { clients } = useGame();

    return (
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col gap-4 h-full max-h-[80vh]">
            <h2 className="text-lg font-bold text-slate-200 flex justify-between items-center border-b-2 border-slate-800 pb-4">
                <span>Your Clients</span>
                <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded uppercase border border-indigo-500/50">
                    {clients.length}
                </span>
            </h2>

            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
                {clients.length === 0 ? (
                    <div className="text-center p-10 text-slate-600 italic">
                        No active clients yet.
                    </div>
                ) : (
                    clients.map(client => {
                        const rarityColors = {
                            rare: 'border-blue-500',
                            epic: 'border-purple-500',
                            legendary: 'border-yellow-500'
                        };
                        const rarityLabels = {
                            rare: 'Rare',
                            epic: 'Epic',
                            legendary: 'Legendary'
                        };
                        return (
                            <div 
                                key={client.id}
                                className={`p-4 rounded-lg border-l-4 ${
                                    client.daysRemaining === 1 
                                        ? 'bg-red-950/30 border-red-500' 
                                        : `bg-slate-800/50 ${rarityColors[client.rarity] || 'border-pink-500'}`
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-slate-200">{client.name}</span>
                                        {client.rarity && (
                                            <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                                                client.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                                                client.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {rarityLabels[client.rarity]}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`inline-block w-2 h-2 rounded-full ${
                                        client.daysRemaining > 1 ? 'bg-emerald-400' : 'bg-red-500'
                                    }`}></span>
                                </div>
                                <div className="mt-2 text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded inline-block">
                                    {client.daysRemaining} days left
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ClientsList;
