<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_plan_id',
        'valid_until',
        'status',
    ];

    protected $casts = [
        'valid_until' => 'datetime',
    ];

    /**
     * El usuario al que pertenece esta suscripción
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * El plan de suscripción
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    /**
     * Las transacciones asociadas a esta suscripción
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    /**
     * Verifica si la suscripción está activa
     */
    public function isActive(): bool
    {
        return $this->status === 'active' &&
            ($this->valid_until === null || $this->valid_until->isFuture());
    }

    /**
     * Verifica si la suscripción está expirada
     */
    public function isExpired(): bool
    {
        return $this->valid_until !== null && $this->valid_until->isPast();
    }
}
