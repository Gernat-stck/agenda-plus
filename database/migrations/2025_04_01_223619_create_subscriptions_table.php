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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->string('plan_id')->after('user_id');
            $table->string('subscription_plan_id')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->boolean('approved')->default(false);
            $table->timestamp('valid_until')->nullable();
            $table->string('payment_method')->default('online');
            $table->timestamp('last_payment_date')->nullable();
            $table->string('status')->default('inactive'); // active, cancelled, expired
            $table->timestamps();

            // Agregar la clave foránea
            $table->foreign('plan_id')
                ->references('slug')
                ->on('subscription_plans')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
