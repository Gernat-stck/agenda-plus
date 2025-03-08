<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Appointments extends Model
{
    use HasFactory;

    protected $table = 'appointments';
    protected $fillable = [
        'appointment_id',
        'user_id',
        'client_id',
        'service_id',
        'title',
        'start_time',
        'end_time',
        'payment_type',
        'status'
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'client_id');
    }
    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id', 'service_id');
    }
}