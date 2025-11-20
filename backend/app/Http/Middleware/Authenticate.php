<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;

class Authenticate extends Middleware
{
    /**
     * Instead of redirecting to a web login route (which does not exist in this API-only app),
     * return a JSON 401 response so SPA clients can react properly.
     */
    protected function unauthenticated($request, array $guards)
    {
        throw new HttpResponseException(
            response()->json(['message' => 'Unauthenticated.'], 401)
        );
    }

    protected function redirectTo($request): ?string
    {
        return null;
    }
}
