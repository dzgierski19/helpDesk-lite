<?php

namespace Database\Factories;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Ticket>
     */
    protected $model = Ticket::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $priority = fake()->randomElement(TicketPriority::cases());
        $status = fake()->randomElement(TicketStatus::cases());

        return [
            'title' => fake()->sentence(6),
            'description' => fake()->paragraph(),
            'priority' => $priority,
            'status' => $status,
            'assignee_id' => User::factory(),
            'creator_id' => User::factory(),
            'tags' => fake()->randomElements(
                ['api', 'bug', 'frontend', 'backend', 'ux', 'integrations'],
                fake()->numberBetween(1, 3)
            ),
        ];
    }
}
