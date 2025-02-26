export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => matchMedia('(prefers-color-scheme: dark)').matches;

export const applyTheme = (appearance: Appearance) => {
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());
    document.documentElement.classList.toggle('dark', isDark);
};

export function initializeTheme() {
    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';
    applyTheme(savedAppearance);
}

export function getAppearance(): Appearance {
    return (localStorage.getItem('appearance') as Appearance) || 'system';
}

export function setAppearance(mode: Appearance) {
    localStorage.setItem('appearance', mode);
    applyTheme(mode);
}
