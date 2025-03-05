import { useForm } from '@inertiajs/react';
import { type FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import HeadingSmall from '@/components/heading-small';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Team } from '@/types';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from './ui/separator';

export default function DeleteTeam({ team }: { team: Team }) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('teams.destroy', team.id), {
            errorBag: 'deleteTeam',
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                toast('Team Deleted', {
                    description: 'Your team has been deleted successfully.',
                    icon: <CheckCircle2 className="h-4 w-4" />,
                });
            },
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
            <HeadingSmall title="Delete Team" description="Delete your Team and all of its resources" />
            <Separator />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Danger Zone</p>
                    <p className="text-sm">Irreversible actions for your team, this cannot be undone.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Delete Team</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Are you sure you want to delete this team?</DialogTitle>
                        <DialogDescription>
                            Once your team is deleted, all of its resources and data will also be permanently deleted. Please enter your password to
                            confirm you would like to permanently delete your team.
                        </DialogDescription>
                        <form className="space-y-6" onSubmit={deleteUser}>
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
                                {/* @ts-expect-error : <from bagerror> */}
                                <InputError message={errors.team} />
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary" onClick={closeModal}>
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button type="submit" variant="destructive" disabled={processing}>
                                    Delete Team
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
