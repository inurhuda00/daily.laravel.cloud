<?php

declare(strict_types=1);

use App\Actions\UpdateTeamName;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->team = Team::factory()->create(['user_id' => $this->user->id]);
});

it('updates a team name successfully', function () {
    Event::fake();

    // Mock the Gate facade to return true for authorization
    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->user)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('update', $this->team)
        ->andReturnNull();

    $input = [
        'name' => 'Updated Team Name',
        'slug' => 'updated-team-name',
    ];

    $action = new UpdateTeamName();
    $action->update($this->user, $this->team, $input);

    $this->team->refresh();

    expect($this->team->name)->toBe('Updated Team Name');
    expect($this->team->slug)->toBe('updated-team-name');
});

it('fails when user is not authorized', function () {
    // Mock the Gate facade to throw AuthorizationException
    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->user)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('update', $this->team)
        ->andThrow(new Illuminate\Auth\Access\AuthorizationException);

    $input = ['name' => 'Updated Team Name'];

    $this->expectException(Illuminate\Auth\Access\AuthorizationException::class);

    $action = new UpdateTeamName();
    $action->update($this->user, $this->team, $input);
});

it('fails when team name is missing', function () {
    // Mock the Gate facade to return true for authorization
    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->user)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('update', $this->team)
        ->andReturnNull();

    $this->expectException(Illuminate\Validation\ValidationException::class);

    $action = new UpdateTeamName();
    $action->update($this->user, $this->team, []);
});

it('fails when team name exceeds character limit', function () {
    // Mock the Gate facade to return true for authorization
    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->user)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('update', $this->team)
        ->andReturnNull();

    $this->expectException(Illuminate\Validation\ValidationException::class);

    $action = new UpdateTeamName();
    $action->update($this->user, $this->team, ['name' => str_repeat('A', 256)]);
});
