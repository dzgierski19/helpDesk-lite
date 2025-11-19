<?php

namespace App\Http\Controllers;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Enums\UserRole;
use App\Models\Ticket;
use App\Models\TicketStatusChange;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Ticket::query()->with('assignee');
        $user = $request->user();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($priority = $request->query('priority')) {
            $query->where('priority', $priority);
        }

        if ($assigneeId = $request->query('assignee_id')) {
            $query->where('assignee_id', $assigneeId);
        }

        if ($tag = $request->query('tag')) {
            $query->whereJsonContains('tags', $tag);
        }

        if ($user && $user->role === UserRole::Reporter->value) {
            $query->where('creator_id', $user->id);
        }

        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'priority' => ['required', Rule::enum(TicketPriority::class)],
            'status' => ['required', Rule::enum(TicketStatus::class)],
            'assignee_id' => ['nullable', 'integer', 'exists:users,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
        ]);

        $data['creator_id'] = $request->user()->id;
        $data['tags'] = $data['tags'] ?? [];

        $ticket = Ticket::create($data)->load('assignee');

        return response()->json($ticket, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket): JsonResponse
    {
        return response()->json($ticket->load('assignee'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket): JsonResponse
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'priority' => ['sometimes', Rule::enum(TicketPriority::class)],
            'status' => ['sometimes', Rule::enum(TicketStatus::class)],
            'assignee_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'tags' => ['sometimes', 'array'],
            'tags.*' => ['string'],
        ]);

        $oldStatus = $ticket->getOriginal('status');

        $ticket->fill($data);
        $newStatus = $ticket->status instanceof TicketStatus ? $ticket->status->value : $ticket->status;
        $statusChanged = array_key_exists('status', $data) && $oldStatus !== $newStatus;

        $ticket->save();

        if ($statusChanged) {
            $statusChange = new TicketStatusChange([
                'ticket_id' => $ticket->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
            ]);
            $statusChange->changed_at = now();
            $statusChange->save();
        }

        return response()->json($ticket->load('assignee'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket): JsonResponse
    {
        $ticket->delete();

        return response()->json(null, 204);
    }

    /**
     * Return deterministic triage suggestions for a ticket.
     */
    public function triageSuggest(Request $request, Ticket $ticket): JsonResponse
    {
        return response()->json([
            'suggested_status' => TicketStatus::InProgress->value,
            'suggested_priority' => TicketPriority::High->value,
            'suggested_tags' => ['triage', 'auto'],
        ]);
    }

    /**
     * Fetch reporter name from an external API with caching.
     */
    public function externalUserInfo(): JsonResponse
    {
        try {
            $user = Cache::remember('external_user_1', now()->addMinutes(10), function () {
                $response = Http::timeout(5)->get('https://jsonplaceholder.typicode.com/users/1');

                if (! $response->successful()) {
                    throw new \RuntimeException('External API failure');
                }

                return $response->json();
            });

            if (! is_array($user) || ! isset($user['name'])) {
                throw new \RuntimeException('Invalid payload');
            }

            return response()->json(['name' => $user['name']]);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'external_api_failed'], 502);
        }
    }
}
