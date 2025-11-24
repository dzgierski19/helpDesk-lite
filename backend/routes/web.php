<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect('/api/tickets'));

// Placeholder to satisfy any references to the "login" route (e.g., default stubs or packages).
Route::get('/login', fn () => response()->json(['message' => 'Use /api/login for authentication.'], 404))
    ->name('login');
