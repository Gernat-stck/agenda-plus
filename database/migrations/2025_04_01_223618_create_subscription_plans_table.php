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
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 8, 2);
            $table->string('period'); // 'monthly', 'yearly', etc.
            $table->boolean('is_highlighted')->default(false);
            $table->string('badge_text')->nullable();
            $table->string('badge_variant')->nullable(); // 'primary', 'secondary', etc.
            $table->string('button_text')->default('Suscribirse');
            $table->string('button_variant')->default('default');
            $table->string('payment_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
