<?php

declare(strict_types=1);

namespace App;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

trait RedirectsActions
{
    /**
     * Get the redirect response for the given action.
     *
     * @param  mixed  $action
     */
    public function redirectPath($action): RedirectResponse|Response
    {
        if (method_exists($action, 'redirectTo')) {
            $response = $action->redirectTo();

            return $response instanceof Response ? $response : Redirect::to($response, 303);
        }

        if (property_exists($action, 'redirectTo')) {
            return Redirect::to($action->redirectTo, 303);
        }

        $user = Auth::user();

        return Redirect::to("/{$user->currentTeam->slug}/dashboard", 303);
    }
}
