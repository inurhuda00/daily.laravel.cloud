<?php

declare(strict_types=1);

use App\Actions\InviteTeamMember;
use App\Events\InvitingTeamMember;
use App\Mail\TeamInvitation as TeamInvitationMail;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->team = Team::factory()->create(['user_id' => $this->owner->id]);
});

it('invites a team member successfully', function () {
    Mail::fake();
    Event::fake();

    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->owner)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('addTeamMember', $this->team)
        ->andReturnNull();

    $email = 'test@example.com';
    $role = 'editor';

    $action = new InviteTeamMember();
    $action->invite($this->owner, $this->team, $email, $role);

    Event::assertDispatched(InvitingTeamMember::class);
    Mail::assertSent(TeamInvitationMail::class);
});

it('fails when user is not authorized', function () {
    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->owner)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('addTeamMember', $this->team)
        ->andThrow(new Illuminate\Auth\Access\AuthorizationException);

    $action = new InviteTeamMember();

    $this->expectException(Illuminate\Auth\Access\AuthorizationException::class);

    $action->invite($this->owner, $this->team, 'test@example.com', 'editor');
});

it('fails when email is invalid', function () {
    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->owner)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('addTeamMember', $this->team)
        ->andReturnNull();

    $action = new InviteTeamMember();

    $this->expectException(Illuminate\Validation\ValidationException::class);

    $action->invite($this->owner, $this->team, 'invalid-email', 'editor');
});

// it('fails when role is invalid', function () {
//     Gate::partialMock();
//     Gate::shouldReceive('forUser')
//         ->with($this->owner)
//         ->andReturnSelf();
//     Gate::shouldReceive('authorize')
//         ->with('addTeamMember', $this->team)
//         ->andReturnNull();

//     $action = new InviteTeamMember();

//     $this->expectException(Illuminate\Validation\ValidationException::class);

//     $action->invite($this->owner, $this->team, 'test@example.com', 'invalid-role');
// });

it('fails when user is already on team', function () {
    $user = User::factory()->create();
    $this->team->users()->attach($user, ['role' => 'member']);

    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->owner)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('addTeamMember', $this->team)
        ->andReturnNull();

    $action = new InviteTeamMember();

    $this->expectException(Illuminate\Validation\ValidationException::class);

    $action->invite($this->owner, $this->team, $user->email, 'editor');
});

it('fails when invitation already exists', function () {
    TeamInvitation::factory()->create([
        'team_id' => $this->team->id,
        'email' => 'existing@example.com',
        'role' => 'member',
    ]);

    Gate::partialMock();
    Gate::shouldReceive('forUser')
        ->with($this->owner)
        ->andReturnSelf();
    Gate::shouldReceive('authorize')
        ->with('addTeamMember', $this->team)
        ->andReturnNull();

    $action = new InviteTeamMember();

    $this->expectException(Illuminate\Validation\ValidationException::class);

    $action->invite($this->owner, $this->team, 'existing@example.com', 'editor');
});
