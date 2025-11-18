<?php

namespace Tests\Unit;

use App\Enums\TicketStatus;
use App\Enums\UserRole;
use App\Models\Ticket;
use App\Models\TicketStatusChange;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelRelationshipsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_many_created_tickets(): void
    {
        $reporter = User::factory()->create(['role' => UserRole::Reporter]);

        $tickets = Ticket::factory()->count(3)->create([
            'creator_id' => $reporter->id,
        ]);

        $reporter->load('ticketsCreated');

        $this->assertCount($tickets->count(), $reporter->ticketsCreated);
        $this->assertContainsOnlyInstancesOf(Ticket::class, $reporter->ticketsCreated);
        $reporter->ticketsCreated->each(fn (Ticket $ticket) => $this->assertTrue($ticket->creator->is($reporter)));
    }

    public function test_user_has_many_assigned_tickets(): void
    {
        $agent = User::factory()->create(['role' => UserRole::Agent]);

        $tickets = Ticket::factory()->count(4)->create([
            'assignee_id' => $agent->id,
        ]);

        $agent->load('ticketsAssigned');

        $this->assertCount($tickets->count(), $agent->ticketsAssigned);
        $this->assertContainsOnlyInstancesOf(Ticket::class, $agent->ticketsAssigned);
        $agent->ticketsAssigned->each(fn (Ticket $ticket) => $this->assertTrue($ticket->assignee->is($agent)));
    }

    public function test_ticket_belongs_to_creator(): void
    {
        $creator = User::factory()->create(['role' => UserRole::Reporter]);
        $ticket = Ticket::factory()->create(['creator_id' => $creator->id]);

        $this->assertInstanceOf(User::class, $ticket->creator);
        $this->assertTrue($ticket->creator->is($creator));
    }

    public function test_ticket_belongs_to_assignee(): void
    {
        $assignee = User::factory()->create(['role' => UserRole::Agent]);
        $ticket = Ticket::factory()->create(['assignee_id' => $assignee->id]);

        $this->assertInstanceOf(User::class, $ticket->assignee);
        $this->assertTrue($ticket->assignee->is($assignee));
    }

    public function test_ticket_has_many_status_changes(): void
    {
        $ticket = Ticket::factory()->create();

        TicketStatusChange::factory()->for($ticket, 'ticket')->create([
            'old_status' => TicketStatus::New,
            'new_status' => TicketStatus::InProgress,
        ]);

        TicketStatusChange::factory()->for($ticket, 'ticket')->create([
            'old_status' => TicketStatus::InProgress,
            'new_status' => TicketStatus::Resolved,
        ]);

        TicketStatusChange::factory()->for($ticket, 'ticket')->create([
            'old_status' => TicketStatus::Resolved,
            'new_status' => TicketStatus::InProgress,
        ]);

        $ticket->load('statusChanges');

        $this->assertCount(3, $ticket->statusChanges);
        $this->assertContainsOnlyInstancesOf(TicketStatusChange::class, $ticket->statusChanges);
        $this->assertTrue($ticket->statusChanges->every(fn (TicketStatusChange $change) => $change->ticket_id === $ticket->id));
    }

    public function test_ticket_status_change_belongs_to_ticket(): void
    {
        $ticket = Ticket::factory()->create();
        $statusChange = TicketStatusChange::query()->create([
            'ticket_id' => $ticket->id,
            'old_status' => TicketStatus::New,
            'new_status' => TicketStatus::InProgress,
        ]);

        $this->assertInstanceOf(Ticket::class, $statusChange->ticket);
        $this->assertTrue($statusChange->ticket->is($ticket));
    }
}
