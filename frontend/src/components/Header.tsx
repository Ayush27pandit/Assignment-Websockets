import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="py-6 text-center border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-20">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                InboxKit Assignment
            </h1>
        </header>
    );
};

export default Header;
