<?php

namespace App\Policies;

use App\Models\RigPreset;
use App\Models\User;

class RigPresetPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, RigPreset $rigPreset): bool
    {
        return $user->role === 'admin' || $rigPreset->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, RigPreset $rigPreset): bool
    {
        return $rigPreset->user_id === $user->id && $rigPreset->status !== 'Archived';
    }

    public function delete(User $user, RigPreset $rigPreset): bool
    {
        return $rigPreset->user_id === $user->id && $rigPreset->status !== 'Archived';
    }

    public function submit(User $user, RigPreset $rigPreset): bool
    {
        return $rigPreset->user_id === $user->id && $rigPreset->status === 'Draft';
    }

    public function approve(User $user, RigPreset $rigPreset): bool
    {
        return $user->role === 'admin'
            && $rigPreset->user_id !== $user->id
            && $rigPreset->status === 'Submitted';
    }

    public function archive(User $user, RigPreset $rigPreset): bool
    {
        return $user->role === 'admin' && $rigPreset->status !== 'Archived';
    }
}
