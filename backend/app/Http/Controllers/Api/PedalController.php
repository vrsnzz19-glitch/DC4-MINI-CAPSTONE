<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pedals\IndexPedalRequest;
use App\Http\Requests\Pedals\StorePedalRequest;
use App\Http\Requests\Pedals\UpdatePedalRequest;
use App\Http\Resources\PedalResource;
use App\Models\Pedal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class PedalController extends Controller
{
    public function index(IndexPedalRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $pedals = Pedal::query()
            ->with('category')
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('brand', 'like', "%{$search}%")
                        ->orWhere('model', 'like', "%{$search}%");
                });
            })
            ->when($filters['category'] ?? null, function ($query, string $category): void {
                if (ctype_digit($category)) {
                    $query->where('pedal_category_id', (int) $category);

                    return;
                }

                $query->whereHas('category', fn ($query) => $query->where('name', $category));
            })
            ->when($filters['type'] ?? null, fn ($query, string $type) => $query->where('type', $type))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->orderBy('name')
            ->paginate();

        return PedalResource::collection($pedals);
    }

    public function show(Pedal $pedal): PedalResource
    {
        return PedalResource::make($pedal->load('category'));
    }

    public function store(StorePedalRequest $request): JsonResponse
    {
        $pedal = Pedal::create($request->validated())->load('category');

        return PedalResource::make($pedal)
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdatePedalRequest $request, Pedal $pedal): PedalResource
    {
        $pedal->update($request->validated());

        return PedalResource::make($pedal->load('category'));
    }

    public function destroy(Pedal $pedal): Response
    {
        DB::transaction(function () use ($pedal): void {
            $pedal->pedalboards()->detach();
            $pedal->delete();
        });

        return response()->noContent();
    }
}
