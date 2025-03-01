import { Check, ChevronsUpDown, Plus } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Team } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { useCreateTeamModal } from './create-team-modal';
import { Icon } from './icon';
import { Button } from './ui/button';

export function TeamSwitcher({ currentTeam, teams }: { currentTeam: Team; teams: Team[] }) {
    const { put, transform } = useForm({ team_id: '' });
    const { setModal, CreateTeamModal } = useCreateTeamModal();

    const switchToTeam = (teamId: string) => {
        transform((data) => ({
            ...data,
            team_id: teamId,
        }));

        put(route('current-team.update'), {
            preserveState: false,
        });
    };

    const handleCreateTeam = (e: Event) => {
        e.preventDefault();
        setModal(true);
    };

    return (
        <>
            <CreateTeamModal />
            <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                    <Link href={route('team.dashboard', currentTeam.slug)} className="flex items-center gap-2">
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
                        <DropdownMenuRadioGroup value={currentTeam.slug} onValueChange={switchToTeam}>
                            {teams.map((team) => (
                                <DropdownMenuRadioItem key={team.slug} value={String(team.id)} className="gap-2 p-2">
                                    <div className="text-left text-sm leading-tight">
                                        <span className="truncate">{team.name}</span>
                                    </div>
                                    {team.slug === currentTeam.slug && (
                                        <DropdownMenuShortcut>
                                            <Icon iconNode={Check} />
                                        </DropdownMenuShortcut>
                                    )}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2" onSelect={(e) => handleCreateTeam(e)}>
                            <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                                <Plus className="size-4" />
                            </div>
                            <div className="text-muted-foreground text-xs font-medium">Add team</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
