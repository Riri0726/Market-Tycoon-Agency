import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // To manage view changes for header/footer

// Import client archetype images
import techStartupImage from '../assets/tech_startup.png';
import bakeryImage from '../assets/bakery.png';
import gymImage from '../assets/gym.png';
import luxuryWatchImage from '../assets/luxury_watch.png';

// --- CONFIG (from original Game.jsx and MarketGame class) ---
const VIEW_PAYOUT_THRESHOLD = 100;
const VIEW_PAYOUT_AMOUNT = 0.50;
const MAX_VIEWS_PER_POST = 100;
const DAY_DURATION_MS = 10000; // 10 seconds per day

export const ARCHETYPES = [ // From original Game.jsx
    {
        type: "Tech Startup",
        taste: "Disruptive",
        wins: ["Scalable", "AI-Driven", "Next-Gen", "Seamless"],
        fails: ["Traditional", "Handmade", "Slow", "Vintage"],
        postTemplates: ["Just launched our beta! 🚀", "Disrupting the industry.", "AI is the future.", "Series A funding secured!"],
        image: techStartupImage
    },
    {
        type: "Bakery",
        taste: "Homey",
        wins: ["Warm", "Authentic", "Love", "Family"],
        fails: ["Corporate", "Cyber", "Fast", "Automated"],
        postTemplates: ["Fresh bread out of the oven! 🍞", "Made with love.", "Grandma's secret recipe.", "Coffee and cake morning."],
        image: bakeryImage
    },
    {
        type: "Gym",
        taste: "Hardcore",
        wins: ["Grind", "Power", "Sweat", "Iron"],
        fails: ["Soft", "Relax", "Gentle", "Sleep"],
        postTemplates: ["No pain no gain! 💪", "Leg day done.", "Crushing PRs.", "Grind never stops."],
        image: gymImage
    },
    {
        type: "Luxury Watch",
        taste: "Elegant",
        wins: ["Timeless", "Classy", "Gold", "Prestige"],
        fails: ["Cheap", "Quick", "Plastic", "Funky"],
        postTemplates: ["Timeless elegance. ⌚", "Swiss made perfection.", "A legacy for generations.", "Exclusive release."],
        image: luxuryWatchImage
    }
];

export const CLIMATES = { // From MarketGame class
    'Bull Market': { icon: 'trending-up', color: 'text-emerald-400' },
    'Bear Market': { icon: 'trending-down', color: 'text-red-400' },
    'Neutral': { icon: 'minus', color: 'text-slate-400' },
    'Volatile': { icon: 'activity', color: 'text-orange-400' }
};

export const TIERS = ["Intern", "Analyst", "Associate", "Trader", "Broker",
    "Manager", "Director", "VP", "Executive", "Chairman"];


const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- GameContext ---
const GameContext = createContext();

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

// --- Default Initial Game State ---
const defaultInitialState = {
    // Core Agency Game State
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
    dayProgress: 0, // 0-100%
    showLoanModal: false, // Initial state for loan modal

    // MarketGame Adapted State
    marketClimate: 'Neutral', // New: Influences prospect generation/difficulty
    loan: { active: false, amount: 0, dueDay: 0, interestRate: 0.05 }, // Adapted from loan system
    xp: 0,
    tierIndex: 0, // Maps to TIERS array
    rank: 1, // 1-5 within a tier
    history: [], // For tracking signed clients/major achievements

    // Simulation Controls
    simSpeed: 1, // 1x, 2x, 4x
    simPaused: false,
};

