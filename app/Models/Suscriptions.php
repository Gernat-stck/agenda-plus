<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suscriptions extends Model
{
    protected $table = 'suscriptions';
    protected $fillable = [
        'name',
        'description',
        'price',
        'status',
        'duration',
        'created_at',
        'updated_at',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
