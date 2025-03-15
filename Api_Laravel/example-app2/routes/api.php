<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
Use App\Http\Controllers\EscuelasController;

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {

    //Rutas para los usuarios 
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::post('/profile', [AuthController::class, 'profile'])->middleware('auth:api');
    Route::patch('/profile/update', [AuthController::class, 'updateProfile'])->middleware('auth:api');
    Route::delete('/profile/delete', [AuthController::class, 'deleteProfile'])->middleware('auth:api');

    //Rutas para las escuelas
    Route::apiResource('escuelas', EscuelasController::class);
});