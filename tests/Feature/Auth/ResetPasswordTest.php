<?php

declare(strict_types=1);

use App\Actions\Fortify\ResetUserPassword;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->user = User::factory()->create([
        'password' => Hash::make('old-password'),
    ]);
});

it('resets user password successfully', function () {
    $action = new ResetUserPassword();

    $action->reset($this->user, [
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);
    expect(Hash::check('new-password', $this->user->fresh()->password))->toBeTrue();
});

it('fails when passwords do not match', function () {
    $action = new ResetUserPassword();

    $this->expectException(Illuminate\Validation\ValidationException::class);

    $action->reset($this->user, [
        'password' => 'new-password',
        'password_confirmation' => 'different-password',
    ]);
});

it('fails when password is too short', function () {
    $action = new ResetUserPassword();

    $this->expectException(Illuminate\Validation\ValidationException::class);

    $action->reset($this->user, [
        'password' => 'short',
        'password_confirmation' => 'short',
    ]);
});
