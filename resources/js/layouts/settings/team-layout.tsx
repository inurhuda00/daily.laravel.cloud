import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { NavItem, SharedData, Team } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Fragment } from 'react/jsx-runtime';

const sidebarNavItems: (team: Team) => NavItem[] = (team) => [
    {
        title: 'General',
        url: `/${team.slug}/settings`,
        icon: null,
    },
    {
        title: 'Members',
        url: `/${team.slug}/members`,
        icon: null,
    },
];

export default function TeamSettingsLayout({ children, team }: { children: React.ReactNode; team: Team }) {
    const isMobile = useIsMobile();
    const page = usePage<SharedData>();

    const handleChangeSidebar = (value: string) => {
        router.visit(value);
    };

    return (
        <div className="px-4 py-6">
            <Heading title="Team Settings" description="Manage your team settings and preferences" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                {isMobile && (
                    <Select onValueChange={handleChangeSidebar} value={sidebarNavItems(team).find((nav) => nav.url === page.url)?.url}>
                        <SelectTrigger className="md:hidden">
                            <SelectValue placeholder="Navigations" />
                        </SelectTrigger>
                        <SelectContent>
                            {sidebarNavItems(team).map((item) => (
                                <SelectItem value={item.url} key={item.url}>
                                    {item.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {!isMobile && (
                    <Fragment>
                        <aside className="hidden w-full max-w-xl md:block lg:w-48">
                            <nav className="flex flex-col space-y-1 space-x-0">
                                {sidebarNavItems(team).map((item) => (
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
