<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SafeAddMaxAppointmentsToCalendarConfig extends Migration
{
    public function up()
    {
        Schema::table('calendar_config', function (Blueprint $table) {
            if (!Schema::hasColumn('calendar_config', 'max_appointments')) {
                $table->integer('max_appointments')->default(1);
            }
        });
    }

    public function down()
    {
        Schema::table('calendar_config', function (Blueprint $table) {
            if (Schema::hasColumn('calendar_config', 'max_appointments')) {
                $table->dropColumn('max_appointments');
            }
        });
    }
}