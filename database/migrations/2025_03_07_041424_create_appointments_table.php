<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppointmentsTable extends Migration
{
    public function up()
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('appointment_id')->unique();
            $table->string('user_id');
            $table->string('client_id');
            // Relación opcional con un servicio, ya que puede ser opcional
            $table->string('service_id')->nullable();
            $table->string('title');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            // Usamos enum para controlar los valores predefinidos de payment_type y status
            $table->enum('payment_type', ['tarjeta', 'efectivo']);
            $table->enum('status', ['pendiente', 'en curso', 'finalizado', 'cancelado']);
            $table->timestamps();

            // Definir claves foráneas
            $table->foreign('user_id')
                ->references('user_id')->on('users')
                ->onDelete('cascade');

            $table->foreign('client_id')
                ->references('client_id')->on('clients')
                ->onDelete('cascade');

            $table->foreign('service_id')
                ->references('service_id')->on('services')
                ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('appointments');
    }
}
