<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;

final class ProfilePhotoController extends Controller
{
    /**
     * Delete the current user's profile photo.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request)
    {
        $request->user()->deleteProfilePhoto();

        return back(303)->with('status', 'profile-photo-deleted');
    }
}
