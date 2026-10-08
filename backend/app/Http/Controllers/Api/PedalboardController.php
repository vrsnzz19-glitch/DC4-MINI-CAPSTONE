<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pedalboards\StorePedalboardPedalRequest;
use App\Http\Requests\Pedalboards\StorePedalboardRequest;
use App\Http\Requests\Pedalboards\UpdatePedalboardPedalRequest;
use App\Http\Requests\Pedalboards\UpdatePedalboardRequest;
use App\Http\Resources\PedalboardResource;
use App\Models\Pedal;
use App\Models\Pedalboard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class PedalboardController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Pedalboard::class);

        $boards = Pedalboard::query()
            ->with(['user:id,name', 'pedals.category'])
            ->when(
                $request->user()->role !== 'admin',
                fn ($query) => $query->where('user_id', $request->user()->id),
            )
            ->orderBy('name')
            ->paginate();

        return PedalboardResource::collection($boards);
    }

    public function store(StorePedalboardRequest $request): JsonResponse
    {
        $this->authorize('create', Pedalboard::class);

        $board = $request->user()->pedalboards()->create($request->validated());
        $board->load(['user:id,name', 'pedals.category']);

        return PedalboardResource::make($board)->response()->setStatusCode(201);
    }

    public function show(Pedalboard $pedalboard): PedalboardResource
    {
        $this->authorize('view', $pedalboard);

        return PedalboardResource::make($pedalboard->load(['user:id,name', 'pedals.category']));
    }

    public function update(UpdatePedalboardRequest $request, Pedalboard $pedalboard): PedalboardResource
    {
        $this->authorize('update', $pedalboard);
        $pedalboard->update($request->validated());

        return PedalboardResource::make($pedalboard->load(['user:id,name', 'pedals.category']));
    }

    public function destroy(Pedalboard $pedalboard): Response
    {
        $this->authorize('delete', $pedalboard);
        $pedalboard->delete();

        return response()->noContent();
    }

    public function addPedal(
        StorePedalboardPedalRequest $request,
        Pedalboard $pedalboard,
    ): JsonResponse {
        $this->authorize('update', $pedalboard);

        $data = $request->validated();
        $pedal = Pedal::findOrFail($data['pedal_id']);
        abort_if($pedalboard->pedals()->whereKey($pedal->id)->exists(), 422, 'This pedal is already on the pedalboard.');

        $boardPedals = $pedalboard->pedals()->get();
        $position = $data['position'] ?? ($boardPedals->count() + 1);
        abort_if($position > $boardPedals->count() + 1, 422, 'Position must be within the current pedalboard order.');

        $pedalIds = $boardPedals->pluck('id')->all();
        array_splice($pedalIds, $position - 1, 0, [$pedal->id]);

        DB::transaction(function () use ($data, $pedal, $pedalboard, $pedalIds): void {
            $pedalboard->pedals()->attach($pedal->id, [
                'position' => count($pedalIds) * 2 + 1,
                'settings' => $data['settings'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $this->reorderPedals($pedalboard, $pedalIds);
        });

        return PedalboardResource::make($pedalboard->load(['user:id,name', 'pedals.category']))
            ->response()
            ->setStatusCode(201);
    }

    public function updatePedal(
        UpdatePedalboardPedalRequest $request,
        Pedalboard $pedalboard,
        Pedal $pedal,
    ): PedalboardResource {
        $this->authorize('update', $pedalboard);
        abort_unless($pedalboard->pedals()->whereKey($pedal->id)->exists(), 404);

        $data = $request->validated();

        DB::transaction(function () use ($data, $pedal, $pedalboard): void {
            if (array_key_exists('settings', $data) || array_key_exists('notes', $data)) {
                $pivotData = [];

                if (array_key_exists('settings', $data)) {
                    $pivotData['settings'] = $data['settings'];
                }

                if (array_key_exists('notes', $data)) {
                    $pivotData['notes'] = $data['notes'];
                }

                $pedalboard->pedals()->updateExistingPivot($pedal->id, $pivotData);
            }

            if (array_key_exists('position', $data)) {
                $pedalIds = $pedalboard->pedals()->pluck('pedals.id')->all();
                abort_if($data['position'] > count($pedalIds), 422, 'Position must be within the current pedalboard order.');
                $currentPosition = array_search($pedal->id, $pedalIds, true);
                abort_if($currentPosition === false, 404);
                array_splice($pedalIds, $currentPosition, 1);
                array_splice($pedalIds, $data['position'] - 1, 0, [$pedal->id]);

                $this->reorderPedals($pedalboard, $pedalIds);
            }
        });

        return PedalboardResource::make($pedalboard->load(['user:id,name', 'pedals.category']));
    }

    public function removePedal(Pedalboard $pedalboard, Pedal $pedal): Response
    {
        $this->authorize('update', $pedalboard);
        abort_unless($pedalboard->pedals()->whereKey($pedal->id)->exists(), 404);

        DB::transaction(function () use ($pedalboard, $pedal): void {
            $pedalboard->pedals()->detach($pedal->id);
            $pedalIds = $pedalboard->pedals()->pluck('pedals.id')->all();
            $this->reorderPedals($pedalboard, $pedalIds);
        });

        return response()->noContent();
    }

    /**
     * Rebuild positions through a temporary range to avoid unique-index collisions.
     *
     * @param  list<int>  $pedalIds
     */
    private function reorderPedals(Pedalboard $pedalboard, array $pedalIds): void
    {
        $offset = count($pedalIds) * 2 + 1;
        DB::table('pedalboard_pedals')
            ->where('pedalboard_id', $pedalboard->id)
            ->increment('position', $offset);

        foreach ($pedalIds as $index => $pedalId) {
            DB::table('pedalboard_pedals')
                ->where('pedalboard_id', $pedalboard->id)
                ->where('pedal_id', $pedalId)
                ->update(['position' => $index + 1]);
        }
    }
}
