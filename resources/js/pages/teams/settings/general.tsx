import type { BreadcrumbItem, SharedData } from '@/types';

import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEventHandler, Fragment } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import HeadingSmall from '@/components/heading-small';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import TeamSettingsLayout from '@/layouts/settings/team-layout';
import { CheckCircle2, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import DeleteTeam from './_components/delete-team';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team settings',
        href: '#',
    },
];

const General = () => {
    const { auth } = usePage<SharedData>().props;
    const team = auth.selectors.current_team;

    const { data, setData, put, errors, processing } = useForm({
        slug: team.slug,
        name: team.name,
    });

    const handleUpdateTeam: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('teams.update', team.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast('Team Updated', {
                    description: 'Your team settings have been updated successfully.',
                    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
                });
            },
        });
    };

    return (
        <Fragment>
            <Head title="Team Settings" />
            <TeamSettingsLayout team={team}>
                <div className="space-y-6">
                    <HeadingSmall title="General" description="General settings related to this organization." />
                    <Separator />
                    <form onSubmit={handleUpdateTeam} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Team name</Label>
                            <div className="mt-1">
                                <Input
                                    id="name"
                                    className="block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Team name"
                                />
                                <InputError className="mt-2" message={errors.name} />
                                <span className="text-muted-foreground mt-1 block text-[0.8rem]">The display name for your team.</span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Team handle</Label>
                            <div className="mt-1">
                                <Input
                                    id="slug"
                                    className="block w-full"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    required
                                    placeholder="team-handle"
                                />
                                <InputError className="mt-2" message={errors.slug} />
                                <span className="text-muted-foreground mt-1 block text-[0.8rem]">
                                    Used in your team's URL: example.com/{data.slug}/dashboard
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>

                <DeleteTeam team={team} />
            </TeamSettingsLayout>
        </Fragment>
    );
};

General.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default General;
