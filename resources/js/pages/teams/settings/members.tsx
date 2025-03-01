import { Head, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import type { BreadcrumbItem, SharedData } from '@/types';

import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import TeamSettingsLayout from '@/layouts/settings/team-layout';
import { Fragment } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Members settings',
        href: '/settings/appearance',
    },
];

const Members = () => {
    const { auth } = usePage<SharedData>().props;
    return (
        <Fragment>
            <Head title="Members settings" />

            <TeamSettingsLayout team={auth.selectors.current_team}>
                <div className="space-y-6">
                    <HeadingSmall title="Members settings" description="Update your account's appearance settings" />
                    <Separator />
                </div>
            </TeamSettingsLayout>
        </Fragment>
    );
};

Members.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default Members;
