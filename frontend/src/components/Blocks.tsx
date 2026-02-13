import { useMemo, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface BlocksProps {
    socket: Socket;
}

const Blocks = ({ socket }: BlocksProps) => {
    const [gridState, setGridState] = useState<{ [key: number]: string | null }>({});
    const blocksArray = useMemo(() => Array.from({ length: 300 }), []);

    useEffect(() => {
        // Load initial state
        socket.on('initial-state', (state) => {
            setGridState(state);
        });

        // Listen for cell updates
        socket.on('cell-updated', ({ index, owner }) => {
            setGridState(prev => ({
                ...prev,
                [index]: owner
            }));
        });

        return () => {
            socket.off('initial-state');
            socket.off('cell-updated');
        };
    }, [socket]);

    const handleCellClick = (index: number) => {
        socket.emit('cell-clicked', { index });
    };

    // Simple helper to generate a color from a user ID string
    const getColorForUser = (userId: string | number | null) => {
        if (!userId) return 'transparent';
        const colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
            '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
        ];
        const hash = String(userId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    return (
        <div className="w-full max-w-7xl px-4 py-10 mx-auto">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-3 sm:gap-4 justify-items-center">
                {blocksArray.map((_, index) => {
                    const owner = gridState[index];
                    const isSelected = !!owner;
                    const selectionColor = getColorForUser(owner);

                    return (
                        <div
                            key={index}
                            onClick={() => handleCellClick(index)}
                            style={{
                                backgroundColor: isSelected ? `${selectionColor}20` : undefined,
                                borderColor: isSelected ? selectionColor : undefined
                            }}
                            className={`group relative aspect-square w-full rounded-xl bg-card border border-border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer flex items-center justify-center overflow-hidden`}
                        >
                            <span
                                className={`text-xs font-mono transition-colors ${isSelected ? 'font-bold' : 'text-muted-foreground'}`}
                                style={{ color: isSelected ? selectionColor : undefined }}
                            >
                                {index + 1}
                            </span>

                            {isSelected && (
                                <div
                                    className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
                                    style={{ backgroundColor: selectionColor }}
                                />
                            )}

                            {/* Shimmer effect on hover */}
                            <div className="absolute inset-x-0 inset-y-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Blocks;
