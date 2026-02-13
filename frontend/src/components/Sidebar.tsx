import React from 'react';
import Leaderboard from './Leaderboard';
import OnlineUsers from './OnlineUsers';

interface SidebarProps {
    leaderboard: any[];
    uniqueUsers: string[];
    myId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ leaderboard, uniqueUsers, myId }) => {
    return (
        <aside className="w-72 border-r border-border bg-card/50 backdrop-blur-sm hidden md:flex flex-col sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto custom-scrollbar">
            <Leaderboard leaderboard={leaderboard} myId={myId} />
            <OnlineUsers uniqueUsers={uniqueUsers} myId={myId} />
        </aside>
    );
};

export default Sidebar;
