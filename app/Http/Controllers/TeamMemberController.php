<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\InviteTeamMember;
use App\Actions\RemoveTeamMember;
use App\Actions\UpdateTeamMemberRole;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

final class TeamMemberController extends Controller
{
    public function show(Team $team, Request $request)
    {
        return Inertia::render('teams/settings/members');
    }

    /**
     * Add a new team member to a team.
     *
     * @param  int  $teamId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, $teamId)
    {
        $team = Team::findOrFail($teamId);

        app(InviteTeamMember::class)->invite(
            $request->user(),
            $team,
            $request->email ?: '',
            $request->role
        );

        return back(303);
    }

    /**
     * Update the given team member's role.
     *
     * @param  int  $teamId
     * @param  int  $userId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $teamId, $userId)
    {
        app(UpdateTeamMemberRole::class)->update(
            $request->user(),
            Team::findOrFail($teamId),
            $userId,
            $request->role
        );

        return back(303);
    }

    /**
     * Remove the given user from the given team.
     *
     * @param  int  $teamId
     * @param  int  $userId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request, $teamId, $userId)
    {
        $team = Team::findOrFail($teamId);
        $user = User::where('id', $userId)->firstOrFail();

        app(RemoveTeamMember::class)->remove(
            $request->user(),
            $team,
            $user
        );

        if ($request->user()->id === $user->id) {
            return Redirect::route('teams.dashboard', $user->currentTeam);
        }

        return back(303);
    }
}
