<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoicesTable extends Migration
{
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            // Estos campos son opcionales, ya que la factura puede estar vinculada a un cliente o a una cita en particular
            $table->string('client_id')->nullable();
            $table->string('appointment_id')->nullable();
            $table->enum('invoice_type', ['membresia', 'cita', 'otro']);
            $table->decimal('amount', 10, 2);
            $table->enum('payment_method', ['tarjeta', 'efectivo', 'online']);
            $table->enum('status', ['pendiente', 'pagado', 'fallido']);
            $table->json('transaction_data')->nullable();
            $table->timestamps();

            // Definir relaciones foráneas
            $table->foreign('user_id')
                ->references('user_id')->on('users')
                ->onDelete('cascade');

            $table->foreign('client_id')
                ->references('client_id')->on('clients')
                ->onDelete('set null');

            $table->foreign('appointment_id')
                ->references('appointment_id')->on('appointments')
                ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('invoices');
    }
}
