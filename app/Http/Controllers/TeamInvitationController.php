<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\AddTeamMember;
use App\Models\TeamInvitation;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Gate;

final class TeamInvitationController extends Controller
{
    /**
     * Accept a team invitation.
     *
     * @param  int  $invitationId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function accept(Request $request, $invitationId)
    {
        $model = TeamInvitation::class;

        $invitation = $model::whereKey($invitationId)->firstOrFail();

        app(AddTeamMember::class)->add(
            $invitation->team->owner,
            $invitation->team,
            $invitation->email,
            $invitation->role
        );

        $invitation->delete();

        return redirect(config('fortify.home'))->banner(
            __('Great! You have accepted the invitation to join the :team team.', ['team' => $invitation->team->name]),
        );
    }

    /**
     * Cancel the given team invitation.
     *
     * @param  int  $invitationId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request, $invitationId)
    {
        $model = TeamInvitation::class;

        $invitation = $model::whereKey($invitationId)->firstOrFail();

        if (! Gate::forUser($request->user())->check('removeTeamMember', $invitation->team)) {
            throw new AuthorizationException;
        }

        $invitation->delete();

        return back(303);
    }
}
