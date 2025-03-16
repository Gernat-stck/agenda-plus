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
        Schema::create('whatsapp_configurations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();  // Usuario del SaaS
            $table->string('instance_id');                // ID de instancia Ultramsg
            $table->string('token');                      // Token de API
            $table->string('phone_number')->nullable();   // Número vinculado
            $table->enum('status', ['pending', 'active', 'disconnected']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_configurations');
    }
};
