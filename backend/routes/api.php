<?php

use Illuminate\Support\Facades\Route;

Route::prefix('tickets')->group(function () {
    // TODO: implement /tickets CRUD routes
});

Route::get('tickets/{id}/triage-suggest', function () {
    // TODO: implement /tickets/{id}/triage-suggest handler
});

Route::get('external/user-info', function () {
    // TODO: implement /external/user-info handler
});
