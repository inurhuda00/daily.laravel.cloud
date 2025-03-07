import { Icon } from '@/components/icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Team } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Send } from 'lucide-react';
import type { FormEventHandler } from 'react';

const AddTeamMemberForm = ({ team, roles }: { team: Team; roles: Record<string, string> }) => {
    const { data, setData, post, reset, processing, errors } = useForm({
        email: '',
        role: 'admin',
    });

    const hansleAddTeamMember: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('team-members.store', team.slug), {
            errorBag: 'addTeamMember',
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form className="grid gap-2" onSubmit={hansleAddTeamMember}>
            <Label htmlFor="email">Invite by email</Label>
            <div className="flex gap-2">
                <Input
                    id="email"
                    name="email"
                    placeholder="hannsn@example.com"
                    className="flex-1"
                    onChange={(e) => setData('email', e.target.value)}
                />
                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                    <SelectTrigger className="w-[6rem] text-sm">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent className="text-sm">
                        {Object.entries(roles).map(([value, label]) => (
                            <SelectItem value={value} key={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button type="submit" size="icon">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {!processing && <Icon iconNode={Send} />}
                </Button>
            </div>
            <InputError message={errors.email} />
        </form>
    );
};

export default AddTeamMemberForm;
