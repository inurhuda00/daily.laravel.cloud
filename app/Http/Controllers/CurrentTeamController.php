<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Redirect;

final class CurrentTeamController extends Controller
{
    /**
     * Update the authenticated user's current team.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $team = Team::findOrFail($request->team_id);

        if (! $request->user()->switchTeam($team)) {
            abort(403);
        }

        return Redirect::route('teams.dashboard', $team);
    }
}
