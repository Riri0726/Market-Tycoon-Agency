import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import Header from './components/Header';
import DailyOperations from './components/DailyOperations';
import LiveFeed from './components/LiveFeed';
import ClientsList from './components/ClientsList';
import PitchModal from './components/PitchModal';
import Toast from './components/Toast';
import Analytics from './components/Analytics';
import Producers from './pages/Producers';
import Footer from './components/Footer';

function GameContent() {
    const { money, day, totalViews } = useGame();
    const [showAnalytics, setShowAnalytics] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Header money={money} day={day} totalViews={totalViews} onShowAnalytics={() => setShowAnalytics(true)} />

            <main className="flex-1 p-6 overflow-y-auto max-w-screen-2xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr_300px] gap-6 items-start">
                <DailyOperations />
                <LiveFeed />
                <ClientsList />
            </main>

            {showAnalytics && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-200">Analytics Dashboard</h2>
                            <button
                                onClick={() => setShowAnalytics(false)}
                                className="text-slate-400 hover:text-slate-200 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <Analytics />
                    </div>
                </div>
            )}

            <PitchModal />
            <Toast />
            <Footer />
        </div>
    );
}

function ProducersPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Header money={0} day={1} totalViews={0} />
            <Producers />
            <Footer />
        </div>
    );
}

function App() {
    // Get base path for GitHub Pages (e.g., /market-tycoon-agency/)
    const basePath = import.meta.env.BASE_URL || '/';
    
    return (
        <Router basename={basePath}>
            <GameProvider>
                <Routes>
                    <Route path="/" element={<GameContent />} />
                    <Route path="/producers" element={<ProducersPage />} />
                </Routes>
            </GameProvider>
        </Router>
    );
}

export default App;
