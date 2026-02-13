import React from 'react';
import { getColorForUser } from '../utils/colors';

interface OnlineUsersProps {
    uniqueUsers: string[];
    myId: string | null;
}

const OnlineUsers: React.FC<OnlineUsersProps> = ({ uniqueUsers, myId }) => {
    return (
        <div className="p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Online
                </h2>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-mono">
                    {uniqueUsers.length}
                </span>
            </div>

            <div className="space-y-2">
                {uniqueUsers.map((userId) => {
                    const userIdStr = String(userId);
                    const isMe = userIdStr === myId;
                    const color = getColorForUser(userIdStr);
                    return (
                        <div
                            key={userIdStr}
                            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-200 ${isMe
                                ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20 shadow-sm'
                                : 'bg-background/50 border-border hover:border-primary/20'
                                }`}
                        >
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-inner"
                                style={{ backgroundColor: color }}
                            >
                                {isMe ? 'ME' : userIdStr.slice(-2).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-medium truncate">
                                    User #{userIdStr}
                                </span>
                                {isMe && <span className="text-[9px] text-primary font-bold uppercase tracking-wider">You</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OnlineUsers;
