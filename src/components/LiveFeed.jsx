import React from 'react';
import { useGame } from '../context/GameContext';

const LiveFeed = () => {
    const { posts } = useGame();

    return (
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col gap-4 h-full max-h-[80vh]">
            <h2 className="text-lg font-bold text-slate-200 flex justify-between items-center border-b-2 border-slate-800 pb-4">
                <span>Live Feed</span>
                <span className="text-xs text-slate-500">Posts cap at 100 Views ($0.50)</span>
            </h2>

            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
                {posts.length === 0 ? (
                    <div className="text-center p-10 text-slate-600">
                        Feed is quiet.<br />Start the Work Day to see activity.
                    </div>
                ) : (
                    posts.map(post => (
                        <div 
                            key={post.id}
                            className={`border rounded-xl p-4 text-sm fade-in ${
                                post.capped ? 'opacity-60 bg-slate-800/30 border-slate-700' : 'bg-slate-800/50 border-slate-700'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-pink-400 text-xs">@{post.author}</span>
                                <span className={`font-bold text-xs ${
                                    post.capped ? 'text-slate-500' : 'text-indigo-400'
                                }`}>
                                    {post.capped ? 'MAX REVENUE' : `${Math.floor(post.views)} Views`}
                                </span>
                            </div>
                            <div className="text-slate-300 leading-relaxed">{post.content}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LiveFeed;
