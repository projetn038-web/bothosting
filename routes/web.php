<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminLogController;
use App\Http\Controllers\AdminTicketController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\BotServerController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CoinController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/cgu', fn () => Inertia::render('Legal/CGU'))
    ->name('legal.cgu');
Route::get('/rgpd', fn () => Inertia::render('Legal/RGPD'))
    ->name('legal.rgpd');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'bots' => Auth::user()->botServers()->latest()->get(),
    ]);
})->middleware(['auth', 'check.banned', 'verified'])->name('dashboard');

Route::post('/coins/claim', [CoinController::class, 'claimDaily'])
    ->middleware(['auth', 'check.banned', 'throttle:5,1'])
    ->name('coins.claim');
Route::post('/buy-coins', [CheckoutController::class, 'buyCoins'])
    ->middleware(['auth', 'check.banned'])
    ->name('coins.checkout');
Route::post('/webhook/stripe', [WebhookController::class, 'handleStripe'])
    ->name('webhook.stripe');

Route::get('/admin/login', [AdminController::class, 'showLogin'])
    ->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'login'])
    ->middleware('throttle:5,1')
    ->name('admin.login.store');
Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
    ->middleware('admin.session')
    ->name('admin.dashboard');

Route::middleware('admin.session')->prefix('admin/tickets')->name('admin.tickets.')->group(function () {
    Route::get('/', [AdminTicketController::class, 'index'])->name('index');
    Route::get('/{ticket}', [AdminTicketController::class, 'show'])
        ->whereNumber('ticket')
        ->name('show');
    Route::post('/{ticket}/replies', [AdminTicketController::class, 'reply'])
        ->whereNumber('ticket')
        ->name('reply');
    Route::post('/{ticket}/close', [AdminTicketController::class, 'close'])
        ->whereNumber('ticket')
        ->name('close');
});

Route::middleware('admin.session')->prefix('admin/users')->name('admin.users.')->group(function () {
    Route::get('/', [AdminUserController::class, 'index'])->name('index');
    Route::post('/{user}/toggle-ban', [AdminUserController::class, 'toggleBan'])
        ->whereNumber('user')
        ->name('toggle-ban');
    Route::post('/{user}/coins', [AdminUserController::class, 'updateCoins'])
        ->whereNumber('user')
        ->name('coins');
});

Route::get('/admin/logs', [AdminLogController::class, 'index'])
    ->middleware('admin.session')
    ->name('admin.logs.index');

Route::middleware(['auth', 'check.banned'])->group(function () {
    Route::post('/bots', [BotServerController::class, 'store'])->name('bots.store');

    Route::get('/support/tickets', [TicketController::class, 'index'])
        ->name('support.index');
    Route::post('/support/tickets', [TicketController::class, 'store'])
        ->name('support.store');
    Route::get('/support/tickets/{ticket}', [TicketController::class, 'show'])
        ->whereNumber('ticket')
        ->name('support.show');
    Route::post('/support/tickets/{ticket}/replies', [TicketController::class, 'reply'])
        ->whereNumber('ticket')
        ->name('support.reply');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
