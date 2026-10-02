<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class SocialAuthController extends Controller
{
    public function redirect(string $provider): SymfonyRedirectResponse
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback(Request $request, string $provider): RedirectResponse
    {
        $socialUser = Socialite::driver($provider)->user();
        $email = Str::lower(trim((string) $socialUser->getEmail()));
        $providerId = (string) $socialUser->getId();

        if (
            $email === ''
            || ! filter_var($email, FILTER_VALIDATE_EMAIL)
            || $providerId === ''
            || ($provider === 'google' && ! $this->hasVerifiedGoogleEmail($socialUser))
        ) {
            return redirect()->route('login')->withErrors([
                'email' => 'Impossible de vérifier l’adresse email fournie par ce compte.',
            ]);
        }

        $providerColumn = "{$provider}_id";
        $user = DB::transaction(function () use ($email, $providerColumn, $providerId, $socialUser, $request): User {
            $user = User::query()
                ->where($providerColumn, $providerId)
                ->lockForUpdate()
                ->first();

            if ($user === null) {
                $user = User::query()
                    ->where('email', $email)
                    ->lockForUpdate()
                    ->first();
            }

            if ($user === null) {
                $user = new User;
                $user->forceFill([
                    'name' => $socialUser->getName()
                        ?: $socialUser->getNickname()
                        ?: Str::before($email, '@'),
                    'email' => $email,
                    'password' => Str::random(64),
                    'email_verified_at' => now(),
                    'coins' => 200,
                ]);
            } elseif ($user->{$providerColumn} !== null && $user->{$providerColumn} !== $providerId) {
                return $user;
            }

            $user->forceFill([
                $providerColumn => $providerId,
                'avatar' => $socialUser->getAvatar(),
                'email_verified_at' => $user->email_verified_at ?? now(),
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
            ])->save();

            return $user;
        });

        if ($user->{$providerColumn} !== $providerId) {
            return redirect()->route('login')->withErrors([
                'email' => 'Cette adresse email est déjà associée à un autre compte '.$provider.'.',
            ]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    private function hasVerifiedGoogleEmail(SocialiteUser $socialUser): bool
    {
        return filter_var(
            $socialUser->getRaw()['email_verified'] ?? false,
            FILTER_VALIDATE_BOOLEAN,
        );
    }
}
