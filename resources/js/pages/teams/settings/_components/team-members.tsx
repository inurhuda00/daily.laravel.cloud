import InputError from '@/components/input-error';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { copyToClipboard } from '@/lib/copy-to-clipboard';
import { extractFirstError } from '@/lib/extract-errors';
import type { SharedData, Team, TeamInvitations, User } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { Avatar } from '@radix-ui/react-avatar';
import axios from 'axios';
import { CheckCircle2, Copy, MoreHorizontal, RefreshCwIcon, Send, Trash2, User2 } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMembersProps {
    currentTeam: Team;
    members: User[];
    invitations: TeamInvitations[];
    roles: Record<string, string>;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ currentTeam, members, invitations, roles }) => {
    const { errors } = usePage<SharedData>().props;
    const updateRoleForm = useForm({ role: null });
    const removeTeamMemberForm = useForm({});

    const handleUpdateRole = (slug: string, id: string, role: string) => {
        updateRoleForm.transform((data) => ({
            ...data,
            role,
        }));

        updateRoleForm.put(route('team-members.update', [slug, id]), { preserveScroll: true });
    };

    const handleRemoveTeamMember = (slug: string, id: string) => {
        removeTeamMemberForm.delete(route('team-members.destroy', [slug, id]), {
            errorBag: 'removeTeamMember',
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleCopyInviteLink = async (value: string) => {
        try {
            await copyToClipboard(value);
            toast.success('Invite link copied!', { description: 'Your invite link has been copied.', icon: <CheckCircle2 className="h-4 w-4" /> });
        } catch {
            toast.error('Failed to copy invite link', {
                description: 'An error occurred while copying.',
                icon: <RefreshCwIcon className="h-4 w-4" />,
            });
        }
    };

    const handleResend = async (id: number) => {
        try {
            await axios.post(route('team-members.resend', id));
            toast.success('Invite resent!', { icon: <CheckCircle2 className="h-4 w-4" /> });
        } catch {
            toast.error('Failed to resend invite', { icon: <RefreshCwIcon className="h-4 w-4" /> });
        }
    };

    const errorMessage = extractFirstError({ ...errors }, ['addTeamMember']);

    return (
        <form className="grid gap-2">
            <Label className="mb-3">Members</Label>
            <InputError message={errorMessage} />
            {[...members, ...invitations].map((person) => (
                <div key={person.id} className="flex items-center justify-between gap-4 rounded-md border p-4">
                    {'avatar' in person ? (
                        <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                            <AvatarImage src={person.avatar} alt={person.name} />
                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                {person.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <span className="inline-block size-8 overflow-hidden rounded-full bg-gray-100">
                            <svg role="graphics-symbol" fill="currentColor" viewBox="0 0 24 24" className="size-full text-gray-300">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </span>
                    )}
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        {'name' in person ? (
                            <>
                                <span className="truncate font-medium">{person.name}</span>
                                <span className="text-muted-foreground truncate text-xs">{person.email}</span>
                            </>
                        ) : (
                            <span className="text-muted-foreground truncate text-xs">{person.email}</span>
                        )}
                    </div>

                    {'invitation_link' in person && <Badge variant="outline">Pending</Badge>}

                    <Select value={person.role ?? 'admin'} onValueChange={(value) => handleUpdateRole(currentTeam.slug, String(person.id), value)}>
                        <SelectTrigger className="w-[6rem] text-sm">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                            {Object.entries(roles).map(([value, label]) => (
                                <SelectItem value={value} key={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                                <Icon iconNode={MoreHorizontal} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-40 rounded-lg" side="bottom">
                            {'avatar' in person ? (
                                <>
                                    <DropdownMenuItem>
                                        <Icon iconNode={User2} className="mr-2" />
                                        <span className="text-sm">View profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRemoveTeamMember(currentTeam.slug, String(person.id))}>
                                        <Icon iconNode={Trash2} className="mr-2" />
                                        <span className="text-sm">Remove member</span>
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem onClick={() => handleResend(person.id)}>
                                        <Icon iconNode={Send} className="mr-2" />
                                        <span className="text-sm">Resend invite</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCopyInviteLink(person.invitation_link)}>
                                        <Icon iconNode={Copy} className="mr-2" />
                                        <span className="text-sm">Copy invite link</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => router.delete(route('team-invitations.destroy', person.id), { preserveScroll: true })}
                                    >
                                        <Icon iconNode={Trash2} className="mr-2" />
                                        <span className="text-sm">Revoke invite</span>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}
        </form>
    );
};

export default TeamMembers;
