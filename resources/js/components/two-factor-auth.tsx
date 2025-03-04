import type { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { type FormEventHandler, Fragment, useState } from 'react';
import HeadingSmall from './heading-small';
import InputError from './input-error';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

export default function TwoFactorAuthentication() {
    const { auth } = usePage<SharedData>().props;
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(auth.user.two_factor_enabled ?? false);
    const [qrCode, setQrCode] = useState(null);
    const [setupKey, setSetupKey] = useState(null);
    const [recoveryCodes, setRecoveryCodes] = useState([]);
    const { data, setData, post, delete: destroy, reset: resetForm, processing, errors } = useForm({ code: '', password: '' });

    const resetState = () => {
        setQrCode(null);
        setSetupKey(null);
        setRecoveryCodes([]);
        setData({ code: '', password: '' });
        resetForm();
    };

    const handleEnable = async () => {
        post(route('two-factor.enable'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: async () => {
                await fetchQrCodeAndRecoveryCodes();
            },
        });
    };

    const fetchQrCodeAndRecoveryCodes = async () => {
        try {
            const [qrResponse, keyResponse, codesResponse] = await Promise.all([
                axios.get(route('two-factor.qr-code')),
                axios.get(route('two-factor.secret-key')),
                axios.get(route('two-factor.recovery-codes')),
            ]);
            setQrCode(qrResponse.data.svg);
            setSetupKey(keyResponse.data.secretKey);
            setRecoveryCodes(codesResponse.data);

            setTwoFactorEnabled(true);
        } catch (error) {
            console.error('Error fetching 2FA setup data:', error);
        }
    };

    const handleConfirm: FormEventHandler = async (e) => {
        e.preventDefault();
        post(route('two-factor.confirm'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => resetState(),
        });
    };

    const handleRegenerate = async () => {
        try {
            await axios.post(route('two-factor.recovery-codes'));
            const { data } = await axios.get(route('two-factor.recovery-codes'));
            setRecoveryCodes(data);
        } catch (error) {
            console.error('Error regenerating recovery codes:', error);
        }
    };

    const handleDisable = async () => {
        destroy(route('two-factor.disable'), {
            errorBag: 'confirmTwoFactorAuthentication',
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setTwoFactorEnabled(false);
                resetState();
            },
        });
    };

    return (
        <div className="space-y-6">
            <HeadingSmall title="Security" description="Enable extra security for your account." />
            <Separator />
            <div className="flex items-center gap-4">
                <div>
                    <Label asChild>
                        <p>Two Factor Authentication</p>
                    </Label>

                    <p className="text-muted-foreground py-2 text-sm">
                        When two-factor authentication is enabled, you will be prompted for a secure token during authentication. Retrieve this from
                        your phone's authenticator app.
                    </p>
                </div>

                {!twoFactorEnabled ? (
                    <Button onClick={handleEnable} disabled={processing}>
                        Enable
                    </Button>
                ) : (
                    <Button variant="destructive" onClick={handleDisable} disabled={processing}>
                        Disable
                    </Button>
                )}
            </div>
            {twoFactorEnabled && qrCode && (
                <div className="grid gap-2">
                    {/* @ts-expect-error : <from bagerror> */}
                    <InputError message={errors.confirmTwoFactorAuthentication?.code} />
                    <p className="text-muted-foreground py-2 text-sm">Scan the QR code or enter the setup key into your authenticator app.</p>
                    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                    <div dangerouslySetInnerHTML={{ __html: qrCode }} />
                    {setupKey && <p>Setup Key: {setupKey}</p>}
                    <form onSubmit={handleConfirm} className="flex items-end gap-2">
                        <Label htmlFor="code">
                            Code
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                type="text"
                                autoFocus
                                autoComplete="one-time-code"
                                className="mt-2 h-10"
                            />
                        </Label>
                        <Button type="submit" variant="outline" disabled={processing}>
                            Confirm
                        </Button>
                    </form>
                </div>
            )}

            {twoFactorEnabled && recoveryCodes.length > 0 && (
                <Fragment>
                    <div className="space-y-2">
                        <Label>Recovery Codes</Label>
                        <p className="text-muted-foreground py-2 text-sm">Store these recovery codes securely. They can help if you lose access.</p>
                        <ul className="bg-muted rounded-md p-4">
                            {recoveryCodes.map((code) => (
                                <li key={code}>{code}</li>
                            ))}
                        </ul>
                    </div>
                    <Button onClick={handleRegenerate} disabled={processing}>
                        Regenerate Recovery Codes
                    </Button>
                </Fragment>
            )}
        </div>
    );
}
