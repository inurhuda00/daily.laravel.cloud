<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;

final class AddingTeamMember
{
    use Dispatchable;

    /**
     * The team member being added.
     *
     * @var mixed
     */
    public $team;

    /**
     * The team member being added.
     *
     * @var mixed
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @param  mixed  $team
     * @param  mixed  $user
     * @return void
     */
    public function __construct($team, $user)
    {
        $this->team = $team;
        $this->user = $user;
    }
}
