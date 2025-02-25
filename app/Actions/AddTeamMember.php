<?php

declare(strict_types=1);

namespace App\Actions;

use App\Events\AddingTeamMember;
use App\Events\TeamMemberAdded;
use App\Models\Team;
use App\Models\User;
use Closure;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

final class AddTeamMember
{
    /**
     * Add a new team member to the given team.
     */
    public function add(User $user, Team $team, string $email, ?string $role = null): void
    {
        Gate::forUser($user)->authorize('addTeamMember', $team);

        $this->validate($team, $email, $role);

        $newTeamMember = User::where('email', $email)->firstOrFail();

        AddingTeamMember::dispatch($team, $newTeamMember);

        $team->users()->attach(
            $newTeamMember, ['role' => $role]
        );

        TeamMemberAdded::dispatch($team, $newTeamMember);
    }

    /**
     * Validate the add member operation.
     */
    private function validate(Team $team, string $email, ?string $role): void
    {
        Validator::make([
            'email' => $email,
            'role' => $role,
        ], $this->rules(), [
            'email.exists' => 'We were unable to find a registered user with this email address.',
        ])->after(
            $this->ensureUserIsNotAlreadyOnTeam($team, $email)
        )->validateWithBag('addTeamMember');
    }

    /**
     * Get the validation rules for adding a team member.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    private function rules(): array
    {
        return array_filter([
            'email' => ['required', 'email', 'exists:users'],
            'role' => ['required', 'string'],
        ]);
    }

    /**
     * Ensure that the user is not already on the team.
     */
    private function ensureUserIsNotAlreadyOnTeam(Team $team, string $email): Closure
    {
        return function ($validator) use ($team, $email) {
            $validator->errors()->addIf(
                $team->hasUserWithEmail($email),
                'email', 'This user already belongs to the team.'
            );
        };
    }
}
