<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    use HasFactory;
    protected $table = 'invoices';
    protected $fillable = [
        'user_id',
        'client_id',
        'appointment_id',
        'invoice_type',
        'amount',
        'payment_method',
        'status',
        'transaction_data'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function client()
    {
        return $this->belongsTo(Client::class);

    }
    public function appointments()
    {
        return $this->belongsTo(Appointments::class);
    }

}