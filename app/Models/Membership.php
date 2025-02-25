<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

abstract class Membership extends Pivot
{
    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The table associated with the pivot model.
     *
     * @var string
     */
    protected $table = 'team_user';
}
