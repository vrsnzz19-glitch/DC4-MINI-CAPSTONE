<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RigPresets\StoreRigPresetRequest;
use App\Http\Requests\RigPresets\UpdateRigPresetRequest;
use App\Http\Resources\RigPresetResource;
use App\Models\RigPreset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class RigPresetController extends Controller
{
    private const RELATIONS = ['user:id,name', 'pedalboard.user:id,name', 'pedalboard.pedals.category'];

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', RigPreset::class);

        $presets = RigPreset::query()
            ->with(self::RELATIONS)
            ->when(
                $request->user()->role !== 'admin',
                fn ($query) => $query->where('user_id', $request->user()->id),
            )
            ->orderByDesc('updated_at')
            ->paginate();

        return RigPresetResource::collection($presets);
    }

    public function store(StoreRigPresetRequest $request): JsonResponse
    {
        $this->authorize('create', RigPreset::class);

        $preset = $request->user()->rigPresets()->create([
            ...$request->validated(),
            'status' => 'Draft',
        ]);

        return RigPresetResource::make($preset->load(self::RELATIONS))
            ->response()
            ->setStatusCode(201);
    }

    public function show(RigPreset $rigPreset): RigPresetResource
    {
        $this->authorize('view', $rigPreset);

        return RigPresetResource::make($rigPreset->load(self::RELATIONS));
    }

    public function update(UpdateRigPresetRequest $request, RigPreset $rigPreset): RigPresetResource
    {
        $this->authorize('update', $rigPreset);
        $data = $request->validated();

        if ($rigPreset->status !== 'Draft' && $data !== []) {
            $data['status'] = 'Draft';
        }

        $rigPreset->update($data);

        return RigPresetResource::make($rigPreset->load(self::RELATIONS));
    }

    public function destroy(RigPreset $rigPreset): Response
    {
        $this->authorize('delete', $rigPreset);
        $rigPreset->delete();

        return response()->noContent();
    }

    public function submit(RigPreset $rigPreset): RigPresetResource
    {
        $this->authorize('submit', $rigPreset);
        $rigPreset->update(['status' => 'Submitted']);

        return RigPresetResource::make($rigPreset->load(self::RELATIONS));
    }

    public function approve(RigPreset $rigPreset): RigPresetResource
    {
        $this->authorize('approve', $rigPreset);
        $rigPreset->update(['status' => 'Approved']);

        return RigPresetResource::make($rigPreset->load(self::RELATIONS));
    }

    public function archive(RigPreset $rigPreset): RigPresetResource
    {
        $this->authorize('archive', $rigPreset);
        $rigPreset->update(['status' => 'Archived']);

        return RigPresetResource::make($rigPreset->load(self::RELATIONS));
    }
}
