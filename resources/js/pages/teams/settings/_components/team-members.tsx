import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { copyToClipboard } from '@/lib/copy-to-clipboard';
import type { TeamInvitations, User } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { Avatar } from '@radix-ui/react-avatar';
import axios from 'axios';
import { CheckCircle2, Copy, MoreHorizontal, RefreshCwIcon, Send, Trash2, User2 } from 'lucide-react';
import { toast } from 'sonner';

const TeamMembers = ({
    members,
    invitations,
    roles,
}: {
    members: Array<User>;
    invitations: Array<TeamInvitations>;
    roles: Record<string, string>;
}) => {
    const updateRoleForm = useForm({
        role: null,
    });

    const leaveTeamForm = useForm({});
    const removeTeamMemberForm = useForm({});

    const handleUpdateRole = (slug: string, id: string) => {
        updateRoleForm.put(route('team-members.update', [slug, id]), {
            preserveScroll: true,
        });
    };

    const handleCancelTeamInvitation = (invitation: string) => {
        router.delete(route('team-invitations.destroy', invitation), {
            preserveScroll: true,
        });
    };

    const handleRemoveTeamMember = () => {
        removeTeamMemberForm.delete(route('team-members.destroy'), {
            errorBag: 'removeTeamMember',
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleCopyInviteLink = async (value: string) => {
        try {
            await copyToClipboard(value);
            toast.success('Invite link copied!', {
                description: 'Your Invite link have been copied to clipboard.',
                icon: <CheckCircle2 className="h-4 w-4" />,
            });
        } catch (error) {
            toast.error('Failed to copy Invite link, please try again', {
                description: 'An error occurred while copying your Invite link.',
                icon: <RefreshCwIcon className="h-4 w-4" />,
            });
        }
    };

    const handleResend = (id: string) => {
        try {
            axios.post(route('team-members.resend', id));
        } catch (error) {}
    };

    return (
        <form className="grid gap-2">
            <Label className="mb-3">Members</Label>
            {members.entries() &&
                members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between rounded-md border p-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {member.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{member.name}</span>
                                <span className="text-muted-foreground truncate text-xs">{member.email}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value="admin" onValueChange={(value) => handleUpdateRole(value, String(member.id))}>
                                <SelectTrigger className="w-[6rem] text-sm">
                                    <SelectValue placeholder="Theme" />
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
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                                    >
                                        <Icon iconNode={MoreHorizontal} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-40 rounded-lg" side="bottom">
                                    <DropdownMenuItem>
                                        <Icon iconNode={User2} className="mr-2" />
                                        <span className="text-sm">View profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleRemoveTeamMember}>
                                        <Icon iconNode={Trash2} className="mr-2" />
                                        <span className="text-sm">Remove member</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            {invitations.entries() &&
                invitations.map((member) => (
                    <div key={member.id} className="flex items-center justify-between rounded-md border p-4">
                        <div className="flex items-center gap-3">
                            <span className="inline-block size-8 overflow-hidden rounded-full bg-gray-100">
                                <svg role="graphics-symbol" fill="currentColor" viewBox="0 0 24 24" className="size-full text-gray-300">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </span>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="text-muted-foreground truncate text-xs">{member.email}</span>
                            </div>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                        <div className="flex items-center gap-2">
                            <Select value="admin" onValueChange={(value) => handleUpdateRole(value, String(member.id))}>
                                <SelectTrigger className="w-[6rem] text-sm">
                                    <SelectValue placeholder="Theme" />
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
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                                    >
                                        <Icon iconNode={MoreHorizontal} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-40 rounded-lg" side="bottom">
                                    <DropdownMenuItem onClick={() => handleResend(String(member.id))}>
                                        <Icon iconNode={Send} className="mr-2" />
                                        <span className="text-sm">Resend invite</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCopyInviteLink(member.invitation_link)}>
                                        <Icon iconNode={Copy} className="mr-2" />
                                        <span className="text-sm">Copy invite link</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCancelTeamInvitation(String(member.id))}>
                                        <Icon iconNode={Trash2} className="mr-2" />
                                        <span className="text-sm">Revoke invite</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
        </form>
    );
};

export default TeamMembers;
