<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);

    Route::apiResource('tickets', TicketController::class);
    Route::post('tickets/{ticket}/triage-suggest', [TicketController::class, 'triageSuggest']);
    Route::get('external/user-info', [TicketController::class, 'externalUserInfo']);
});
