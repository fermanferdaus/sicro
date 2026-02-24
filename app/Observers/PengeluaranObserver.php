<?php

namespace App\Observers;

use App\Models\Pengeluaran;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class PengeluaranObserver
{
    /**
     * Handle the Pengeluaran "saving" event.
     */
    public function saving(Pengeluaran $pengeluaran): void
    {
        // Handle Image Upload from File
        if (isset($pengeluaran->bukti_path) && $pengeluaran->bukti_path instanceof \Illuminate\Http\UploadedFile) {
            $file = $pengeluaran->bukti_path;

            // Generate filename
            $filename = Str::uuid() . '.webp';
            $path = 'pengeluaran/' . $filename;

            // Optimize and Encode to WebP
            $image = Image::read($file);
            $image->scale(width: 800);

            // Save to storage
            Storage::disk('public')->put($path, $image->toWebp(50));

            // Delete old image if this is an update and we are replacing it
            if ($pengeluaran->getOriginal('bukti_path')) {
                $oldPath = str_replace('/storage/', '', $pengeluaran->getOriginal('bukti_path'));
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Set the new path string to the model attribute
            $pengeluaran->bukti_path = '/storage/' . $path;
        } elseif (isset($pengeluaran->bukti_path) && is_string($pengeluaran->bukti_path) && str_starts_with($pengeluaran->bukti_path, 'temp/')) {
            // Move from temp
            $finalPath = str_replace('temp/', 'pengeluaran/', $pengeluaran->bukti_path);
            if (Storage::disk('public')->exists($pengeluaran->bukti_path)) {
                Storage::disk('public')->move($pengeluaran->bukti_path, $finalPath);
            }

            if ($pengeluaran->getOriginal('bukti_path')) {
                $oldPath = str_replace('/storage/', '', $pengeluaran->getOriginal('bukti_path'));
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $pengeluaran->bukti_path = '/storage/' . $finalPath;
        } elseif (isset($pengeluaran->bukti_path) && is_string($pengeluaran->bukti_path) && str_starts_with($pengeluaran->bukti_path, '/storage/')) {
            // Keep unchanged
            unset($pengeluaran->bukti_path);
        }

        // Handle explicit removal (if logic sets it to null explicitly to delete)
        if ($pengeluaran->isDirty('bukti_path') && $pengeluaran->bukti_path === null && $pengeluaran->getOriginal('bukti_path')) {
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
    }

    /**
     * Handle the Pengeluaran "deleting" event.
     */
    public function deleting(Pengeluaran $pengeluaran): void
    {
        if ($pengeluaran->bukti_path) {
            $oldPath = str_replace('/storage/', '', $pengeluaran->bukti_path);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
    }
}
