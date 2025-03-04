<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

final class RoleController extends Controller
{
    public function manage()
    {
        return Inertia::render('roles/manage');
    }

    public function store(Request $request) {}

    public function edit($id)
    {
        return Inertia::render('roles/edit');
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
