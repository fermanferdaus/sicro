<?php

namespace App\Observers;

use App\Models\Produk;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class ProdukObserver
{
    /**
     * Handle the Produk "saving" event.
     * This is called before create or update.
     */
    public function saving(Produk $produk): void
    {
        // Handle Image Upload from File
        if (isset($produk->gambar) && $produk->gambar instanceof \Illuminate\Http\UploadedFile) {
            $file = $produk->gambar;

            // Generate filename
            $filename = Str::uuid() . '.webp';
            $path = 'produk/' . $filename;

            // Optimize and Encode to WebP
            $image = Image::read($file);
            $image->scale(width: 800); // Resize max width 800, constrain aspect ratio

            // Save to storage
            Storage::disk('public')->put($path, $image->toWebp(50));

            // Delete old image if this is an update and we are replacing it
            if ($produk->getOriginal('gambar')) {
                $oldPath = str_replace('/storage/', '', $produk->getOriginal('gambar'));
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Set the new path to the model attribute (what gets saved to DB)
            $produk->gambar = '/storage/' . $path;
        } elseif (isset($produk->gambar) && is_string($produk->gambar) && str_starts_with($produk->gambar, 'temp/')) {
            // Move from temp
            $finalPath = str_replace('temp/', 'produk/', $produk->gambar);
            if (Storage::disk('public')->exists($produk->gambar)) {
                Storage::disk('public')->move($produk->gambar, $finalPath);
            }

            if ($produk->getOriginal('gambar')) {
                $oldPath = str_replace('/storage/', '', $produk->getOriginal('gambar'));
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $produk->gambar = '/storage/' . $finalPath;
        } elseif (isset($produk->gambar) && is_string($produk->gambar) && str_starts_with($produk->gambar, '/storage/')) {
            // Keep unchanged by unsetting if it wasn't explicitly changed
            unset($produk->gambar);
        } elseif ($produk->isDirty('gambar') && $produk->gambar === null) {
            // Handle case where image is explicitly removed (set to null)
            if ($produk->getOriginal('gambar')) {
                $oldPath = str_replace('/storage/', '', $produk->getOriginal('gambar'));
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
        }
    }

    /**
     * Handle the Produk "deleting" event.
     */
    public function deleting(Produk $produk): void
    {
        if ($produk->gambar) {
            $oldPath = str_replace('/storage/', '', $produk->gambar);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
    }
}
