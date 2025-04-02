<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'period',
        'is_highlighted',
        'badge_text',
        'badge_variant',
        'button_text',
        'button_variant',
        'payment_url',
        'is_active',
    ];

    protected $casts = [
        'price' => 'float',
        'is_highlighted' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Las características asociadas a este plan
     */
    public function features()
    {
        return $this->hasMany(PlanFeature::class, 'plan_id');
    }

    /**
     * Las suscripciones a este plan
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Formatear el plan para el frontend
     */
    public function toFrontendFormat()
    {
        return [
            'id' => $this->id,
            'title' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'period' => $this->period,
            'highlight' => $this->is_highlighted,
            'badge' => $this->badge_text ? [
                'text' => $this->badge_text,
                'variant' => $this->badge_variant ?? 'default',
            ] : null,
            'buttonText' => $this->button_text,
            'buttonVariant' => $this->button_variant,
            'paymentWidget' => $this->payment_url,
            'features' => $this->features->map(function ($feature) {
                return [
                    'included' => $feature->included,
                    'text' => $feature->text,
                    'icon' => $feature->icon,
                ];
            }),
        ];
    }
}
