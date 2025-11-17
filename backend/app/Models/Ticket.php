<?php

namespace App\Models;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'priority',
        'status',
        'assignee_id',
        'creator_id',
        'tags',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, mixed>
     */
    protected $casts = [
        'priority' => TicketPriority::class,
        'status' => TicketStatus::class,
        'tags' => 'array',
    ];

    /**
     * Assigned agent/admin for the ticket.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    /**
     * Reporter who created the ticket.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Status change history for the ticket.
     */
    public function statusChanges(): HasMany
    {
        return $this->hasMany(TicketStatusChange::class);
    }
}
