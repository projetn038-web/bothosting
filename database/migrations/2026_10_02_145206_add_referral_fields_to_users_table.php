<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('referral_code')->nullable()->unique();
            $table->foreignId('referred_by')->nullable()->constrained('users')->nullOnDelete();
        });

        DB::table('users')
            ->whereNull('referral_code')
            ->orderBy('id')
            ->chunkById(100, function ($users): void {
                foreach ($users as $user) {
                    do {
                        $referralCode = Str::upper(Str::random(8));
                    } while (DB::table('users')->where('referral_code', $referralCode)->exists());

                    DB::table('users')
                        ->where('id', $user->id)
                        ->update(['referral_code' => $referralCode]);
                }
            });

        Schema::table('users', function (Blueprint $table) {
            $table->string('referral_code')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['referred_by']);
            $table->dropColumn(['referral_code', 'referred_by']);
        });
    }
};
