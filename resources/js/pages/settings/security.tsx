import { Head } from '@inertiajs/react';

import type { BreadcrumbItem, SessionInfo } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

import BrowserSessions from '@/components/browser-sessions';
import TwoFactorAuthentication from '@/components/two-factor-auth';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Security',
        href: '/settings/security',
    },
];

export default function Security({ sessions, requiresConfirmation }: { sessions: Array<SessionInfo>; requiresConfirmation: boolean }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Security" />

            <SettingsLayout>
                <TwoFactorAuthentication requiresConfirmation={requiresConfirmation} />
                <BrowserSessions sessions={sessions} />
            </SettingsLayout>
        </AppLayout>
    );
}
