<?php

declare(strict_types=1);

use App\Http\Controllers\CurrentTeamController;
use App\Http\Controllers\OtherBrowserSessionsController;
use App\Http\Controllers\ProfilePhotoController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SecurityController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamInvitationController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Middleware\AuthenticateSession;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', AuthenticateSession::class])->group(function () {

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    // User & Profile...
    Route::redirect('settings', 'settings/profile');
    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'store'])->name('password.store');

    Route::get('settings/security', [SecurityController::class, 'edit'])->name('security.edit');
    Route::put('settings/security', [SecurityController::class, 'update'])->name('security.update');

    Route::get('settings/roles', [RoleController::class, 'manage'])->name('roles.manage');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('/roles/{role}', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('settings/roles', [RoleController::class, 'update'])->name('roles.update');
    Route::delete('settings/roles', [RoleController::class, 'destroy'])->name('roles.destroy');

    Route::delete('/user/other-browser-sessions', [OtherBrowserSessionsController::class, 'destroy'])->name('other-browser-sessions.destroy');

    Route::delete('/user/profile-photo', [ProfilePhotoController::class, 'destroy'])->name('current-user-photo.destroy');

    // API...
    // Route::get('/user/api-tokens', [ApiTokenController::class, 'index'])->name('api-tokens.index');
    // Route::post('/user/api-tokens', [ApiTokenController::class, 'store'])->name('api-tokens.store');
    // Route::put('/user/api-tokens/{token}', [ApiTokenController::class, 'update'])->name('api-tokens.update');
    // Route::delete('/user/api-tokens/{token}', [ApiTokenController::class, 'destroy'])->name('api-tokens.destroy');

    // Teams...
    Route::get('/teams/create', [TeamController::class, 'create'])->name('teams.create');
    Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');
    Route::get('/teams/{team}', [TeamController::class, 'show'])->name('teams.show');
    Route::put('/teams/{team}', [TeamController::class, 'update'])->name('teams.update');
    Route::delete('/teams/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');

    Route::put('/current-team', [CurrentTeamController::class, 'update'])->name('current-team.update');
    Route::post('/teams/{team}/members', [TeamMemberController::class, 'store'])->name('team-members.store');
    Route::put('/teams/{team}/members/{user}', [TeamMemberController::class, 'update'])->name('team-members.update');
    Route::delete('/teams/{team}/members/{user}', [TeamMemberController::class, 'destroy'])->name('team-members.destroy');

    Route::get('/team-invitations/{invitation}', [TeamInvitationController::class, 'accept'])
        ->middleware(['signed'])
        ->name('team-invitations.accept');

    Route::delete('/team-invitations/{invitation}', [TeamInvitationController::class, 'destroy'])
        ->name('team-invitations.destroy');
});
