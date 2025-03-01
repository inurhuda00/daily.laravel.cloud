<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Actions\DeleteUserWithTeams;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Actions\ConfirmPassword;

final class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/general', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request, StatefulGuard $guard): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

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

        $user = $request->user();

        app(DeleteUserWithTeams::class)->delete($user->fresh());

        $guard->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
