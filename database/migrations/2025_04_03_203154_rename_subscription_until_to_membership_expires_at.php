<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Renombrar la columna subscription_until a membership_expires_at
            if (Schema::hasColumn('users', 'subscription_until') && !Schema::hasColumn('users', 'membership_expires_at')) {
                $table->renameColumn('subscription_until', 'membership_expires_at');
            }
            // Si por alguna razón no existe ninguna de las dos columnas
            else if (!Schema::hasColumn('users', 'subscription_until') && !Schema::hasColumn('users', 'membership_expires_at')) {
                $table->timestamp('membership_expires_at')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revertir el cambio de nombre
            if (Schema::hasColumn('users', 'membership_expires_at')) {
                $table->renameColumn('membership_expires_at', 'subscription_until');
            }
        });
    }
};
