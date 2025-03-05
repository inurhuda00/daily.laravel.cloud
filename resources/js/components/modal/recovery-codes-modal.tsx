import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import Modal from '@/components/ui/modal';
import { copyToClipboard } from '@/lib/copy-to-clipboard';
import axios from 'axios';
import { CheckCircle2, CopyIcon, DownloadIcon, RefreshCwIcon } from 'lucide-react';
import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

function RecoveryCodesModal({ show, setShow }: { show: boolean; setShow: Dispatch<SetStateAction<boolean>> }) {
    const [recoveryCodes, setRecoveryCodes] = useState([]);

    useEffect(() => {
        if (!show) return;

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchSetupRecoveryCodes = async () => {
            try {
                const { data } = await axios.get(route('two-factor.recovery-codes'));
                setRecoveryCodes(data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    await axios.post(route('two-factor.enable'), { signal });
                    fetchSetupRecoveryCodes();
                }
            }
        };

        fetchSetupRecoveryCodes();

        return () => controller.abort();
    }, [show]);

    const handleCopy = async () => {
        try {
            await copyToClipboard(recoveryCodes.join('\n'));
            toast('Recovery codes copied!', {
                description: 'Your recovery codes have been copied to clipboard.',
                icon: <CheckCircle2 className="h-4 w-4" />,
            });
        } catch (error) {
            toast.error('Failed to copy recovery codes, please try again', {
                description: 'An error occurred while copying your recovery codes.',
                icon: <RefreshCwIcon className="h-4 w-4" />,
            });
        }
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([recoveryCodes.join('\n')], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'recovery-codes.txt';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleRefresh = async () => {
        await axios.post(route('two-factor.recovery-codes'));
        const { data } = await axios.get(route('two-factor.recovery-codes'));

        setRecoveryCodes(data);
    };

    return (
        <Modal showModal={show} setShowModal={setShow} preventDefaultClose>
            <DialogTitle>Account recovery codes</DialogTitle>
            <DialogDescription>
                Store your recovery codes in a safe place. They can be used to recover access to your account if your two-factor authentication app is
                lost.
            </DialogDescription>
            <div className="space-y-2 rounded bg-gray-50 p-6 text-center font-mono text-sm break-all">
                {recoveryCodes.map((code) => (
                    <div key={code}>{code}</div>
                ))}
            </div>

            <div className="mt-4 flex justify-between gap-2">
                <Button variant="outline" size="sm" className="h-9 flex-1 text-xs" onClick={handleCopy}>
                    <Icon iconNode={CopyIcon} className="mr-1" />
                    Copy
                </Button>
                <Button variant="outline" size="sm" className="h-9 flex-1 text-xs" onClick={handleDownload}>
                    <Icon iconNode={DownloadIcon} className="mr-1" />
                    Download
                </Button>
                <Button variant="outline" size="sm" className="h-9 flex-1 text-xs" onClick={handleRefresh}>
                    <Icon iconNode={RefreshCwIcon} className="mr-1" />
                    Refresh
                </Button>
            </div>

            <div className="mt-4 border-t pt-4">
                <Button className="h-9 w-full bg-black text-white hover:bg-gray-800" onClick={() => setShow(false)}>
                    Done
                </Button>
            </div>
        </Modal>
    );
}
export function useRecoveryCodesModal() {
    const [show, setShow] = useState(false);

    return useMemo(
        () => ({
            setModal: setShow,
            RecoveryCodesModal: () => <RecoveryCodesModal show={show} setShow={setShow} />,
        }),
        [show],
    );
}
