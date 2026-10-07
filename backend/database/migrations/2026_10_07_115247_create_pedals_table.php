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
        Schema::create('pedals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedal_category_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->string('name', 150);
            $table->string('brand', 100);
            $table->string('model', 100)->nullable();
            $table->string('type', 50)->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->string('image')->nullable();
            $table->string('status', 20)->default('active')->index();
            $table->index(['pedal_category_id', 'status']);
            $table->index(['brand', 'name']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedals');
    }
};
