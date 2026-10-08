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
        Schema::create('rig_presets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('pedalboard_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->json('amp_settings')->nullable();
            $table->string('guitar', 100)->nullable();
            $table->string('tuning', 50)->nullable();
            $table->string('status', 20)->default('Draft')->index();
            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rig_presets');
    }
};
