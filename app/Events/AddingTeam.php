<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;

final class AddingTeam
{
    use Dispatchable;

    public $owener;

    /**
     * Create a new event instance.
     */
    public function __construct($owener)
    {
        $this->owener = $owener;
    }
}
