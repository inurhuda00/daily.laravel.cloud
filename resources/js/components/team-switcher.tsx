import { ChevronsUpDown, Plus } from 'lucide-react';
import * as React from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';

export function TeamSwitcher({
    teams,
}: {
    teams: {
        name: string;
        logo: React.ElementType;
        plan: string;
    }[];
}) {
    const [activeTeam, setActiveTeam] = React.useState(teams[0]);

    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
                <a href={activeTeam.name} className="flex items-center gap-2">
                    <activeTeam.logo className="size-6" />
                    <div className="text-left text-sm leading-tight">
                        <span className="truncate">{activeTeam.name}</span>
                    </div>
                </a>
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
                        <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)} className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-sm border">
                                <team.logo className="size-4 shrink-0" />
                            </div>
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
                        <div className="text-muted-foreground font-medium">Add team</div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
