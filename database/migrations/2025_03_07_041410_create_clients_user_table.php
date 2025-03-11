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
            $table->id();
            $table->string('client_id');
            $table->string('user_id');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Definir las claves foráneas
            $table->foreign('client_id')
                ->references('client_id')->on('clients')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('user_id')->on('users')
                ->onDelete('cascade');

            //INDICES
            $table->index('user_id');
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
