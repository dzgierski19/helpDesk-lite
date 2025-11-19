<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_and_get_token(): void
    {
        $password = 'super-secret-password';

        $user = User::factory()->create([
            'password' => $password,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure(['token']);
    }

    public function test_user_can_access_protected_route_with_valid_token(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/user');

        $response
            ->assertOk()
            ->assertJsonFragment(['email' => $user->email]);
    }

    public function test_user_cannot_access_protected_route_with_invalid_token(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid-token',
        ])->getJson('/api/user');

        $response->assertUnauthorized();
    }

    public function test_full_authentication_flow_and_protected_resource_access(): void
    {
        $password = 'complex-password';

        $user = User::factory()->create([
            'password' => $password,
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $loginResponse
            ->assertOk()
            ->assertJsonStructure(['token']);

        $token = $loginResponse->json('token');

        $ticketsResponse = $this->withHeaders([
            'Authorization' => 'Bearer '.$token,
        ])->getJson('/api/tickets');

        $ticketsResponse->assertOk();
    }
}
