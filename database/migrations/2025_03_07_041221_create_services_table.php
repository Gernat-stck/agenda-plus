<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServicesTable extends Migration
{
    public function up()
    {
        Schema::create('services', function (Blueprint $table) {
            // Usamos UUID para el id
            $table->id();
            $table->string('service_id')->unique();
            $table->string('user_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('duration');
            $table->decimal('price', 10, 2);
            $table->string('category');
            $table->timestamps();

            // Relación con la tabla users (empresa)
            $table->foreign('user_id')
                ->references('user_id')->on('users')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('services');
    }
}
