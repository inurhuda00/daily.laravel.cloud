<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Agent;
use App\Http\Controllers\Concerns\ConfirmsTwoFactorAuthentication;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Laravel\Fortify\Features;

final class SecurityController extends Controller
{
    use ConfirmsTwoFactorAuthentication;

    /**
     * Show the general profile settings screen.
     *
     * @return Response
     */
    public function edit(Request $request)
    {
        $this->validateTwoFactorAuthenticationState($request);

        return Inertia::render('settings/security', [
            'requiresConfirmation' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
            'sessions' => $this->sessions($request)->all(),
        ]);
    }

    /**
     * Get the current sessions.
     *
     * @return \Illuminate\Support\Collection
     */
    public function sessions(Request $request)
    {
        if (config('session.driver') !== 'database') {
            return collect();
        }

        return collect(
            DB::connection(config('session.connection'))->table(config('session.table', 'sessions'))
                ->where('user_id', $request->user()->getAuthIdentifier())
                ->orderBy('last_activity', 'desc')
                ->get()
        )->map(function ($session) use ($request) {
            $agent = $this->createAgent($session);

            return (object) [
                'agent' => [
                    'is_desktop' => $agent->isDesktop(),
                    'platform' => $agent->platform(),
                    'browser' => $agent->browser(),
                ],
                'ip_address' => $session->ip_address,
                'is_current_device' => $session->id === $request->session()->getId(),
                'last_active' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
            ];
        });
    }

    /**
     * Create a new agent instance from the given session.
     *
     * @param  mixed  $session
     * @return Agent
     */
    protected function createAgent($session)
    {
        return tap(new Agent(), fn ($agent) => $agent->setUserAgent($session->user_agent));
    }
}
