<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CoinController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::post('/coins/claim', [CoinController::class, 'claimDaily'])
    ->middleware(['auth', 'throttle:5,1'])
    ->name('coins.claim');

Route::get('/admin/login', [AdminController::class, 'showLogin'])
    ->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'login'])
    ->middleware('throttle:5,1')
    ->name('admin.login.store');
Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
    ->middleware('admin.session')
    ->name('admin.dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
