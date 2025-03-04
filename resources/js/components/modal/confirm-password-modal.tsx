import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { type Dispatch, type FormEventHandler, type SetStateAction, useMemo, useRef, useState } from 'react';

function ConfirmPasswordModal({ show, setShow, onComplete }: { show: boolean; setShow: Dispatch<SetStateAction<boolean>>; onComplete: () => void }) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, errors, processing, reset, setError } = useForm({
        password: '',
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(route('password.confirm.store'), data);
            if (response.status === 201) {
                onComplete();
                setShow(false);
            }

            reset();
            passwordInput.current?.focus();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 422) {
                    setError('password', error.response.data.errors.password);
                }
            }
        }
    };

    return (
        <Modal showModal={show} setShowModal={setShow} preventDefaultClose>
            <DialogTitle>Complete two-factor authentication setup</DialogTitle>
            <DialogDescription>Complete the following steps:</DialogDescription>

            <form onSubmit={submit}>
                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            ref={passwordInput}
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={data.password}
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setShow(false)} className="h-9 text-sm">
                            Cancel
                        </Button>
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Confirm password
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
export function useConfirmPasswordModal() {
    const [show, setShow] = useState(false);

    return useMemo(
        () => ({
            setModal: setShow,
            ConfirmPasswordModal: ({ onComplete }: { onComplete: () => void }) => (
                <ConfirmPasswordModal show={show} setShow={setShow} onComplete={onComplete} />
            ),
        }),
        [show],
    );
}
