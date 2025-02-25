<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;

final class InvitingTeamMember
{
    use Dispatchable;

    /**
     * The team instance.
     *
     * @var mixed
     */
    public $team;

    /**
     * The email address of the invitee.
     *
     * @var mixed
     */
    public $email;

    /**
     * The role of the invitee.
     *
     * @var mixed
     */
    public $role;

    /**
     * Create a new event instance.
     *
     * @param  mixed  $team
     * @param  mixed  $email
     * @param  mixed  $role
     * @return void
     */
    public function __construct($team, $email, $role)
    {
        $this->team = $team;
        $this->email = $email;
        $this->role = $role;
    }
}
