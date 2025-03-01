<?php

declare(strict_types=1);

use App\Models\Team;
use App\Models\User;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/team-slug/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $team = Team::factory()->create([
        'personal_team' => true,
        'user_id' => $user->id,
    ]);

    $user->update(['current_team_id' => $team->id]);

    $this->actingAs($user);

    $this->get("/{$user->currentTeam->slug}/dashboard")->assertOk();
});
