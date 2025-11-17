<?php

namespace App\Models;

use App\Enums\TicketStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketStatusChange extends Model
{
    use HasFactory;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ticket_id',
        'old_status',
        'new_status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, mixed>
     */
    protected $casts = [
        'old_status' => TicketStatus::class,
        'new_status' => TicketStatus::class,
        'changed_at' => 'datetime',
    ];

    /**
     * Ticket this status change belongs to.
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}
