import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { type Dispatch, type FormEventHandler, type SetStateAction, useMemo, useState } from 'react';
import InputError from './input-error';
import { Button } from './ui/button';
import { DialogDescription, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Modal from './ui/modal';

function CreateTeamModal({ show, setShow }: { show: boolean; setShow: Dispatch<SetStateAction<boolean>> }) {
    const { data, setData, post, errors, processing } = useForm({ name: '' });

    const handleCreateTeam: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('teams.store'), {
            preserveScroll: true,
            onSuccess: () => setShow(false),
        });
    };
    return (
        <Modal showModal={show} setShowModal={setShow} preventDefaultClose>
            <DialogTitle>New Team</DialogTitle>
            <DialogDescription>Please complete the payment details below:</DialogDescription>

            <form onSubmit={handleCreateTeam} className="space-y-2">
                <div className="mb-4 grid gap-2">
                    <Label htmlFor="name">Team Name</Label>

                    <Input
                        id="name"
                        type="name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="My team"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" type="button" onClick={() => setShow(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
export function useCreateTeamModal() {
    const [show, setShow] = useState(false);

    return useMemo(
        () => ({
            setModal: setShow,
            CreateTeamModal: () => <CreateTeamModal show={show} setShow={setShow} />,
        }),
        [show],
    );
}
