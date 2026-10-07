<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pedalboard_pedals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedalboard_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('pedal_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->unsignedInteger('position');
            $table->json('settings')->nullable();
            $table->text('notes')->nullable();
            $table->unique(['pedalboard_id', 'pedal_id']);
            $table->unique(['pedalboard_id', 'position']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedalboard_pedals');
    }
};
