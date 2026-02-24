<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Storage;

class UserObserver
{
    /**
     * Handle the User "saving" event.
     */
    public function saving(User $user): void
    {
        // Handle Image Upload
        if (isset($user->foto_profile) && $user->foto_profile instanceof \Illuminate\Http\UploadedFile) {
            $file = $user->foto_profile;
            $uuid = Str::uuid();

            if (extension_loaded('gd')) {
                $filename = $uuid . '.webp';
                $path = 'profiles/' . $filename;

                // Resize and Encode
                $image = Image::read($file);
                $image->scale(width: 400);
                Storage::disk('public')->put($path, $image->toWebp(50));
            } else {
                // Fallback: Store original file if GD is missing
                $extension = $file->getClientOriginalExtension();
                $filename = $uuid . '.' . $extension;
                $path = 'profiles/' . $filename;

                Storage::disk('public')->putFileAs('profiles', $file, $filename);
            }

            // Update model path
            $user->foto_profile = '/storage/' . $path;
        } elseif (isset($user->foto_profile) && is_string($user->foto_profile) && str_starts_with($user->foto_profile, 'temp/')) {
            // Move from temp
            $finalPath = str_replace('temp/', 'profiles/', $user->foto_profile);
            if (Storage::disk('public')->exists($user->foto_profile)) {
                Storage::disk('public')->move($user->foto_profile, $finalPath);
            }

            // Update model path
            $user->foto_profile = '/storage/' . $finalPath;
        } elseif (isset($user->foto_profile) && is_string($user->foto_profile) && str_starts_with($user->foto_profile, '/storage/')) {
            // Unset to prevent eloquent from thinking it's changed if it hasn't or just keep it
            unset($user->foto_profile);
        }

        // Handle Image Deletion (if updating and replacing, or explicitly removing)
        if ($user->isDirty('foto_profile') && $user->getOriginal('foto_profile')) {
            // If replacing check if old path exists and delete
            $oldPath = str_replace('/storage/', '', $user->getOriginal('foto_profile'));
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
    }

    /**
     * Handle the User "deleting" event.
     */
    public function deleting(User $user): void
    {
        if ($user->foto_profile) {
            $path = str_replace('/storage/', '', $user->foto_profile);
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }
    }
}
