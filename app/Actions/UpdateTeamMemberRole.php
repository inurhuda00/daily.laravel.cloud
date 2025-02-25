<?php

declare(strict_types=1);

namespace App\Actions;

use App\Events\TeamMemberUpdated;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

final class UpdateTeamMemberRole
{
    /**
     * Update the role for the given team member.
     *
     * @param  mixed  $user
     * @param  mixed  $team
     * @param  int  $teamMemberId
     * @return void
     */
    public function update($user, $team, $teamMemberId, string $role)
    {
        Gate::forUser($user)->authorize('updateTeamMember', $team);

        Validator::make([
            'role' => $role,
        ], [
            'role' => ['required', 'string'],
        ])->validate();

        $team->users()->updateExistingPivot($teamMemberId, [
            'role' => $role,
        ]);

        TeamMemberUpdated::dispatch($team->fresh(), $this->findUserByIdOrFail($teamMemberId));
    }

    private function findUserByIdOrFail($id)
    {
        return User::where('id', $id)->firstOrFail();
    }
}
