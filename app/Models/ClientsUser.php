<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClientsUser extends Model
{
    use HasFactory;

    protected $table = "clients_user";
    protected $fillable = [
        'client_id',
        'user_id',
        'notes'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function clients()
    {
        return $this->hasMany(Client::class);
    }
}