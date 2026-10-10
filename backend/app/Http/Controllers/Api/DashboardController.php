<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pedal;
use App\Models\Pedalboard;
use App\Models\RigPreset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        $isAdmin = $user->role === 'admin';

        $pedalboards = $isAdmin
            ? Pedalboard::query()
            : $user->pedalboards();
        $rigPresets = $isAdmin
            ? RigPreset::query()
            : $user->rigPresets();

        return response()->json([
            'data' => [
                'total_pedals' => Pedal::query()->count(),
                'total_pedalboards' => $pedalboards->count(),
                'total_rig_presets' => $rigPresets->count(),
                'submitted_rig_presets' => $isAdmin
                    ? RigPreset::query()->where('status', 'Submitted')->count()
                    : null,
            ],
        ]);
    }
}
