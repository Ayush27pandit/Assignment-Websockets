import React from 'react';
import Leaderboard from './Leaderboard';
import OnlineUsers from './OnlineUsers';

interface SidebarProps {
    leaderboard: any[];
    uniqueUsers: string[];
    myId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ leaderboard, uniqueUsers, myId, isOpen, onClose }) => {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar content */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-40 w-72 bg-card/95 backdrop-blur-md border-r border-border 
                    transform transition-transform duration-300 ease-in-out
                    md:relative md:translate-x-0 md:bg-card/50 md:flex md:top-0 md:z-10
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    h-full overflow-y-auto custom-scrollbar flex flex-col
                `}
            >
                {/* Mobile Close Button */}
                <div className="flex justify-end p-4 md:hidden">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg bg-background/50 text-foreground hover:bg-background transition-colors"
                        aria-label="Close menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" x2="6" y1="6" y2="18" />
                            <line x1="6" x2="18" y1="6" y2="18" />
                        </svg>
                    </button>
                </div>

                <Leaderboard leaderboard={leaderboard} myId={myId} />
                <OnlineUsers uniqueUsers={uniqueUsers} myId={myId} />
            </aside>
        </>
    );
};

export default Sidebar;
