<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Team;

final class DeleteTeam
{
    /**
     * Delete the given team.
     */
    public function delete(Team $team): void
    {
        $team->purge();
    }
}
