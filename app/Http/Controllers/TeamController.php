<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateTeam;
use App\Actions\DeleteTeam;
use App\Actions\UpdateTeamName;
use App\Actions\ValidateTeamDeletion;
use App\Models\Team;
use App\RedirectsActions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

final class TeamController extends Controller
{
    use RedirectsActions;

    /**
     * Show the team management screen.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @return \Inertia\Response
     */
    public function show(Request $request, $teamId)
    {
        $team = Team::findOrFail($teamId);

        Gate::authorize('view', $team);

        return Inertia::render('Teams/Show', [
            'team' => $team->load('owner', 'users', 'teamInvitations'),
            // 'availableRoles' => array_values(Jetstream::$roles),
            // 'availablePermissions' => Jetstream::$permissions,
            // 'defaultPermissions' => Jetstream::$defaultPermissions,
            'permissions' => [
                'canAddTeamMembers' => Gate::check('addTeamMember', $team),
                'canDeleteTeam' => Gate::check('delete', $team),
                'canRemoveTeamMembers' => Gate::check('removeTeamMember', $team),
                'canUpdateTeam' => Gate::check('update', $team),
                'canUpdateTeamMembers' => Gate::check('updateTeamMember', $team),
            ],
        ]);
    }

    /**
     * Show the team creation screen.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function create(Request $request)
    {
        Gate::authorize('create', Team::class);

        return Inertia::render('Teams/Create');
    }

    /**
     * Create a new team.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse|Response
    {
        $creator = app(CreateTeam::class);

        $creator->create($request->user(), $request->all());

        return $this->redirectPath($creator);
    }

    /**
     * Update the given team's name.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @return RedirectResponse
     */
    public function update(Request $request, $teamId)
    {
        $team = Team::findOrFail($teamId);

        app(UpdateTeamName::class)->update($request->user(), $team, $request->all());

        return back(303);
    }

    /**
     * Delete the given team.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teamId
     * @return RedirectResponse
     */
    public function destroy(Request $request, $teamId): RedirectResponse|Response
    {
        $team = Team::findOrFail($teamId);

        app(ValidateTeamDeletion::class)->validate($request->user(), $team);

        $deleter = app(DeleteTeam::class);

        $deleter->delete($team);

        return $this->redirectPath($deleter);
    }
}
