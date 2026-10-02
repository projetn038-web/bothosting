<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class AdminLogController extends Controller
{
    public function index(): Response
    {
        $logPath = storage_path('logs/laravel.log');
        $logAvailable = File::exists($logPath);
        $logs = '';

        if ($logAvailable) {
            $contents = File::get($logPath);
            $contents = preg_replace('/\x1B\[[0-?]*[ -\/]*[@-~]/', '', $contents);
            $contents = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $contents);
            $lines = preg_split('/\r\n|\n|\r/', trim($contents));

            $logs = implode("\n", array_slice($lines ?: [], -500));
        }

        return Inertia::render('Admin/Logs/Index', [
            'logs' => $logs,
            'logAvailable' => $logAvailable,
        ]);
    }
}
