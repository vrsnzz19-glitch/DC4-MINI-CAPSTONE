<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PedalboardController;
use App\Http\Controllers\Api\PedalCategoryController;
use App\Http\Controllers\Api\PedalController;
use App\Http\Controllers\Api\RigPresetController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/pedals', [PedalController::class, 'index']);
Route::get('/pedal-filters', [PedalController::class, 'filters']);
Route::get('/pedals/{pedal}', [PedalController::class, 'show']);
Route::get('/categories', [PedalCategoryController::class, 'index']);
Route::get('/categories/{category}', [PedalCategoryController::class, 'show']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/dashboard', DashboardController::class);

    Route::apiResource('pedalboards', PedalboardController::class);
    Route::post('/pedalboards/{pedalboard}/pedals', [PedalboardController::class, 'addPedal']);
    Route::put('/pedalboards/{pedalboard}/pedals/{pedal}', [PedalboardController::class, 'updatePedal']);
    Route::delete('/pedalboards/{pedalboard}/pedals/{pedal}', [PedalboardController::class, 'removePedal']);

    Route::apiResource('rig-presets', RigPresetController::class);
    Route::post('/rig-presets/{rigPreset}/submit', [RigPresetController::class, 'submit']);
    Route::post('/rig-presets/{rigPreset}/approve', [RigPresetController::class, 'approve']);
    Route::post('/rig-presets/{rigPreset}/archive', [RigPresetController::class, 'archive']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function (): void {
    Route::post('/pedals', [PedalController::class, 'store']);
    Route::put('/pedals/{pedal}', [PedalController::class, 'update']);
    Route::delete('/pedals/{pedal}', [PedalController::class, 'destroy']);
    Route::post('/categories', [PedalCategoryController::class, 'store']);
    Route::put('/categories/{category}', [PedalCategoryController::class, 'update']);
    Route::delete('/categories/{category}', [PedalCategoryController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});
