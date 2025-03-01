<?php

declare(strict_types=1);

namespace App;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redirect;

trait RedirectsActions
{
    /**
     * Get the redirect response for the given action.
     *
     * @param  mixed  $action
     * @return Response
     */
    public function redirectPath($action): RedirectResponse|Response
    {
        if (method_exists($action, 'redirectTo')) {
            $response = $action->redirectTo();
        } else {
            $response = property_exists($action, 'redirectTo')
                ? $action->redirectTo
                : Redirect::to("/{$action->currentTeam->slug}/dashboard", 303);
        }

        return $response instanceof Response ? $response : Redirect::to($response, 303);
    }
}
