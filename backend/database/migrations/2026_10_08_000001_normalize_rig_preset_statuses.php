<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('rig_presets')->where('status', 'draft')->update(['status' => 'Draft']);
        DB::table('rig_presets')->where('status', 'pending')->update(['status' => 'Submitted']);
        DB::table('rig_presets')->where('status', 'submitted')->update(['status' => 'Submitted']);
        DB::table('rig_presets')->where('status', 'approved')->update(['status' => 'Approved']);
        DB::table('rig_presets')->where('status', 'archived')->update(['status' => 'Archived']);

        Schema::table('rig_presets', function (Blueprint $table): void {
            $table->string('status', 20)->default('Draft')->change();
        });
    }

    public function down(): void
    {
        DB::table('rig_presets')->where('status', 'Draft')->update(['status' => 'draft']);
        DB::table('rig_presets')->where('status', 'Submitted')->update(['status' => 'pending']);
        DB::table('rig_presets')->where('status', 'Approved')->update(['status' => 'approved']);
        DB::table('rig_presets')->where('status', 'Archived')->update(['status' => 'archived']);

        Schema::table('rig_presets', function (Blueprint $table): void {
            $table->string('status', 20)->default('draft')->change();
        });
    }
};
