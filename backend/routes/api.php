<?php

use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::apiResource('tickets', TicketController::class);

Route::post('tickets/{ticket}/triage-suggest', [TicketController::class, 'triageSuggest']);

Route::get('external/user-info', [TicketController::class, 'externalUserInfo']);
