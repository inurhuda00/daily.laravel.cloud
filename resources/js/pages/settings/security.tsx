import { Head } from '@inertiajs/react';

import type { BreadcrumbItem, SessionInfo } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

import BrowserSessions from '@/components/browser-sessions';
import TwoFactorAuthentication from '@/components/two-factor-auth';
import { Fragment } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Security',
        href: '/settings/security',
    },
];

const Security = ({ sessions }: { sessions: Array<SessionInfo>; requiresConfirmation: boolean }) => {
    return (
        <Fragment>
            <Head title="Security" />

            <SettingsLayout>
                <TwoFactorAuthentication />
                <BrowserSessions sessions={sessions} />
            </SettingsLayout>
        </Fragment>
    );
};

Security.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default Security;
