import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { type FormEventHandler, useRef, useState } from 'react';

export default function TwoFactorChallenge({ status }: { status?: string }) {
    const [recovery, setRecovery] = useState(false);
    const recoveryCodeInput = useRef<HTMLInputElement>(null);
    const codeInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
        recovery_code: '',
    });

    const toggleRecovery = async () => {
        setRecovery((prev) => !prev);
        await new Promise((resolve) => setTimeout(resolve, 0));

        if (recovery) {
            codeInput.current?.focus();
            setData('recovery_code', '');
        } else {
            recoveryCodeInput.current?.focus();
            setData('code', '');
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.login'));
    };
    return (
        <AuthLayout title="Two Factor Authentication" description="Complete The Step">
            <Head title="Two Factor Authentication" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {recovery
                    ? 'Please confirm access to your account by entering one of your emergency recovery codes.'
                    : 'Please confirm access by entering the authentication code from your authenticator app.'}
            </div>

            <form onSubmit={submit}>
                {!recovery ? (
                    <div>
                        <Label htmlFor="code">Enter your 2FA Code</Label>
                        <Input
                            id="code"
                            ref={codeInput}
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            autoComplete="one-time-code"
                        />
                        <InputError className="mt-2" message={errors.code} />
                    </div>
                ) : (
                    <div>
                        <Label htmlFor="recovery_code">Recovery Code</Label>

                        <Input
                            id="recovery_code"
                            ref={recoveryCodeInput}
                            value={data.recovery_code}
                            onChange={(e) => setData('recovery_code', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            autoComplete="one-time-code"
                        />
                        <InputError className="mt-2" message={errors.recovery_code} />
                    </div>
                )}

                <div className="mt-4 flex items-center justify-end">
                    <button
                        type="button"
                        className="cursor-pointer text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400"
                        onClick={toggleRecovery}
                    >
                        {recovery ? 'Use an authentication code' : 'Use a recovery code'}
                    </button>

                    <Button className="ms-4" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
