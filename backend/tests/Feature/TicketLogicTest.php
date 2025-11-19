<?php

namespace Tests\Feature;

use App\Enums\TicketStatus;
use App\Enums\UserRole;
use App\Models\Ticket;
use App\Models\TicketStatusChange;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TicketLogicTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $agent;
    protected User $reporter;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();

        $this->admin = User::factory()->create(['role' => UserRole::Admin]);
        $this->agent = User::factory()->create(['role' => UserRole::Agent]);
        $this->reporter = User::factory()->create(['role' => UserRole::Reporter]);

        Sanctum::actingAs($this->admin);
    }

    public function test_it_filters_tickets_by_status(): void
    {
        $newTicketOne = Ticket::factory()->create(['status' => TicketStatus::New]);
        $newTicketTwo = Ticket::factory()->create(['status' => TicketStatus::New]);
        $inProgressTicket = Ticket::factory()->create(['status' => TicketStatus::InProgress]);

        $response = $this->withHeaders(['X-USER-ROLE' => UserRole::Admin->value])
            ->getJson('/api/tickets?status=new');

        $response->assertOk();
        $response->assertJsonCount(2);
        $response->assertJsonFragment(['id' => $newTicketOne->id]);
        $response->assertJsonFragment(['id' => $newTicketTwo->id]);
        $response->assertJsonMissing(['id' => $inProgressTicket->id]);
    }

    public function test_reporter_can_only_see_their_own_tickets(): void
    {
        $reporter1 = $this->reporter;
        $reporter2 = User::factory()->create(['role' => UserRole::Reporter]);

        $ticketForReporter1 = Ticket::factory()->create(['creator_id' => $reporter1->id]);
        $ticketForReporter2 = Ticket::factory()->create(['creator_id' => $reporter2->id]);

        $response = $this->withHeaders(['X-USER-ROLE' => UserRole::Reporter->value])
            ->getJson('/api/tickets');

        $response->assertOk();
        $response->assertJsonFragment(['id' => $ticketForReporter1->id]);
        $response->assertJsonMissing(['id' => $ticketForReporter2->id]);
    }

    public function test_it_logs_status_change_on_update(): void
    {
        $ticket = Ticket::factory()->create(['status' => TicketStatus::New]);

        $this->assertDatabaseMissing('ticket_status_changes', ['ticket_id' => $ticket->id]);

        $response = $this->withHeaders(['X-USER-ROLE' => UserRole::Admin->value])
            ->putJson("/api/tickets/{$ticket->id}", [
                'status' => TicketStatus::InProgress->value,
            ]);

        $response->assertOk();

        $this->assertSame(
            1,
            TicketStatusChange::where('ticket_id', $ticket->id)->count()
        );

        $this->assertDatabaseHas('ticket_status_changes', [
            'ticket_id' => $ticket->id,
            'old_status' => TicketStatus::New->value,
            'new_status' => TicketStatus::InProgress->value,
        ]);
    }
}
