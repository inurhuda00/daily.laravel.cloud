import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import type { BreadcrumbItem } from '@/types';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Fragment } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles settings',
        href: '/settings/roles',
    },
];

const ManageRolesPage = () => {
    const standardPermissions = [
        { left: { id: 'view', label: 'View' }, right: { id: 'view-any', label: 'View Any' } },
        { left: { id: 'create', label: 'Create' }, right: { id: 'update', label: 'Update' } },
        { left: { id: 'restore', label: 'Restore' }, right: { id: 'restore-any', label: 'Restore Any' } },
        { left: { id: 'replicate', label: 'Replicate' }, right: { id: 'reorder', label: 'Reorder' } },
        { left: { id: 'delete', label: 'Delete' }, right: { id: 'delete-any', label: 'Delete Any' } },
        { left: { id: 'force-delete', label: 'Force Delete' }, right: { id: 'force-delete-any', label: 'Force Delete Any' } },
    ];

    const modelPermissions = [
        { model: 'Post', permissions: standardPermissions },
        { model: 'User', permissions: standardPermissions },
        { model: 'Comment', permissions: standardPermissions },
        { model: 'Category', permissions: standardPermissions },
        { model: 'Media', permissions: standardPermissions },
        { model: 'Setting', permissions: standardPermissions },
    ];

    return (
        <Fragment>
            <Head title="Roles settings" />

            <div className="px-4 py-6">
                <div className="flex-1">
                    <section className="space-y-12">
                        <div className="space-y-6">
                            <HeadingSmall title="Roles Settings" description="Manage user roles, permissions, and access levels." />
                            <Separator />
                            <div className="grid gap-4 md:grid-cols-2">
                                {modelPermissions.map((modelPermission) => {
                                    return (
                                        <div className="p-4">
                                            <span>{modelPermission.model}</span>
                                            <div className="mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id={`select-all-${modelPermission.model}`} />
                                                    <Label
                                                        htmlFor={`select-all-${modelPermission.model}`}
                                                        className="cursor-pointer text-sm font-medium text-primary"
                                                    >
                                                        Select all
                                                    </Label>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-y-3">
                                                {modelPermission.permissions.map((group, index) => (
                                                    <>
                                                        <div key={`left-${modelPermission.model}-${index}`} className="flex items-center space-x-2">
                                                            <Checkbox id={`${modelPermission.model}-${group.left.id}`} />
                                                            <Label
                                                                htmlFor={`${modelPermission.model}-${group.left.id}`}
                                                                className="cursor-pointer text-sm"
                                                            >
                                                                {group.left.label}
                                                            </Label>
                                                        </div>

                                                        {group.right && (
                                                            <div
                                                                key={`right-${modelPermission.model}-${index}`}
                                                                className="flex items-center space-x-2"
                                                            >
                                                                <Checkbox id={`${modelPermission.model}-${group.right.id}`} />
                                                                <Label
                                                                    htmlFor={`${modelPermission.model}-${group.right.id}`}
                                                                    className="cursor-pointer text-sm"
                                                                >
                                                                    {group.right.label}
                                                                </Label>
                                                            </div>
                                                        )}
                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Fragment>
    );
};

ManageRolesPage.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default ManageRolesPage;
