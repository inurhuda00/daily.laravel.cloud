import { ChevronsUpDown, Plus } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Team } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Button } from './ui/button';

export function TeamSwitcher({ currentTeam, teams }: { currentTeam: Team; teams: Team[] }) {
    const { put } = useForm({ team_id: currentTeam.id });

    const switchToTeam = (e: React.MouseEvent<HTMLDivElement>, team: Team) => {
        e.preventDefault();
        put(route('current-team.update', { id: team.id }), { preserveState: false });
    };

    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
                <Link href={route('dashboard', currentTeam.slug)} className="flex items-center gap-2">
                    <div className="text-left text-sm leading-tight">
                        <span className="truncate">{currentTeam.name}</span>
                    </div>
                </Link>
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground px-0">
                        <ChevronsUpDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-40 rounded-lg"
                    align="start"
                    side="bottom"
                    sideOffset={4}
                >
                    {teams.map((team) => (
                        <DropdownMenuItem key={team.slug} onClick={(e) => switchToTeam(e, team)} className="gap-2 p-2">
                            <div className="text-left text-sm leading-tight">
                                <span className="truncate">{team.name}</span>
                            </div>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 p-2">
                        <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                            <Plus className="size-4" />
                        </div>
                        <div className="text-muted-foreground text-xs font-medium">Add team</div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
