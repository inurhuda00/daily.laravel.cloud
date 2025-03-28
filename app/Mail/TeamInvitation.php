<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\TeamInvitation as TeamInvitationModel;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

final class TeamInvitation extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The team invitation instance.
     *
     * @var TeamInvitationModel
     */
    public $invitation;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(TeamInvitationModel $invitation)
    {
        $this->invitation = $invitation;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.team-invitation', [
            'acceptUrl' => URL::signedRoute('team-invitations.accept', [
                'invitation' => $this->invitation,
            ]),
            'invitation' => $this->invitation,
        ])->subject('Team Invitation');
    }
}
