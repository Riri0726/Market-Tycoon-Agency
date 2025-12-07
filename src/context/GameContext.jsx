import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { ARCHETYPES, VIEW_PAYOUT_THRESHOLD, VIEW_PAYOUT_AMOUNT, MAX_VIEWS_PER_POST, DAY_DURATION_MS, MAX_CLIENT_SLOTS } from '../config/archetypes';

const GameContext = createContext();

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        money: 100.00,
        day: 1,
        totalViews: 0,
        unclaimedViews: 0,
        isDayActive: false,
        prospects: [],
        clients: [],
        posts: [],
        activePitchIndex: null,
        currentPitchOptions: [],
        toastMessage: '',
        showToast: false,
        dayProgress: 0,
        maxClientSlots: MAX_CLIENT_SLOTS,
        preparingPitch: null, // Track if a pitch is being prepared
        dailyHistory: [], // Track daily net profit/loss for analytics
        previousDayMoney: 100.00, // Track money at start of day
    });

    const simulationInterval = useRef(null);
    const progressInterval = useRef(null);

    // Generate daily prospects
    const generateDailyProspects = useCallback(() => {
        const count = Math.floor(Math.random() * 3) + 3; // 3-5 leads
        const newProspects = [];
        
        for (let i = 0; i < count; i++) {
            const arch = getRandom(ARCHETYPES);
            // Some producers require preparation turn (30% chance for epic/legendary)
            const requiresPreparation = (arch.rarity === 'epic' || arch.rarity === 'legendary') && Math.random() < 0.3;
            
            newProspects.push({
                id: Date.now() + i,
                name: arch.name || arch.type,
                arch: arch,
                taste: arch.taste,
                contractDays: Math.floor(Math.random() * 3) + 3, // 3-5 days
                pitchCost: arch.pitchCost || 20.00,
                rarity: arch.rarity || 'rare',
                requiresPreparation: requiresPreparation,
                preparationTurn: requiresPreparation ? 1 : 0 // 1 turn preparation if required
            });
        }
        
        setGameState(prev => ({ ...prev, prospects: newProspects }));
    }, []);

    // Prepare pitch (pay cost)
    const preparePitch = useCallback((index) => {
        if (gameState.isDayActive) {
            showToast("Cannot pitch during work hours!");
            return;
        }

        const p = gameState.prospects[index];
        if (!p) return;

        // Check if we have enough money
        if (gameState.money < p.pitchCost) {
            showToast(`Insufficient funds! Need $${p.pitchCost.toFixed(2)}`);
            return;
        }

        // Check client slot limit
        if (gameState.clients.length >= gameState.maxClientSlots) {
            showToast(`Client slots full! (${gameState.maxClientSlots}/${gameState.maxClientSlots})`);
            return;
        }

        // Pay preparation cost
        setGameState(prev => {
            const updatedProspects = [...prev.prospects];
            updatedProspects[index] = {
                ...updatedProspects[index],
                pitchPaid: true
            };

            return {
                ...prev,
                money: prev.money - p.pitchCost,
                preparingPitch: index,
                prospects: updatedProspects
            };
        });

        // If requires preparation turn, wait for next day
        if (p.requiresPreparation && p.preparationTurn > 0) {
            showToast(`Pitch preparation started! Producer will review in ${p.preparationTurn} turn(s).`);
            return;
        }

        // Otherwise, start pitch immediately
        setTimeout(() => startPitch(index), 100);
    }, [gameState.isDayActive, gameState.prospects, gameState.money, gameState.clients.length, gameState.maxClientSlots]);

    // Start pitch (after preparation)
    const startPitch = useCallback((index) => {
        setGameState(prev => {
            const p = prev.prospects[index];
            if (!p) return prev;

            let options = [];
            options.push({ text: getRandom(p.arch.wins), valid: true });
            
            for (let i = 0; i < 3; i++) {
                options.push({ text: getRandom(p.arch.fails), valid: false });
            }
            options.sort(() => Math.random() - 0.5);

            return {
                ...prev,
                activePitchIndex: index,
                currentPitchOptions: options,
                preparingPitch: null
            };
        });
    }, []);

    // Resolve pitch
    const resolvePitch = useCallback((isSuccess) => {
        const p = gameState.prospects[gameState.activePitchIndex];
        if (!p) return;

        // For pitches requiring preparation, producer can decline even with correct answer (20% chance)
        let finalSuccess = isSuccess;
        if (p.requiresPreparation && isSuccess) {
            finalSuccess = Math.random() > 0.2; // 80% accept rate after preparation
        }

        if (finalSuccess) {
            const newClient = {
                ...p,
                daysRemaining: p.contractDays,
                postSpeed: Math.random() * 15 + 8 // Slightly slower post generation
            };
            
            setGameState(prev => ({
                ...prev,
                clients: [...prev.clients, newClient],
                prospects: prev.prospects.filter((_, idx) => idx !== prev.activePitchIndex),
                activePitchIndex: null,
                currentPitchOptions: []
            }));
            
            showToast(`✅ Signed ${p.name} for ${p.contractDays} days!`);
        } else {
            setGameState(prev => ({
                ...prev,
                prospects: prev.prospects.filter((_, idx) => idx !== prev.activePitchIndex),
                activePitchIndex: null,
                currentPitchOptions: []
            }));
            
            if (p.requiresPreparation && isSuccess) {
                showToast(`❌ Producer declined after consideration.`);
            } else {
                showToast(`❌ Pitch Failed.`);
            }
        }
    }, [gameState.prospects, gameState.activePitchIndex]);

    // Close pitch modal
    const closePitchModal = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            activePitchIndex: null,
            currentPitchOptions: []
        }));
    }, []);

    // Start work day
    const startWorkDay = useCallback(() => {
        if (gameState.isDayActive) return;
        
        setGameState(prev => ({ ...prev, isDayActive: true, dayProgress: 0 }));
        showToast("Work day started!");
    }, [gameState.isDayActive]);

    // End day
    const endDay = useCallback(() => {
        setGameState(prev => {
            // Calculate daily net profit/loss
            const dayNet = prev.money - prev.previousDayMoney;
            const dailyRecord = {
                day: prev.day,
                netProfit: dayNet,
                money: prev.money,
                clients: prev.clients.length
            };

            // Process contracts
            const updatedClients = prev.clients.map(c => ({
                ...c,
                daysRemaining: c.daysRemaining - 1
            }));
            
            const activeBefore = prev.clients.length;
            const filteredClients = updatedClients.filter(c => c.daysRemaining > 0);
            const expiredCount = activeBefore - filteredClients.length;

            // Process preparing pitches (reduce preparation turn)
            const updatedProspects = prev.prospects.map((prospect, idx) => {
                if (prospect.requiresPreparation && prospect.preparationTurn > 0 && prospect.pitchPaid) {
                    const newTurn = prospect.preparationTurn - 1;
                    if (newTurn === 0) {
                        // Pitch is ready, start it after a short delay
                        setTimeout(() => {
                            setGameState(current => {
                                const currentProspect = current.prospects[idx];
                                if (currentProspect && currentProspect.preparationTurn === 0 && currentProspect.pitchPaid) {
                                    startPitch(idx);
                                }
                                return current;
                            });
                        }, 500);
                    }
                    return {
                        ...prospect,
                        preparationTurn: newTurn,
                        pitchReady: newTurn === 0
                    };
                }
                return prospect;
            });

            let msg = `Day ${prev.day} ended. `;
            if (expiredCount > 0) msg += `${expiredCount} contracts expired. `;
            if (dayNet > 0) msg += `+$${dayNet.toFixed(2)} profit. `;
            else if (dayNet < 0) msg += `-$${Math.abs(dayNet).toFixed(2)} loss. `;
            msg += `New prospects available.`;
            
            showToast(msg);

            return {
                ...prev,
                isDayActive: false,
                day: prev.day + 1,
                dayProgress: 0,
                clients: filteredClients,
                prospects: updatedProspects,
                dailyHistory: [...prev.dailyHistory, dailyRecord].slice(-30), // Keep last 30 days
                previousDayMoney: prev.money
            };
        });

        // Generate new prospects after state update
        setTimeout(generateDailyProspects, 100);
    }, [generateDailyProspects, startPitch]);

    // Show toast
    const showToast = useCallback((message) => {
        setGameState(prev => ({ ...prev, toastMessage: message, showToast: true }));
        setTimeout(() => {
            setGameState(prev => ({ ...prev, showToast: false }));
        }, 3000);
    }, []);

    // Day progress animation
    useEffect(() => {
        if (gameState.isDayActive) {
            progressInterval.current = setInterval(() => {
                setGameState(prev => {
                    const newProgress = prev.dayProgress + (100 / (DAY_DURATION_MS / 100));
                    if (newProgress >= 100) {
                        clearInterval(progressInterval.current);
                        setTimeout(() => endDay(), 100);
                        return { ...prev, dayProgress: 100 };
                    }
                    return { ...prev, dayProgress: newProgress };
                });
            }, 100);

            return () => clearInterval(progressInterval.current);
        }
    }, [gameState.isDayActive, endDay]);

    // Simulation loop
    useEffect(() => {
        if (!gameState.isDayActive) return;

        simulationInterval.current = setInterval(() => {
            setGameState(prev => {
                let newState = { ...prev };
                let newViews = 0;

                // Clients generate posts (slower rate - 2% chance per interval)
                newState.clients.forEach(c => {
                    if (Math.random() * 100 < 2) {
                        const template = getRandom(c.arch.postTemplates);
                        const post = {
                            id: Date.now() + Math.random(),
                            author: c.name,
                            content: template,
                            views: 0,
                            velocity: Math.random() * 3 + 0.5, // Slower view growth
                            capped: false
                        };
                        newState.posts = [post, ...newState.posts];
                        if (newState.posts.length > 30) newState.posts.pop();
                    }
                });

                // Posts generate views (not always going up - 70% chance)
                newState.posts = newState.posts.map(post => {
                    if (!post.capped) {
                        // Views don't always go up
                        if (Math.random() < 0.7) {
                            const updatedPost = { ...post, views: post.views + post.velocity };
                            newViews += post.velocity;
                            
                            if (updatedPost.views >= MAX_VIEWS_PER_POST) {
                                updatedPost.views = MAX_VIEWS_PER_POST;
                                updatedPost.capped = true;
                            }
                            return updatedPost;
                        }
                        return post; // No view increase this interval
                    }
                    return post;
                });

                // Monetization
                newState.totalViews += newViews;
                newState.unclaimedViews += newViews;

                while (newState.unclaimedViews >= VIEW_PAYOUT_THRESHOLD) {
                    newState.money += VIEW_PAYOUT_AMOUNT;
                    newState.unclaimedViews -= VIEW_PAYOUT_THRESHOLD;
                }

                return newState;
            });
        }, 100);

        return () => clearInterval(simulationInterval.current);
    }, [gameState.isDayActive]);

    // Initialize game
    useEffect(() => {
        if (gameState.day === 1 && gameState.prospects.length === 0) {
            generateDailyProspects();
            setGameState(prev => ({ ...prev, previousDayMoney: prev.money }));
        }
    }, []);

    const value = {
        ...gameState,
        preparePitch,
        startPitch,
        resolvePitch,
        closePitchModal,
        startWorkDay,
        generateDailyProspects,
        showToast
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
