<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CalendarConfig extends Model
{
    use HasFactory;

    protected $table = 'calendar_config';

    protected $fillable = [
        'user_id',
        'show_weekend',
        'start_time',
        'end_time',
        'business_days'
    ];

    protected $casts = [
        'show_weekend' => 'boolean',
        'business_days' => 'array'
    ];

    protected $appends = ['slot_min_time', 'slot_max_time'];

    // Relación con el usuario
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Calcula slot_min_time como una hora antes de start_time
    public function getSlotMinTimeAttribute()
    {
        return Carbon::parse($this->start_time)
            ->subHour()
            ->format('H:i');
    }

    // Calcula slot_max_time como una hora después de end_time
    public function getSlotMaxTimeAttribute()
    {
        return Carbon::parse($this->end_time)
            ->addHour()
            ->format('H:i');
    }
}