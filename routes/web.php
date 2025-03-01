<?php

declare(strict_types=1);

use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Middleware\AuthenticateSession;
use App\Http\Middleware\TeamAccessMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

require __DIR__.'/settings.php';

Route::middleware(['auth', 'verified', TeamAccessMiddleware::class, AuthenticateSession::class])
    ->prefix('{team:slug}')
    ->group(function () {
        Route::get('/dashboard', [TeamController::class, 'dashboard'])->name('team.dashboard');
        Route::get('/settings', [TeamController::class, 'settings'])->name('team.settings');

        Route::get('/members', [TeamMemberController::class, 'show'])->name('team.members');
    });
