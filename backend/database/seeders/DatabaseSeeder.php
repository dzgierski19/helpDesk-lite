<?php

namespace Database\Seeders;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Enums\UserRole;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Alice Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => UserRole::Admin,
        ]);

        $agent = User::factory()->create([
            'name' => 'Andy Agent',
            'email' => 'agent@example.com',
            'password' => 'password',
            'role' => UserRole::Agent,
        ]);

        $reporter = User::factory()->create([
            'name' => 'Rita Reporter',
            'email' => 'reporter@example.com',
            'password' => 'password',
            'role' => UserRole::Reporter,
        ]);

        $tagPool = ['api', 'bug', 'frontend', 'backend', 'ux', 'integrations'];

        Ticket::factory()
            ->count(5)
            ->state(function () use ($reporter, $admin, $agent, $tagPool) {
                $assignee = fake()->optional()->randomElement([$admin->id, $agent->id]);

                return [
                    'title' => fake()->sentence(6),
                    'description' => fake()->paragraph(),
                    'creator_id' => $reporter->id,
                    'assignee_id' => $assignee,
                    'status' => fake()->randomElement(TicketStatus::cases()),
                    'priority' => fake()->randomElement(TicketPriority::cases()),
                    'tags' => array_values(
                        fake()->randomElements(
                            $tagPool,
                            fake()->numberBetween(1, min(3, count($tagPool)))
                        )
                    ),
                ];
            })
            ->create();
    }
}
