import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { type Dispatch, type FormEventHandler, type SetStateAction, useEffect, useMemo, useState } from 'react';

function TwoFactorSetupModal({
    show,
    setShow,
    onComplete,
    onClose,
}: {
    show: boolean;
    setShow: Dispatch<SetStateAction<boolean>>;
    onComplete: () => void;
    onClose: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({ code: '' });

    const [qrCode, setQrCode] = useState('');
    const [setupKey, setSetupKey] = useState('');

    const handleConfirm: FormEventHandler = async (e) => {
        e.preventDefault();
        post(route('two-factor.confirm'), {
            errorBag: 'confirmTwoFactorAuthentication',
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset();
                onComplete();
                setShow(false);
            },
        });
    };

    useEffect(() => {
        if (!show) return;

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchSetupTwoFactor = async () => {
            try {
                const [qrResponse, keyResponse] = await Promise.all([
                    axios.get(route('two-factor.qr-code'), { signal }),
                    axios.get(route('two-factor.secret-key'), { signal }),
                ]);
                setQrCode(qrResponse.data.svg);
                setSetupKey(keyResponse.data.secretKey);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    await axios.post(route('two-factor.enable'), { signal });
                    fetchSetupTwoFactor();
                }
            }
        };

        fetchSetupTwoFactor();

        return () => controller.abort();
    }, [show]);

    return (
        <Modal showModal={show} setShowModal={setShow} onClose={onClose} preventDefaultClose>
            <DialogTitle>Complete two-factor authentication setup</DialogTitle>
            <DialogDescription>Complete the following steps:</DialogDescription>

            <form onSubmit={handleConfirm} className="space-y-6">
                <div className="relative">
                    <div className="flex items-start">
                        <div className="mr-4 flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-800">1</div>
                        </div>
                        <div className="flex-1">
                            <h3 className="mb-2 text-base font-medium">Scan QR code or enter setup key</h3>
                            <p className="mb-4 text-sm text-gray-500">
                                Use any authenticator app on your mobile device to scan the QR code, or enter the Setup Key manually.
                            </p>

                            <Tabs defaultValue="qrcode" className="w-full">
                                <TabsList className="grid h-9 w-full grid-cols-2">
                                    <TabsTrigger value="qrcode" className="text-xs">
                                        QR code
                                    </TabsTrigger>
                                    <TabsTrigger value="setupkey" className="text-xs">
                                        Setup key
                                    </TabsTrigger>
                                </TabsList>
                                <div className="mt-4 h-[224px]">
                                    <TabsContent
                                        value="qrcode"
                                        className="m-0 h-full border-0 p-0 data-[state=active]:flex data-[state=active]:items-center data-[state=active]:justify-center"
                                    >
                                        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                                        <div dangerouslySetInnerHTML={{ __html: qrCode }} />
                                    </TabsContent>
                                    <TabsContent
                                        value="setupkey"
                                        className="m-0 h-full border-0 p-0 data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:justify-center"
                                    >
                                        <p className="mb-2 text-xs text-gray-500">Enter this key into your authenticator app:</p>
                                        <div className="relative">
                                            <div className="rounded bg-gray-50 p-3 pr-10 text-center font-mono text-base">{setupKey}</div>
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>

                    <div className="absolute top-8 left-4 h-[calc(100%-16px)] w-px bg-gray-100" />
                </div>

                <div className="relative">
                    <div className="flex items-start">
                        <div className="mr-4 flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-800">2</div>
                        </div>
                        <div className="flex-1">
                            <h3 className="mb-2 text-base font-medium">Enter 6-digit OTP token</h3>
                            <p className="mb-4 text-sm text-gray-500">
                                Enter the 6-digit one time password (OTP) token that your authentication app provides you.
                            </p>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                type="text"
                                autoFocus
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                placeholder="Enter 6-digit code"
                                autoComplete="one-time-code"
                                className="mt-2 mb-1 h-10"
                            />

                            <InputError message={errors.code} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            setShow(false);
                            onClose();
                        }}
                        className="h-9 text-sm"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing} className="h-9 bg-black text-sm text-white hover:bg-gray-800">
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Confirm
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
export function useTwoFactorSetupModal() {
    const [show, setShow] = useState(false);

    return useMemo(
        () => ({
            setModal: setShow,
            TwoFactorSetupModal: ({ onComplete, onClose }: { onComplete: () => void; onClose: () => void }) => (
                <TwoFactorSetupModal show={show} setShow={setShow} onComplete={onComplete} onClose={onClose} />
            ),
        }),
        [show],
    );
}
