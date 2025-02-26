import { getAppearance, setAppearance, type Appearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Label } from './ui/label';

export default function AppearanceToggleTab({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    const appearance = getAppearance(); // Get the stored theme preference

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <div className="space-y-2">
            <Label asChild>
                <p>Theme</p>
            </Label>
            <p className="text-muted-foreground block text-[0.8rem] opacity-75">Select the theme for the dashboard.</p>
            <div className={cn('inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800', className)} {...props}>
                {tabs.map(({ value, icon: Icon, label }) => (
                    <button
                        type="button"
                        key={value}
                        onClick={() => setAppearance(value)}
                        className={cn(
                            'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                            appearance === value
                                ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                        )}
                    >
                        <Icon className="-ml-1 h-4 w-4" />
                        <span className="ml-1.5 text-sm">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
