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
        Schema::create('calendar_config', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->boolean('show_weekend')->default(false); // Mostrar fin de semana
            $table->string('start_time')->default('09:00'); // Hora de inicio
            $table->string('end_time')->default('18:00'); // Corregido: end_time en lugar de end_date
            $table->json('business_days')->default(json_encode([1, 2, 3, 4, 5])); // Lunes a viernes
            $table->timestamps();
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendar_config');
    }
};
