import React from 'react';
import { useGame } from '../context/GameContext';

const Toast = () => {
    const { showToast, toastMessage } = useGame();

    return (
        <div className={`fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl transition-all duration-300 z-50 ${
            showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
            {toastMessage}
        </div>
    );
};

export default Toast;