export const GameProvider = ({ children }) => {
    // --- Game State (Combined and Adapted) ---
    const [gameState, setGameState] = useState(() => {
        const savedState = localStorage.getItem('marketTycoonSave_v1'); // New save key
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                // Merge loaded state with default state to ensure all properties are present
                return { ...defaultInitialState, ...parsedState };
            } catch (e) {
                console.error("Failed to parse saved game state, starting new game:", e);
                return defaultInitialState;
            }
        }
        return defaultInitialState;
    });

    const location = useLocation(); // For managing header/footer visibility

    // Using a ref for simulation interval to prevent stale closures
    const simulationIntervalRef = useRef(null);
    const dayProgressIntervalRef = useRef(null);

    // --- Utility Functions ---
    const showToastMessage = useCallback((msg) => {
        setGameState(prevState => ({ ...prevState, toastMessage: msg, showToast: true }));
        setTimeout(() => setGameState(prevState => ({ ...prevState, showToast: false })), 3000);
    }, []);

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    };

    // --- Save Game ---
    useEffect(() => {
        localStorage.setItem('marketTycoonSave_v1', JSON.stringify(gameState));
    }, [gameState]);

    // --- Leveling Logic (Adapted from MarketGame) ---
    const addXp = useCallback((amount) => {
        setGameState(prevState => {
            let newXp = prevState.xp + amount;
            const xpPerRank = 1000;
            let newTotalRanks = Math.floor(newXp / xpPerRank); // Total ranks gained across all tiers

            let newTierIndex = Math.min(TIERS.length - 1, Math.floor(newTotalRanks / 5)); // 5 ranks per tier
            let newRank = (newTotalRanks % 5) + 1; // Rank within current tier

            // If max tier and max rank, ensure XP doesn't exceed for display
            if (newTierIndex === TIERS.length - 1 && newRank === 5) {
                newXp = (TIERS.length * 5 * xpPerRank) - 1; // Cap XP for max display
            }

            return {
                ...prevState,
                xp: newXp,
                tierIndex: newTierIndex,
                rank: newRank,
            };
        });
    }, []);

    // --- Loan Logic (Adapted from MarketGame) ---
    const toggleLoanModal = useCallback((show) => {
        setGameState(prevState => ({ ...prevState, showLoanModal: show }));
    }, []);

    const takeLoan = useCallback((amount, term) => {
        setGameState(prevState => {
            if (amount <= 0 || amount > 50000) { // Max loan limit
                showToastMessage("Invalid loan amount. Max $50,000.");
                return prevState;
            }

            // Base 5% + 1% premium every 5 days (turns)
            const premium = Math.floor(term / 5) * 0.01;
            const rate = 0.05 + premium;
            const totalDue = Math.round(amount * (1 + rate)); // Round to nearest dollar

            showToastMessage(`Loan approved! Received ${formatMoney(amount)}. Total repayment: ${formatMoney(totalDue)}.`);
            addXp(50); // Small XP for financial management

            return {
                ...prevState,
                money: prevState.money + amount,
                loan: { active: true, amount: totalDue, dueDay: prevState.day + term, interestRate: rate },
                showLoanModal: false,
            };
        });
    }, [addXp, showToastMessage]);

    const payLoan = useCallback(() => {
        setGameState(prevState => {
            if (!prevState.loan.active) return prevState;

            if (prevState.money >= prevState.loan.amount) {
                showToastMessage(`Loan of ${formatMoney(prevState.loan.amount)} repaid.`);
                addXp(100); // XP for clearing debt
                return {
                    ...prevState,
                    money: prevState.money - prevState.loan.amount,
                    loan: { active: false, amount: 0, dueDay: 0, interestRate: 0.05 },
                };
            } else {
                showToastMessage("Insufficient Funds to repay loan.");
                return prevState;
            }
        });
    }, [addXp, showToastMessage]);

    const checkLoanStatus = useCallback(() => {
        setGameState(prevState => {
            if (!prevState.loan.active) return prevState;

            // Check if overdue
            if (prevState.day > prevState.loan.dueDay) {
                const overdueDays = prevState.day - prevState.loan.dueDay;

                // Default Condition: 10 days late
                if (overdueDays >= 10) {
                    showToastMessage("LOAN DEFAULT: Assets Seized. The bank has liquidated your capital to cover the debt.");
                    return {
                        ...prevState,
                        money: prevState.money - prevState.loan.amount, // Deducting entire amount (can go negative)
                        loan: { active: false, amount: 0, dueDay: 0, interestRate: 0.05 },
                    };
                } else if (overdueDays > 0 && overdueDays % 1 === 0) { // Apply penalty daily (simplified from original "10% once")
                    const penalty = Math.round(prevState.loan.amount * 0.01); // 1% penalty per day overdue
                    showToastMessage(`Loan overdue! ${formatMoney(penalty)} penalty applied.`);
                    return {
                        ...prevState,
                        loan: { ...prevState.loan, amount: prevState.loan.amount + penalty },
                    };
                }
            }
            return prevState;
        });
    }, [showToastMessage]);

    // --- Simulation Controls ---
    const toggleSimPaused = useCallback(() => {
        setGameState(prevState => ({ ...prevState, simPaused: !prevState.simPaused }));
    }, []);

    const setSimSpeed = useCallback((speed) => {
        setGameState(prevState => ({ ...prevState, simSpeed: speed }));
    }, []);

    // --- Prospect Generation (Adapted) ---
    const generateDailyProspects = useCallback(() => {
        setGameState(prevState => {
            const newProspects = [];
            const count = Math.floor(Math.random() * 3) + 3; // 3-5 leads

            for (let i = 0; i < count; i++) {
                const arch = getRandom(ARCHETYPES);
                newProspects.push({
                    id: Date.now() + i,
                    name: arch.type + " #" + Math.floor(Math.random() * 999),
                    arch: arch,
                    taste: arch.taste,
                    contractDays: Math.floor(Math.random() * 3) + 3 // 3-5 days contract
                });
            }
            // "Market Reroll" concept can be implemented here by clearing previous prospects
            // For now, it just adds new ones.
            return { ...prevState, prospects: newProspects };
        });
    }, []);

    const createPost = useCallback((client) => {
        setGameState(prevState => {
            const template = getRandom(client.arch.postTemplates);
            const post = {
                id: Date.now() + Math.random(),
                author: client.name,
                content: template,
                views: 0,
                velocity: Math.random() * 4 + 1, // Faster views
                capped: false
            };

            const updatedPosts = [post, ...prevState.posts];
            if (updatedPosts.length > 30) updatedPosts.pop(); // Keep feed clean

            return { ...prevState, posts: updatedPosts };
        });
    }, []);

    // --- Day Simulation Logic ---
    const runDaySimulation = useCallback(() => {
        setGameState(prevState => {
            if (prevState.isDayActive) return prevState;
            showToastMessage("Day started!");
            return { ...prevState, isDayActive: true, dayProgress: 0 };
        });
    }, [showToastMessage]);

    const endDay = useCallback(() => {
        setGameState(prevState => {
            // 1. Process Contracts
            let expiredCount = 0;
            const updatedClients = prevState.clients.map(c => ({ ...c, daysRemaining: c.daysRemaining - 1 }));
            const activeBefore = prevState.clients.length;
            const filteredClients = updatedClients.filter(c => c.daysRemaining > 0);
            expiredCount = activeBefore - filteredClients.length;

            // 2. Clear old posts (optional, but keeps feed cleaner) - handled in createPost now

            // 3. New Prospects (now can be influenced by "market climate")
            // For simplicity, just regenerate. Climate influence can be added to generateDailyProspects
            // generateDailyProspects(); // This is a state setter, better to call outside or pass directly

            let msg = `Day Ended. `;
            if (expiredCount > 0) msg += `${expiredCount} contracts expired. `;
            msg += `New prospects available.`;
            showToastMessage(msg);

            // Apply loan status check before incrementing day
            const stateAfterLoanCheck = (() => {
                let tempState = { ...prevState };
                if (tempState.loan.active && tempState.day > tempState.loan.dueDay) {
                    const overdueDays = tempState.day - tempState.loan.dueDay;
                    if (overdueDays >= 10) {
                        showToastMessage("LOAN DEFAULT: Assets Seized. The bank has liquidated your capital to cover the debt.");
                        tempState.money -= tempState.loan.amount;
                        tempState.loan = { active: false, amount: 0, dueDay: 0, interestRate: 0.05 };
                    } else if (overdueDays > 0 && overdueDays % 1 === 0) {
                        const penalty = Math.round(tempState.loan.amount * 0.01);
                        showToastMessage(`Loan overdue! ${formatMoney(penalty)} penalty applied.`);
                        tempState.loan = { ...tempState.loan, amount: tempState.loan.amount + penalty };
                    }
                }
                return tempState;
            })();

            return {
                ...stateAfterLoanCheck,
                isDayActive: false,
                day: prevState.day + 1,
                dayProgress: 0,
                clients: filteredClients,
                // prospects will be regenerated after state update
            };
        });
        // Regenerate prospects after the state update to ensure latest day is used.
        // This is a bit tricky with state setters, might need an effect for side-effects
        // For now, generateDailyProspects will be called in a useEffect after day changes.
    }, [showToastMessage]);

    // --- Pitch Logic ---
    const startPitch = useCallback((index) => {
        if (gameState.isDayActive) {
            showToastMessage("Cannot pitch during work hours!");
            return;
        }
        setGameState(prevState => {
            const p = prevState.prospects[index];
            if (!p) return prevState;

            const arch = p.arch;
            let options = [];
            options.push({ text: getRandom(arch.wins), valid: true });

            let failsCopy = [...arch.fails];
            for (let i = 0; i < 3; i++) {
                if (failsCopy.length > 0) {
                    const randomIndex = Math.floor(Math.random() * failsCopy.length);
                    options.push({ text: failsCopy[randomIndex], valid: false });
                    failsCopy.splice(randomIndex, 1);
                } else {
                    options.push({ text: "Generic Fail", valid: false });
                }
            }
            options.sort(() => Math.random() - 0.5);

            return { ...prevState, activePitchIndex: index, currentPitchOptions: options };
        });
    }, [gameState.isDayActive, showToastMessage]);

    const resolvePitch = useCallback((isSuccess) => {
        setGameState(prevState => {
            const pitchedProspect = prevState.prospects[prevState.activePitchIndex];
            if (!pitchedProspect) return prevState;

            if (isSuccess) {
                const newClient = {
                    ...pitchedProspect,
                    daysRemaining: pitchedProspect.contractDays,
                    postSpeed: Math.random() * 20 + 10
                };
                showToastMessage(`✅ Signed ${pitchedProspect.name} for ${pitchedProspect.contractDays} days!`);
                addXp(200); // XP for signing a client

                // Assuming a fixed earning for now per contract
                const contractEarnings = pitchedProspect.contractDays * VIEW_PAYOUT_AMOUNT * 50; // Example calculation
                return {
                    ...prevState,
                    money: prevState.money + contractEarnings, // Add contract earnings to money
                    clients: [...prevState.clients, newClient],
                    prospects: prevState.prospects.filter((_, idx) => idx !== prevState.activePitchIndex),
                    activePitchIndex: null,
                    currentPitchOptions: [],
                    history: [...prevState.history, {
                        day: prevState.day,
                        clientName: pitchedProspect.name,
                        taste: pitchedProspect.taste,
                        contractDays: pitchedProspect.contractDays,
                        isSuccess: true,
                        earnings: contractEarnings
                    }]
                };
            } else {
                showToastMessage(`❌ Pitch Failed.`);
                return {
                    ...prevState,
                    prospects: prevState.prospects.filter((_, idx) => idx !== prevState.activePitchIndex),
                    activePitchIndex: null,
                    currentPitchOptions: [],
                    history: [...prevState.history, {
                        day: prevState.day,
                        clientName: pitchedProspect.name,
                        taste: pitchedProspect.taste,
                        contractDays: pitchedProspect.contractDays,
                        isSuccess: false,
                        earnings: 0 // No earnings for failed pitch
                    }]
                };
            }
        });
    }, [addXp, showToastMessage]);

    const setActivePitchIndex = useCallback((index) => {
        setGameState(prevState => ({ ...prevState, activePitchIndex: index }));
    }, []);


    // --- EFFECTS ---
    // Init Game / Regenerate Prospects on Day Change
    useEffect(() => {
        if (gameState.day === 1 && gameState.prospects.length === 0) {
            generateDailyProspects();
        } else if (gameState.day > 1 && !gameState.isDayActive) {
            // Only regenerate after a day has ended, and if not active
            generateDailyProspects();
        }
    }, [gameState.day, gameState.isDayActive, gameState.prospects.length, generateDailyProspects]);


    // Day Progress Simulation
    useEffect(() => {
        if (gameState.isDayActive && !gameState.simPaused) {
            dayProgressIntervalRef.current = setInterval(() => {
                setGameState(prevState => {
                    const newProgress = prevState.dayProgress + (100 / (DAY_DURATION_MS / 100));
                    if (newProgress >= 100) {
                        clearInterval(dayProgressIntervalRef.current);
                        endDay(); // End the day when progress reaches 100%
                        return { ...prevState, dayProgress: 100 };
                    }
                    return { ...prevState, dayProgress: newProgress };
                });
            }, 100 / gameState.simSpeed); // Adjust interval based on simSpeed

            return () => clearInterval(dayProgressIntervalRef.current);
        } else {
            clearInterval(dayProgressIntervalRef.current);
        }
    }, [gameState.isDayActive, gameState.simPaused, gameState.simSpeed, endDay]);


    // Simulation Loop for Posts and Views
    useEffect(() => {
        if (gameState.isDayActive && !gameState.simPaused) {
            simulationIntervalRef.current = setInterval(() => {
                setGameState(prevState => {
                    let newTotalViews = prevState.totalViews;
                    let newUnclaimedViews = prevState.unclaimedViews;
                    let currentMoney = prevState.money;
                    let currentPosts = [...prevState.posts]; // Make a mutable copy

                    // 1. Clients generate posts
                    prevState.clients.forEach(c => {
                        if (Math.random() * 100 < 5) { // Higher chance since days are short
                            const template = getRandom(c.arch.postTemplates);
                            const post = {
                                id: Date.now() + Math.random(),
                                author: c.name,
                                content: template,
                                views: 0,
                                velocity: Math.random() * 4 + 1,
                                capped: false
                            };
                            currentPosts.unshift(post);
                            if (currentPosts.length > 30) currentPosts.pop();
                        }
                    });

                    // 2. Posts generate views & monetization
                    const updatedPosts = currentPosts.map(post => {
                        if (!post.capped) {
                            post.views += post.velocity * prevState.simSpeed; // Views scale with speed
                            newTotalViews += post.velocity * prevState.simSpeed;
                            newUnclaimedViews += post.velocity * prevState.simSpeed;

                            // Cap Logic
                            if (post.views >= MAX_VIEWS_PER_POST) {
                                post.views = MAX_VIEWS_PER_POST;
                                post.capped = true;
                                addXp(10); // Small XP for capping a post
                            }
                        }
                        return post;
                    });

                    // Monetization
                    while (newUnclaimedViews >= VIEW_PAYOUT_THRESHOLD) {
                        currentMoney += VIEW_PAYOUT_AMOUNT;
                        newUnclaimedViews -= VIEW_PAYOUT_THRESHOLD;
                        addXp(1); // Tiny XP for earning money
                    }

                    return {
                        ...prevState,
                        posts: updatedPosts,
                        totalViews: newTotalViews,
                        unclaimedViews: newUnclaimedViews,
                        money: currentMoney,
                    };
                });
            }, 100 / gameState.simSpeed);

            return () => clearInterval(simulationIntervalRef.current);
        } else {
            clearInterval(simulationIntervalRef.current);
        }
    }, [gameState.isDayActive, gameState.simPaused, gameState.simSpeed, createPost, addXp]);


    // Hide header and footer in specific game views (e.g., simulation full screen)
    const showHeaderFooter = !['/game/simulation'].includes(location.pathname); // Placeholder path

    const gameContextValue = {
        ...gameState,
        showToastMessage,
        formatMoney,
        // Game Actions
        runDaySimulation,
        startPitch,
        resolvePitch,
        setActivePitchIndex,
        generateDailyProspects,
        // Leveling
        addXp,
        TIERS,
        // Loan System
        toggleLoanModal,
        takeLoan,
        payLoan,
        // Simulation Controls
        toggleSimPaused,
        setSimSpeed,
        // UI Helpers
        showHeaderFooter,
        CLIMATES // Expose CLIMATES for Header
    };
    console.log("GameContext Provided Value:", gameContextValue); // Add this line for debugging

    return (
        <GameContext.Provider value={gameContextValue}>
            {children}
        </GameContext.Provider>
    );
};
