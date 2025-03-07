import { Head, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import type { BreadcrumbItem, SharedData, TeamInvitations, User } from '@/types';

import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import TeamSettingsLayout from '@/layouts/settings/team-layout';
import { Fragment } from 'react';
import AddTeamMemberForm from './_components/add-team-member-form';
import TeamMembers from './_components/team-members';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Members settings',
        href: '/settings/appearance',
    },
];

const Members = ({
    members,
    membersInvitations,
    roles,
}: {
    members: Array<User>;
    membersInvitations: Array<TeamInvitations>;
    roles: Record<string, string>;
}) => {
    const { auth } = usePage<SharedData>().props;

    return (
        <Fragment>
            <Head title="Members settings" />

            <TeamSettingsLayout team={auth.selectors.current_team}>
                <div className="space-y-6">
                    <HeadingSmall title="Members settings" description="Manage members of your organization, set roles, and invite new users." />
                    <Separator />

                    <AddTeamMemberForm roles={roles} team={auth.selectors.current_team} />

                    <TeamMembers roles={roles} members={members} invitations={membersInvitations} />
                </div>
            </TeamSettingsLayout>
        </Fragment>
    );
};

Members.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default Members;
