<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\DeleteUser;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Laravel\Fortify\Actions\ConfirmPassword;

final class CurrentUserController extends Controller
{
    /**
     * Delete the current user.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, StatefulGuard $guard)
    {
        $confirmed = app(ConfirmPassword::class)(
            $guard,
            $request->user(),
            $request->password
        );

        if (! $confirmed) {
            throw ValidationException::withMessages([
                'password' => 'The password is incorrect.',
            ]);
        }

        app(DeleteUser::class)->delete($request->user()->fresh());

        $guard->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::location(url('/'));
    }
}
