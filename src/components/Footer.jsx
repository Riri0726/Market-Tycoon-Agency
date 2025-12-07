import React from 'react';

const Footer = ({ onResetData }) => {
    return (
        <footer id="main-footer" className="bg-slate-900 border-t border-slate-800 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs font-mono">
                <p>MARKET_TYCOON_AGENCY.SYS // v0.1.1 // BUILD_DEV // AUTHORIZED_USER_ONLY</p>
                <button onClick={onResetData} className="mt-2 md:mt-0 text-red-900 hover:text-red-500 transition-colors">RESET_DATA</button>
            </div>
        </footer>
    );
};

export default Footer;
