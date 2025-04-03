<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'user_id',
        'email',
        'password',
        'membership_status',
        'membership_expires_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'membership_expires_at' => 'datetime',
    ];

    public function clients()
    {
        return $this->belongsToMany(Client::class, 'clients_user', 'user_id', 'client_id');
    }

    /**
     * Verifica si el usuario tiene una membresía activa
     *
     * @return bool
     */
    public function hasActiveMembership(): bool
    {
        // Verifica si el usuario tiene un estado de membresía 'activo'
        if ($this->membership_status === 'activo') {
            return true;
        }

        // Si tienes un campo de fecha para la membresía, puedes verificar si sigue vigente
        if (isset($this->membership_expires_at) && $this->membership_expires_at > now()) {
            return true;
        }

        // Si tienes una relación con un modelo Membership, puedes verificar si tiene una membresía activa
        // if ($this->membership && $this->membership->is_active) {
        //     return true;
        // }

        return false;
    }
    /**
     * Las suscripciones del usuario
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Las transacciones del usuario
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    /**
     * Obtiene la suscripción activa del usuario
     */
    public function activeSubscription()
    {
        return $this->subscriptions()
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('valid_until')
                    ->orWhere('valid_until', '>', now());
            })
            ->latest()
            ->first();
    }

    /**
     * Verifica si el usuario tiene una suscripción activa
     */
    public function hasActiveSubscription(): bool
    {
        return $this->activeSubscription() !== null;
    }
}
