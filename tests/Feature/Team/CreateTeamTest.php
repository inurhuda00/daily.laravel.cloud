<?php

declare(strict_types=1);

use App\Actions\CreateTeam;
use App\Events\AddingTeam;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Event;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('creates a team successfully', function () {
    Event::fake();

    $input = ['name' => 'Test Team'];

    $team = (new CreateTeam())->create($this->user, $input);

    expect($team)
        ->toBeInstanceOf(Team::class)
        ->and($team->name)->toBe('Test Team')
        ->and($team->slug)->toBe('test-team');

    Event::assertDispatched(AddingTeam::class);
});

it('fails when team name is missing', function () {
    $this->expectException(Illuminate\Validation\ValidationException::class);

    (new CreateTeam())->create($this->user, []);
});

it('fails when team name exceeds character limit', function () {
    $this->expectException(Illuminate\Validation\ValidationException::class);

    (new CreateTeam())->create($this->user, ['name' => str_repeat('A', 256)]);
});
