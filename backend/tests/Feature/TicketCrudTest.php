<?php

namespace Tests\Feature;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Enums\UserRole;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TicketCrudTest extends TestCase
{
    use RefreshDatabase;

    protected User $reporter;

    protected User $agent;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();

        $this->reporter = User::factory()->create([
            'role' => UserRole::Reporter,
        ]);

        $this->agent = User::factory()->create([
            'role' => UserRole::Agent,
        ]);

        $this->admin = User::factory()->create([
            'role' => UserRole::Admin,
        ]);

        Sanctum::actingAs($this->admin);
    }

    public function test_it_can_create_a_ticket(): void
    {
        Sanctum::actingAs($this->reporter);

        $payload = [
            'title' => 'Login fails for SSO users',
            'description' => 'SSO integration is failing for multiple tenants.',
            'priority' => TicketPriority::High->value,
            'status' => TicketStatus::New->value,
            'assignee_id' => $this->agent->id,
            'tags' => ['api', 'authentication'],
        ];

        $response = $this->postJson('/api/tickets', $payload);

        $response
            ->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'title',
                'description',
                'priority',
                'status',
                'assignee_id',
                'creator_id',
                'tags',
                'created_at',
                'updated_at',
            ])
            ->assertJson([
                'title' => $payload['title'],
                'description' => $payload['description'],
                'priority' => $payload['priority'],
                'status' => $payload['status'],
                'assignee_id' => $payload['assignee_id'],
                'tags' => $payload['tags'],
            ]);

        $this->assertDatabaseHas('tickets', [
            'title' => $payload['title'],
            'description' => $payload['description'],
            'priority' => $payload['priority'],
            'status' => $payload['status'],
            'assignee_id' => $this->agent->id,
            'tags' => json_encode($payload['tags']),
        ]);
    }

    public function test_it_can_show_a_ticket(): void
    {
        $ticket = Ticket::factory()
            ->for($this->reporter, 'creator')
            ->for($this->agent, 'assignee')
            ->create([
                'title' => 'Existing ticket title',
            ]);

        $response = $this->getJson("/api/tickets/{$ticket->id}");

        $response
            ->assertOk()
            ->assertJson([
                'id' => $ticket->id,
                'title' => 'Existing ticket title',
                'description' => $ticket->description,
            ]);
        $response->assertJsonFragment([
            'assignee_id' => $this->agent->id,
        ]);
    }

    public function test_it_can_update_a_ticket(): void
    {
        $ticket = Ticket::factory()
            ->for($this->reporter, 'creator')
            ->for($this->agent, 'assignee')
            ->create();

        $payload = [
            'title' => 'Updated ticket title',
            'status' => TicketStatus::InProgress->value,
        ];

        Sanctum::actingAs($this->agent);

        $response = $this->putJson("/api/tickets/{$ticket->id}", $payload);

        $response
            ->assertOk()
            ->assertJson([
                'id' => $ticket->id,
                'title' => $payload['title'],
                'status' => $payload['status'],
            ]);

        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'title' => $payload['title'],
            'status' => $payload['status'],
        ]);
    }

    public function test_it_can_delete_a_ticket(): void
    {
        $ticket = Ticket::factory()
            ->for($this->reporter, 'creator')
            ->for($this->agent, 'assignee')
            ->create();

        Sanctum::actingAs($this->reporter);

        $this->deleteJson("/api/tickets/{$ticket->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('tickets', [
            'id' => $ticket->id,
        ]);
    }
}
