import { Head, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import type { BreadcrumbItem, SharedData, User } from '@/types';

import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import TeamSettingsLayout from '@/layouts/settings/team-layout';
import { Avatar } from '@radix-ui/react-avatar';
import { Copy, MoreHorizontal, Send, Trash2, User2 } from 'lucide-react';
import { Fragment } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Members settings',
        href: '/settings/appearance',
    },
];

const members: User[] = [
    {
        id: 1,
        name: 'Ilham Nuruddin Al Huda',
        email: 'inurhuda00@gmail.com',
        role: 'admin',
        email_verified_at: null,
        created_at: '',
        updated_at: '',
        avatar: '',
    },
];

const Members = () => {
    const { auth } = usePage<SharedData>().props;
    return (
        <Fragment>
            <Head title="Members settings" />

            <TeamSettingsLayout team={auth.selectors.current_team}>
                <div className="space-y-6">
                    <HeadingSmall title="Members settings" description="Manage members of your organization, set roles, and invite new users." />
                    <Separator />

                    <form className="grid gap-2">
                        <Label htmlFor="email">Invite by email</Label>
                        <div className="flex gap-2">
                            <Input id="email" name="email" placeholder="hannsn@example.com" className="flex-1" />
                            <Select value="admin" onValueChange={() => {}}>
                                <SelectTrigger className="w-[6rem] text-sm">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent className="text-sm">
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" size="icon">
                                <Icon iconNode={Send} />
                            </Button>
                        </div>
                    </form>

                    <form className="grid gap-2">
                        <Label className="mb-3">Members</Label>
                        {members.map((member) => (
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
                                    <Select value="admin" onValueChange={() => {}}>
                                        <SelectTrigger className="w-[6rem] text-sm">
                                            <SelectValue placeholder="Theme" />
                                        </SelectTrigger>
                                        <SelectContent className="text-sm">
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
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
                                            <DropdownMenuItem>
                                                <Icon iconNode={Send} className="mr-2" />
                                                <span className="text-sm">Resend invite</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Icon iconNode={Copy} className="mr-2" />
                                                <span className="text-sm">Copy invite link</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Icon iconNode={Trash2} className="mr-2" />
                                                <span className="text-destructive text-sm">Revoke invite</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Icon iconNode={Trash2} className="mr-2" />
                                                <span className="text-destructive text-sm">Remove member</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </form>
                </div>
            </TeamSettingsLayout>
        </Fragment>
    );
};

Members.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default Members;
