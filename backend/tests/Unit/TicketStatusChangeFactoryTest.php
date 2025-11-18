<?php

namespace Tests\Unit;

use App\Enums\TicketStatus;
use App\Models\TicketStatusChange;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketStatusChangeFactoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_factory_sets_default_relations_and_fields(): void
    {
        $statusChange = TicketStatusChange::factory()->create();

        $this->assertNotNull($statusChange->ticket);
        $this->assertInstanceOf(TicketStatusChange::class, $statusChange);
        $this->assertNotNull($statusChange->changed_at);

        $this->assertInstanceOf(TicketStatus::class, $statusChange->old_status);
        $this->assertInstanceOf(TicketStatus::class, $statusChange->new_status);

        $allowedStatuses = array_map(fn (TicketStatus $status) => $status->value, TicketStatus::cases());
        $this->assertContains($statusChange->old_status->value, $allowedStatuses);
        $this->assertContains($statusChange->new_status->value, $allowedStatuses);
    }

    public function test_ticket_status_change_has_timestamps_disabled(): void
    {
        $this->assertFalse((new TicketStatusChange())->timestamps);
    }
}
