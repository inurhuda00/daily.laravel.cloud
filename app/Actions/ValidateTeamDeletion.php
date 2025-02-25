<?php

declare(strict_types=1);

namespace App\Actions;

use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

final class ValidateTeamDeletion
{
    /**
     * Validate that the team can be deleted by the given user.
     *
     * @param  mixed  $user
     * @param  mixed  $team
     * @return void
     */
    public function validate($user, $team)
    {
        Gate::forUser($user)->authorize('delete', $team);

        if ($team->personal_team) {
            throw ValidationException::withMessages([
                'team' => 'You may not delete your personal team.',
            ])->errorBag('deleteTeam');
        }
    }
}
