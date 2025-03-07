@component('mail::message')
# You're Invited!

You have been invited to join **{{ $invitation->email }}** as a **{{ $invitation->role }}**.

Click the button below to accept your invitation:

@component('mail::button', ['url' => $acceptUrl])
Accept Invitation
@endcomponent

If you did not expect this invitation, you can ignore this email.

Thanks,  
{{ config('app.name') }}
@endcomponent