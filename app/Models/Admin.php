<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Admin extends Model
{
    use SoftDeletes;
    protected $table = 'admin';


    protected $fillable = [
        'user_id',
        'name',
        'email',
        'role',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
