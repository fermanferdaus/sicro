<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class TempImageController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => ['required', 'file', 'mimes:jpeg,png,jpg,gif,webp,heic,heif', 'max:10240'], // Max 10MB
        ]);

        $file = $request->file('image');
        $filename = Str::uuid() . '.webp';
        $path = 'temp/' . $filename;

        // Optimize and Encode to WebP
        $image = Image::read($file);
        $image->scale(width: 800); // Resize max width 800

        // Save to temporary storage
        Storage::disk('public')->put($path, $image->toWebp(50));

        return response()->json([
            'url' => '/storage/' . $path,
            'path' => $path
        ]);
    }
}
