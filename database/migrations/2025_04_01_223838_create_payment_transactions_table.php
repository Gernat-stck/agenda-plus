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
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->foreignId('subscription_id')->nullable()->constrained()->onDelete('set null');
            $table->string('transaction_id')->unique();
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('USD');
            $table->string('payment_method');
            $table->string('status');
            $table->json('provider_response')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
