<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminSessionAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->session()->get('is_admin') !== true) {
            return redirect('/');
        }

        return $next($request);
    }
}
