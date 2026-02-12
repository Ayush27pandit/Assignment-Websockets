import { useMemo } from 'react';

const Blocks = () => {
    // Generate 300 blocks
    const blocksArray = useMemo(() => Array.from({ length: 300 }), []);

    return (
        <div className="w-full max-w-7xl px-4 py-10 mx-auto">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-3 sm:gap-4 justify-items-center">
                {blocksArray.map((_, index) => (
                    <div
                        key={index}
                        className="group relative aspect-square w-full rounded-xl bg-card border border-border shadow-sm transition-all duration-300 hover:scale-105 hover:bg-primary/10 hover:border-primary/50 hover:shadow-md cursor-pointer flex items-center justify-center overflow-hidden"
                    >
                        <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
                            {index + 1}
                        </span>

                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-x-0 inset-y-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blocks;
