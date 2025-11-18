<?php

namespace Database\Factories;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Models\TicketStatusChange;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TicketStatusChange>
 */
class TicketStatusChangeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<TicketStatusChange>
     */
    protected $model = TicketStatusChange::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticket_id' => Ticket::factory(),
            'old_status' => fake()->randomElement(TicketStatus::cases()),
            'new_status' => fake()->randomElement(TicketStatus::cases()),
            'changed_at' => now(),
        ];
    }
}
