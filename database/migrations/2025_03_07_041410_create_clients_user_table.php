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
        Schema::create('clients_user', function (Blueprint $table) {
            $table->string('client_id');
            $table->string('user_id');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Clave primaria compuesta
            $table->primary(['client_id', 'user_id']);

            // Definir las claves foráneas
            $table->foreign('client_id')
                ->references('client_id')->on('clients')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('user_id')->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients_user');
    }
};
