<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Categories\StorePedalCategoryRequest;
use App\Http\Requests\Categories\UpdatePedalCategoryRequest;
use App\Http\Resources\PedalCategoryResource;
use App\Models\PedalCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class PedalCategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PedalCategoryResource::collection(
            PedalCategory::query()->withCount('pedals')->orderBy('name')->get(),
        );
    }

    public function show(PedalCategory $category): PedalCategoryResource
    {
        return PedalCategoryResource::make($category->loadCount('pedals'));
    }

    public function store(StorePedalCategoryRequest $request): JsonResponse
    {
        $category = PedalCategory::create($request->validated())->loadCount('pedals');

        return PedalCategoryResource::make($category)
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdatePedalCategoryRequest $request, PedalCategory $category): PedalCategoryResource
    {
        $category->update($request->validated());

        return PedalCategoryResource::make($category->loadCount('pedals'));
    }

    public function destroy(PedalCategory $category): Response|JsonResponse
    {
        if ($category->pedals()->exists()) {
            return response()->json([
                'message' => 'Categories with pedals cannot be deleted.',
                'errors' => [
                    'category' => ['Move or delete pedals in this category before deleting it.'],
                ],
            ], 422);
        }

        $category->delete();

        return response()->noContent();
    }
}
