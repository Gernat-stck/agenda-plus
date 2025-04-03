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
        Schema::table('subscriptions', function (Blueprint $table) {
            // Verifica y agrega las columnas necesarias una por una
            if (!Schema::hasColumn('subscriptions', 'start_date')) {
                $table->timestamp('start_date')->nullable();
            }
            // Agregar la columna plan_id si no existe
            if (!Schema::hasColumn('subscriptions', 'plan_id')) {
                $table->unsignedBigInteger('plan_id')->after('user_id');

                // Agregar la clave foránea
                $table->foreign('plan_id')
                    ->references('id')
                    ->on('subscription_plans')
                    ->onDelete('cascade');
            }

            if (!Schema::hasColumn('subscriptions', 'valid_until')) {
                $table->timestamp('valid_until')->nullable();
            }

            if (!Schema::hasColumn('subscriptions', 'payment_method')) {
                $table->string('payment_method')->default('online');
            }

            if (!Schema::hasColumn('subscriptions', 'last_payment_date')) {
                $table->timestamp('last_payment_date')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'valid_until', 'payment_method', 'last_payment_date']);
            // Eliminar la clave foránea primero
            $table->dropForeign(['plan_id']);

            // Luego eliminar la columna
            $table->dropColumn('plan_id');
        });
    }
};
