<?php

declare(strict_types=1);

namespace App\Actions;

use App\Events\InvitingTeamMember;
use App\Mail\TeamInvitation as TeamInvitationMail;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use Closure;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

final class InviteTeamMember
{
    /**
     * Invite a new team member to the given team.
     */
    public function invite(User $user, Team $team, string $email, ?string $role = null): void
    {
        Gate::forUser($user)->authorize('addTeamMember', $team);

        $this->validate($team, $email, $role);

        InvitingTeamMember::dispatch($team, $email, $role);

        $invitation = $team->teamInvitations()->create([
            'email' => $email,
            'role' => $role,
        ]);

        Mail::to($email)->send(new TeamInvitationMail($invitation));
    }

    /**
     * Validate the invite member operation.
     */
    private function validate(Team $team, string $email, ?string $role): void
    {
        Validator::make([
            'email' => $email,
            'role' => $role,
        ], $this->rules($team), [
            'email.unique' => 'This user has already been invited to the team.',
        ])->after(
            $this->ensureUserIsNotAlreadyOnTeam($team, $email)
        )->validateWithBag('addTeamMember');
    }

    /**
     * Get the validation rules for inviting a team member.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    private function rules(Team $team): array
    {
        return array_filter([
            'email' => [
                'required',
                'email',
                Rule::unique(TeamInvitation::class)->where(function (Builder $query) use ($team) {
                    $query->where('team_id', $team->id);
                }),
            ],
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
                'email',
                'This user already belongs to the team.'
            );
        };
    }
}
