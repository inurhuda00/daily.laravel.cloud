import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { SessionInfo } from '@/types';
import { useForm } from '@inertiajs/react';
import { Laptop2, Phone } from 'lucide-react';
import { type FormEventHandler, useRef } from 'react';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function BrowserSessions({ sessions }: { sessions: Array<SessionInfo> }) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const logoutOtherBrowserSessions: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('other-browser-sessions.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };
    return (
        <div className="space-y-6">
            <HeadingSmall title="Browser Sessions" description="Manage and logout your active sessions on other browsers and devices" />
            <Separator />
            {sessions.length > 0 && (
                <div className="mt-5 space-y-4">
                    {sessions.map((session, i) => (
                        <div key={i} className="flex items-center gap-4">
                            {session.agent.is_desktop ? <Laptop2 /> : <Phone />}
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {session.agent.platform || 'Unknown'} - {session.agent.browser || 'Unknown'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {session.ip_address},
                                    {session.is_current_device ? (
                                        <span className="font-semibold text-green-500"> This device</span>
                                    ) : (
                                        <span> Last active {session.last_active}</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive">Log Out Other Browser Sessions</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Log Out Other Browser Sessions</DialogTitle>
                    <DialogDescription>
                        Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices.
                    </DialogDescription>
                    <form className="space-y-6" onSubmit={logoutOtherBrowserSessions}>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="sr-only">
                                Password
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                autoComplete="current-password"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary" onClick={closeModal}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button variant="destructive" disabled={processing} asChild>
                                <button type="submit">Log Out Other Browser Sessions</button>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
