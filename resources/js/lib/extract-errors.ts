export const extractFirstError = (obj: Record<string, any>, exceptKeys: string[] = []): string | undefined => {
    for (const [key, value] of Object.entries(obj)) {
        // Lewati key yang ada dalam daftar pengecualian
        if (exceptKeys.includes(key)) continue;

        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value !== null) {
            const nestedError = extractFirstError(value, exceptKeys);
            if (nestedError) return nestedError;
        }
    }
};
