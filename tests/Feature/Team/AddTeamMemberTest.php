<?php

declare(strict_types=1);

use App\Actions\AddTeamMember;
use App\Events\AddingTeamMember;
use App\Events\TeamMemberAdded;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->team = Team::factory()->create(['user_id' => $this->owner->id]);
    $this->user = User::factory()->create();
});

it('adds a team member successfully', function () {
    Event::fake();

    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->owner)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('addTeamMember', $this->team)
        ->andReturnNull();

    $action = new AddTeamMember();
    $action->add($this->owner, $this->team, $this->user->email, 'editor');

    expect($this->team->fresh()->hasUserWithEmail($this->user->email))->toBeTrue();

    Event::assertDispatched(AddingTeamMember::class);
    Event::assertDispatched(TeamMemberAdded::class);
});

it('fails when user is not authorized', function () {
    // Mock the Gate facade to throw AuthorizationException
    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->owner)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('addTeamMember', $this->team)
        ->andThrow(new Illuminate\Auth\Access\AuthorizationException);

    $action = new AddTeamMember();

    $this->expectException(Illuminate\Auth\Access\AuthorizationException::class);

    $action->add($this->owner, $this->team, $this->user->email, 'editor');
});

it('fails when email is invalid', function () {
    // Mock the Gate facade to return true for authorization
    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->owner)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('addTeamMember', $this->team)
        ->andReturnNull();

    $action = new AddTeamMember();

    $this->expectException(Illuminate\Validation\ValidationException::class);

    $action->add($this->owner, $this->team, 'invalid-email', 'editor');
});

// it('fails when role is invalid', function () {
//     // Mock the Gate facade to return true for authorization
//     Gate::partialMock();
//     Gate::shouldReceive('forUser')
//         ->with($this->owner)
//         ->andReturnSelf();
//     Gate::shouldReceive('authorize')
//         ->with('addTeamMember', $this->team)
//         ->andReturnNull();

//     $action = new AddTeamMember();

//     $this->expectException(Illuminate\Validation\ValidationException::class);

//     $action->add($this->owner, $this->team, $this->user->email, 'invalid-role');
// });
