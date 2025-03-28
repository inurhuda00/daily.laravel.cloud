import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { NavItem, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Fragment } from 'react/jsx-runtime';

const sidebarNavItems: NavItem[] = [
    {
        title: 'General',
        url: '/settings/profile',
        icon: null,
    },
    {
        title: 'Password',
        url: '/settings/password',
        icon: null,
    },
    {
        title: 'Appearance',
        url: '/settings/appearance',
        icon: null,
    },
    {
        title: 'Security',
        url: '/settings/security',
        icon: null,
    },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile();
    const page = usePage<SharedData>();

    const handleChangeSidebar = (value: string) => {
        router.visit(value);
    };

    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                {isMobile && (
                    <Select onValueChange={handleChangeSidebar} value={sidebarNavItems.find((nav) => nav.url === page.url)?.url}>
                        <SelectTrigger className="md:hidden">
                            <SelectValue placeholder="Navigations" />
                        </SelectTrigger>
                        <SelectContent>
                            {sidebarNavItems.map((item) => (
                                <SelectItem value={item.url} key={item.url}>
                                    {item.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {!isMobile && (
                    <Fragment>
                        <aside className="w-full max-w-xl lg:w-48">
                            <nav className="flex flex-col space-y-1 space-x-0">
                                {sidebarNavItems.map((item) => (
                                    <Button
                                        key={item.url}
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn('w-full justify-start', {
                                            'bg-muted': page.url === item.url,
                                        })}
                                    >
                                        <Link href={item.url} prefetch>
                                            {item.title}
                                        </Link>
                                    </Button>
                                ))}
                            </nav>
                        </aside>
                        <Separator className="my-6 md:hidden" />
                    </Fragment>
                )}

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
