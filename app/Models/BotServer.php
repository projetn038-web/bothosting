<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BotServer extends Model
{
    protected $fillable = [
        'user_id',
        'pterodactyl_server_id',
        'name',
        'language',
        'ram_mb',
        'cost_per_hour',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
