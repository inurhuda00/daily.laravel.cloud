<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

final class TeamInvitation extends Model
{
    /** @use HasFactory<\Database\Factories\TeamInvitationFactory> */
    use HasFactory;

    protected $fillable = [
        'email',
        'role',
    ];
}
