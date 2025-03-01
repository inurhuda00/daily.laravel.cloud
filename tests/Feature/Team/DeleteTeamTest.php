<?php

declare(strict_types=1);

use App\Models\Team;
use App\Models\User;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->team = Team::factory()->create(['user_id' => $this->owner->id]);

    $this->owner->update(['current_team_id' => $this->team->id]);

    $this->users = User::factory(2)->create();
    foreach ($this->users as $user) {
        $this->team->users()->attach($user);
        $user->update(['current_team_id' => $this->team->id]);
    }
});

it('deletes a team and removes associations', function () {
    $this->team->purge();

    $this->owner->refresh();
    foreach ($this->users as $user) {
        $user->refresh();
    }

    expect($this->owner->current_team_id)->toBeNull();
    foreach ($this->users as $user) {
        expect($user->current_team_id)->toBeNull();
    }

    expect(Team::where('id', $this->team->id)->exists())->toBeFalse();
});
