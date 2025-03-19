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
            $table->foreignId('user_id')->constrained();
            // Para Twilio
            $table->string('account_sid')->nullable();
            $table->string('auth_token')->nullable();

            // Información general
            $table->string('phone_number')->nullable();
            $table->enum('provider', ['twilio'])->default('twilio');
            $table->enum('status', ['pending', 'active', 'disconnected'])->default('pending');
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
