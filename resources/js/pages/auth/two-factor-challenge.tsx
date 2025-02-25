import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';

export default function TwoFactorChallenge({ status }: { status?: string }) {
    return (
        <AuthLayout title="Two Factor Authentication" description="Complete The Step">
            <Head title="Two Factor Authentication" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
