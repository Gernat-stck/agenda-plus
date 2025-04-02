<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_id',
        'transaction_id',
        'amount',
        'currency',
        'payment_method',
        'status',
        'provider_response',
    ];

    protected $casts = [
        'provider_response' => 'array',
        'amount' => 'float',
    ];

    /**
     * El usuario que realizó el pago
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * La suscripción relacionada con este pago
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }
}
