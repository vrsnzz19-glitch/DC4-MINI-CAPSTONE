<?php

namespace App\Policies;

use App\Models\Pedalboard;
use App\Models\User;

class PedalboardPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Pedalboard $pedalboard): bool
    {
        return $user->role === 'admin' || $pedalboard->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Pedalboard $pedalboard): bool
    {
        return $pedalboard->user_id === $user->id;
    }

    public function delete(User $user, Pedalboard $pedalboard): bool
    {
        return $pedalboard->user_id === $user->id;
    }
}
