<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $table = "clients";
    protected $fillable = [
        "client_id",
        "name",
        "contact_number",
        "email"
    ];

    public function appointments()
    {
        return $this->hasMany(Appointments::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'clients_user', 'client_id', 'user_id');
    }


}
