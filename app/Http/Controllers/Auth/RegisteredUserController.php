<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        $referralCode = $request->query('ref');
        $referralCode = is_string($referralCode)
            ? Str::upper(trim($referralCode))
            : null;

        if ($referralCode !== null && ! User::query()->where('referral_code', $referralCode)->exists()) {
            $referralCode = null;
        }

        return Inertia::render('Auth/Register', [
            'referralCode' => $referralCode,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'referral_code' => ['nullable', 'string', 'size:8', 'regex:/^[A-Z0-9]{8}$/'],
        ]);

        $user = DB::transaction(function () use ($validated): User {
            $referrer = isset($validated['referral_code'])
                ? User::query()
                    ->where('referral_code', $validated['referral_code'])
                    ->lockForUpdate()
                    ->first()
                : null;

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'coins' => $referrer === null ? 0 : 200,
            ]);

            if ($referrer !== null) {
                $user->forceFill(['referred_by' => $referrer->getKey()])->save();
                $referrer->increment('coins', 500);
            }

            return $user;
        });

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
