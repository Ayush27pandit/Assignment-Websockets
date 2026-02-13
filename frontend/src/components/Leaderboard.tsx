import React from 'react';
import { getColorForUser } from '../utils/colors';

interface LeaderboardEntry {
    userId: string;
    count: number;
}

interface LeaderboardProps {
    leaderboard: LeaderboardEntry[];
    myId: string | null;
}

const MEDAL_ICONS = ['🥇', '🥈', '🥉'];

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard, myId }) => {
    return (
        <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                🏆 Leaderboard
            </h2>
            {leaderboard.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No cells claimed yet</p>
            ) : (
                <div className="space-y-2">
                    {leaderboard.map((entry, rank) => {
                        const isMe = entry.userId === myId;
                        const color = getColorForUser(entry.userId);
                        const maxCount = leaderboard[0]?.count || 1;
                        const barWidth = Math.max(10, (entry.count / maxCount) * 100);

                        return (
                            <div
                                key={entry.userId}
                                className="leaderboard-entry"
                                style={{
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                <div
                                    className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all duration-300 ${isMe
                                        ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20 shadow-md'
                                        : 'bg-background/50 border-border'
                                        }`}
                                >
                                    {/* Rank */}
                                    <span className="w-6 text-center text-sm font-bold shrink-0">
                                        {rank < 3 ? MEDAL_ICONS[rank] : `#${rank + 1}`}
                                    </span>

                                    {/* Avatar */}
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 transition-all duration-300"
                                        style={{ backgroundColor: color }}
                                    >
                                        {isMe ? 'ME' : String(entry.userId).slice(-2).toUpperCase()}
                                    </div>

                                    {/* Name + bar */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium truncate">
                                                {isMe ? 'You' : `User #${entry.userId}`}
                                            </span>
                                            <span
                                                className="text-xs font-bold tabular-nums ml-2 transition-all duration-300"
                                                style={{ color }}
                                            >
                                                {entry.count}
                                            </span>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="w-full h-1.5 bg-border/50 rounded-full mt-1 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500 ease-out"
                                                style={{
                                                    width: `${barWidth}%`,
                                                    backgroundColor: color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
