import React from 'react';
import { useGame } from '../context/GameContext';

const Analytics = () => {
    const { dailyHistory, day } = useGame();

    const totalProfit = dailyHistory.reduce((sum, record) => sum + record.netProfit, 0);
    const positiveDays = dailyHistory.filter(r => r.netProfit > 0).length;
    const negativeDays = dailyHistory.filter(r => r.netProfit < 0).length;
    const neutralDays = dailyHistory.filter(r => r.netProfit === 0).length;

    return (
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800">
            <h2 className="text-lg font-bold text-slate-200 mb-4 border-b-2 border-slate-800 pb-4">
                Analytics Dashboard
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Total Profit</div>
                    <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ${totalProfit.toFixed(2)}
                    </div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Days Tracked</div>
                    <div className="text-2xl font-bold text-slate-200">{dailyHistory.length}</div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-300 mb-3">Day Performance</h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded">
                        <span className="text-sm text-slate-400">Positive Days</span>
                        <span className="text-emerald-400 font-bold">{positiveDays}</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded">
                        <span className="text-sm text-slate-400">Negative Days</span>
                        <span className="text-red-400 font-bold">{negativeDays}</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded">
                        <span className="text-sm text-slate-400">Neutral Days</span>
                        <span className="text-slate-400 font-bold">{neutralDays}</span>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-300 mb-3">Recent History</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {dailyHistory.length === 0 ? (
                        <div className="text-center p-4 text-slate-600 text-sm">
                            No history yet. Complete days to see analytics.
                        </div>
                    ) : (
                        dailyHistory.slice().reverse().map((record, idx) => (
                            <div 
                                key={idx}
                                className={`bg-slate-800/50 p-3 rounded border-l-4 ${
                                    record.netProfit > 0 ? 'border-emerald-500' :
                                    record.netProfit < 0 ? 'border-red-500' :
                                    'border-slate-600'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sm font-bold text-slate-200">Day {record.day}</div>
                                        <div className="text-xs text-slate-400">{record.clients} clients</div>
                                    </div>
                                    <div className={`font-bold ${
                                        record.netProfit > 0 ? 'text-emerald-400' :
                                        record.netProfit < 0 ? 'text-red-400' :
                                        'text-slate-400'
                                    }`}>
                                        {record.netProfit >= 0 ? '+' : ''}${record.netProfit.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;

