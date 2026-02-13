export const getColorForUser = (userId: string | number | null) => {
    if (!userId) return 'transparent';
    const colors = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
        '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ];
    const hash = String(userId).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
};
