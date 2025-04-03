<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanFeature extends Model
{
    use HasFactory;
    protected $table = 'plan_feature';
    protected $fillable = [
        'plan_id',
        'text',
        'included',
        'icon',
    ];

    protected $casts = [
        'included' => 'boolean',
    ];

    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }
}
