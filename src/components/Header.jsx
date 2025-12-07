import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ money, day, totalViews, onShowAnalytics }) => {
    return (
        <header className="bg-slate-900 shadow-lg border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <Link to="/" className="flex flex-col hover:opacity-80 transition-opacity">
                    <div className="flex items-center gap-2 text-xl font-extrabold text-indigo-400">
                        <span>🚀</span> Market Tycoon Agency
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono tracking-wider">
                        v0.1.1
                    </div>
                </Link>
                <Link 
                    to="/producers" 
                    className="text-sm text-slate-400 hover:text-slate-200 px-3 py-1 rounded border border-slate-700 hover:border-indigo-500/50 transition-colors"
                >
                    Producers
                </Link>
            </div>
            <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full font-semibold text-sm border border-slate-700">
                    <span>📅</span>
                    <span className="text-slate-200">Day {day}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full font-semibold text-sm border border-slate-700">
                    <span>💰</span>
                    <span className="text-emerald-400 font-mono">${money.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full font-semibold text-sm border border-slate-700">
                    <span>👁️</span>
                    <span className="text-indigo-400 font-mono">{Math.floor(totalViews).toLocaleString()}</span>
                </div>
                {onShowAnalytics && (
                    <button
                        onClick={onShowAnalytics}
                        className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/30 px-4 py-2 rounded-full font-semibold text-sm border border-indigo-500/50 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        <span>📊</span>
                        Analytics
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;

