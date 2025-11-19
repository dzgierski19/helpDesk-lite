<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ExtraApiEndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();

        Sanctum::actingAs(User::factory()->create());
    }

    public function test_triage_suggest_returns_correct_mock_response(): void
    {
        $ticket = Ticket::factory()->create();

        $this->postJson("/api/tickets/{$ticket->id}/triage-suggest")
            ->assertOk()
            ->assertExactJson([
                'suggested_status' => 'in_progress',
                'suggested_priority' => 'high',
                'suggested_tags' => ['triage', 'auto'],
            ]);
    }

    public function test_external_user_info_returns_name_and_caches_response(): void
    {
        Http::fake([
            'https://jsonplaceholder.typicode.com/users/1' => Http::response([
                'name' => 'Leanne Graham',
            ], 200),
        ]);

        $firstResponse = $this->getJson('/api/external/user-info')
            ->assertOk()
            ->assertExactJson(['name' => 'Leanne Graham']);

        Http::assertSent(fn ($request) => $request->url() === 'https://jsonplaceholder.typicode.com/users/1');
        $this->assertTrue(Cache::has('external_user_1'));

        $this->getJson('/api/external/user-info')
            ->assertOk()
            ->assertExactJson($firstResponse->json());

        Http::assertSentCount(1);
    }

    public function test_external_user_info_handles_api_failure(): void
    {
        Http::fake([
            'https://jsonplaceholder.typicode.com/users/1' => Http::response(['error' => 'server_error'], 500),
        ]);

        $this->getJson('/api/external/user-info')
            ->assertStatus(502)
            ->assertExactJson(['error' => 'external_api_failed']);
    }
}
