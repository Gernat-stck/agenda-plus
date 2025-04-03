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
        Schema::create('plan_feature', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('plan_id');
            $table->string('text')->nullable();
            $table->boolean('included')->default(true);
            $table->string('icon')->nullable();
            $table->timestamps();

            $table->foreign('plan_id')
                ->references('id')
                ->on('subscription_plans')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_feature');
    }
};
