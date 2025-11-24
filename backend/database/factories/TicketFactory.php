<?php

namespace Database\Factories;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    private const TAG_POOL = ['api', 'bug', 'frontend', 'backend', 'ux', 'integrations'];

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
        $priorities = TicketPriority::cases();
        $statuses = TicketStatus::cases();

        $priority = $priorities[array_rand($priorities)];
        $status = $statuses[array_rand($statuses)];
        $title = 'Ticket ' . Str::title(str_replace('-', ' ', Str::random(8)));
        $description = 'Auto-generated seed ticket ' . Str::random(16);
        $tags = collect(self::TAG_POOL)
            ->shuffle()
            ->take(random_int(1, 3))
            ->values()
            ->all();

        return [
            'title' => $title,
            'description' => $description,
            'priority' => $priority,
            'status' => $status,
            'assignee_id' => User::factory(),
            'creator_id' => User::factory(),
            'tags' => $tags,
        ];
    }
}
