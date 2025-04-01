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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->string('package_name');
            $table->string('id_account');
            $table->string('date_transaction');
            $table->decimal('monto', 8, 2);
            $table->string('payment_method');
            $table->string('id_enlace')->nullable()->after('id_account');
            $table->string('hash')->nullable()->after('approved');
            $table->boolean('approved')->default(false);
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
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
