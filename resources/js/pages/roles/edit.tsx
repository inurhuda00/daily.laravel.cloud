import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import type { BreadcrumbItem } from '@/types';

import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Fragment } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles settings',
        href: '/settings/roles',
    },
];

const EditRolesPage = () => {
    return (
        <Fragment>
            <Head title="Roles settings" />

            <div className="px-4 py-6">
                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">
                        <div className="space-y-6">
                            <HeadingSmall title="Roles Settings" description="Manage user roles, permissions, and access levels." />
                            <Separator />
                        </div>
                    </section>
                </div>
            </div>
        </Fragment>
    );
};

EditRolesPage.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default EditRolesPage;
