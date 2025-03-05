<?php

declare(strict_types=1);

use App\Actions\ValidateTeamDeletion;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->personalTeam = Team::factory()->create([
        'user_id' => $this->user->id,
        'personal_team' => true,
    ]);
    $this->regularTeam = Team::factory()->create([
        'user_id' => $this->user->id,
        'personal_team' => false,
    ]);
});

it('fails when trying to delete a personal team', function () {
    // Mock authorization to allow deletion
    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->user)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('delete', $this->personalTeam)
        ->andReturnNull();

    // Set the team as  personal team
    $this->personalTeam->personal_team = true;

    $action = new ValidateTeamDeletion();

    $this->expectException(Illuminate\Validation\ValidationException::class);
    $this->expectExceptionMessage('You may not delete your personal team.');

    $action->validate($this->user, $this->personalTeam);
});

it('fails when user is not authorized', function () {
    // Mock the Gate facade to throw AuthorizationException
    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->user)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('delete', $this->regularTeam)
        ->andThrow(new Illuminate\Auth\Access\AuthorizationException);

    $action = new ValidateTeamDeletion();

    $this->expectException(Illuminate\Auth\Access\AuthorizationException::class);

    $action->validate($this->user, $this->regularTeam);
});

it('fails when trying to delete personal team', function () {
    // Mock the Gate facade to return true for authorization
    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->user)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('delete', $this->personalTeam)
        ->andReturnNull();

    $action = new ValidateTeamDeletion();

    $this->expectException(Illuminate\Validation\ValidationException::class);

    $action->validate($this->user, $this->personalTeam);
});
