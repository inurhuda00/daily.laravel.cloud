<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateTeam;
use App\Actions\DeleteTeam;
use App\Actions\UpdateTeamName;
use App\Actions\ValidateTeamDeletion;
use App\Models\Team;
use App\RedirectsActions;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Laravel\Fortify\Actions\ConfirmPassword;

final class TeamController extends Controller
{
    use RedirectsActions;

    public function dashboard(Team $team, Request $request)
    {
        return Inertia::render('teams/dashboard');
    }

    public function settings(Team $team, Request $request)
    {
        return Inertia::render('teams/settings/general');
    }

    /**
     * Create a new team.
     *
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
     * @param  int  $teamId
     * @return RedirectResponse
     */
    public function update(Request $request, $teamId)
    {
        $team = Team::findOrFail($teamId);

        app(UpdateTeamName::class)->update($request->user(), $team, $request->all());

        return Redirect::intended(route('teams.settings', $team));
    }

    /**
     * Delete the given team.
     *
     * @param  int  $teamId
     * @return RedirectResponse
     */
    public function destroy(Request $request, $teamId, StatefulGuard $guard): RedirectResponse|Response
    {
        $user = $request->user();
        $team = Team::findOrFail($teamId);

        $confirmed = app(ConfirmPassword::class)(
            $guard,
            $request->user(),
            $request->password
        );

        if (! $confirmed) {
            throw ValidationException::withMessages([
                'password' => 'The password is incorrect.',
            ])->errorBag('deleteTeam');
        }

        app(ValidateTeamDeletion::class)->validate($user, $team);

        $deleter = app(DeleteTeam::class);

        $deleter->delete($team);

        $user->switchTeam($user->personalTeam());

        return $this->redirectPath($deleter);
    }
}
