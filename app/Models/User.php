<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use  HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'user_id',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
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
}
