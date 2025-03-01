<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Team;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class TeamAccessMiddleware
 *
 * Middleware to restrict access to team-specific routes.
 */
final class TeamAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request  The incoming request instance.
     * @param  Closure  $next  The next middleware handler.
     * @return Response The response after processing the request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Team|null $team */
        $team = $request->route('team');

        // Ensure $team is a valid instance of Team
        if (! ($team instanceof Team) || ! $request->user()?->belongsToTeam($team)) {
            abort(403, 'Unauthorized access');
        }

        return $next($request);
    }
}
