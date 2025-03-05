import type { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import HeadingSmall from './heading-small';
import { useConfirmPasswordModal } from './modal/confirm-password-modal';
import { useRecoveryCodesModal } from './modal/recovery-codes-modal';
import { useTwoFactorSetupModal } from './modal/two-factor-auth-modal';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

export default function TwoFactorAuthentication({ requiresConfirmation = false }: { requiresConfirmation?: boolean }) {
    const { auth } = usePage<SharedData>().props;
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(auth.user.two_factor_enabled ?? false);

    const [processing, setProcessing] = useState(false);

    const { ConfirmPasswordModal, setModal: setConfirmPasswordModal } = useConfirmPasswordModal();
    const { TwoFactorSetupModal, setModal: setTwoFactorSetupModal } = useTwoFactorSetupModal();
    const { RecoveryCodesModal, setModal: setRecoveryCodesModal } = useRecoveryCodesModal();

    const handleEnable = async () => {
        try {
            setProcessing(true);

            const status = await axios.get(route('password.confirmation'));

            if (requiresConfirmation && !status.data.confirmed) {
                setConfirmPasswordModal(true);
                return;
            }

            await axios.post(route('two-factor.enable'));

            setTwoFactorEnabled(true);
            setTwoFactorSetupModal(true);
        } catch (error) {
            if (!axios.isAxiosError(error)) return;
            await handleEnable();
        } finally {
            setProcessing(false);
        }
    };

    const handleDisable = async () => {
        if (!twoFactorEnabled) return;

        try {
            setProcessing(true);
            router.delete(route('two-factor.disable'));
            setTwoFactorEnabled(false);
        } catch (error) {
            if (!axios.isAxiosError(error)) return;
        } finally {
            setProcessing(false);
        }
    };

    const handleConfirmPassword = async () => {
        setTwoFactorEnabled(true);
        setTwoFactorSetupModal(true);
    };

    const handleTwoFactorCompleted = () => {
        setRecoveryCodesModal(true);
    };

    const handleShowRecoveryCodes = () => {
        setRecoveryCodesModal(true);
    };

    return (
        <div className="space-y-6">
            <ConfirmPasswordModal onComplete={handleConfirmPassword} />
            <TwoFactorSetupModal onComplete={handleTwoFactorCompleted} onClose={handleDisable} />
            <RecoveryCodesModal />
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

                {!twoFactorEnabled && (
                    <Button onClick={handleEnable} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Enable
                    </Button>
                )}

                {twoFactorEnabled && (
                    <Button variant="destructive" onClick={handleDisable} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Disable
                    </Button>
                )}
            </div>

            {auth.user.two_factor_enabled && (
                <div className="border-b py-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label asChild>
                                <p>Recovery codes</p>
                            </Label>
                            <p className="text-muted-foreground py-2 text-sm">
                                Recovery codes can be used to recover access to your account if your two-factor authentication app is lost.
                            </p>
                        </div>
                        <Button type="button" onClick={handleShowRecoveryCodes} variant="outline" className="h-9 text-sm whitespace-nowrap">
                            Show recovery codes
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
