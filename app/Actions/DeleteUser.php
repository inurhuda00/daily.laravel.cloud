<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\User;

final class DeleteUser
{
    /**
     * Delete the given user.
     */
    public function delete(User $user): void
    {
        $user->deleteProfilePhoto();
        $user->tokens->each->delete();
        $user->delete();
    }
}
