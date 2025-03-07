<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;

final class TeamInvitation extends Model
{
    /** @use HasFactory<\Database\Factories\TeamInvitationFactory> */
    use HasFactory;

    protected $fillable = [
        'email',
        'role',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $appends = [
        'invitation_link',
    ];

    protected function invitationLink(): Attribute
    {
        return Attribute::make(
            get: fn(mixed $value, array $attributes) => URL::signedRoute('team-invitations.accept', [
                'invitation' => $attributes['id'],
            ]),
        );
    }
}
