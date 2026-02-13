import React from 'react';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="py-4 px-6 md:py-6 text-center border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between md:justify-center">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                aria-label="Open menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
            </button>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                InboxKit Assignment
            </h1>

            {/* Spacer for mobile to center h1 if button exists */}
            <div className="w-10 md:hidden" />
        </header>
    );
};

export default Header;
