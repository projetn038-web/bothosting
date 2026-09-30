<?php

namespace App\Console\Commands;

use App\Models\BotServer;
use App\Models\User;
use App\Services\PterodactylApiException;
use App\Services\PterodactylService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('billing:hourly')]
#[Description('Deduct hourly costs for active bot servers.')]
class DeductServerCosts extends Command
{
    public function handle(PterodactylService $pterodactylService): int
    {
        $charged = 0;
        $suspended = 0;
        $failures = 0;

        BotServer::query()
            ->with('user')
            ->where('status', 'active')
            ->chunkById(100, function ($servers) use ($pterodactylService, &$charged, &$suspended, &$failures): void {
                foreach ($servers as $server) {
                    try {
                        $result = DB::transaction(function () use ($server, $pterodactylService): ?bool {
                            $lockedServer = BotServer::query()
                                ->whereKey($server->getKey())
                                ->lockForUpdate()
                                ->first();

                            if ($lockedServer === null || $lockedServer->status !== 'active') {
                                return null;
                            }

                            $userId = $server->user?->getKey();

                            if ($userId === null) {
                                return null;
                            }

                            $user = User::query()
                                ->whereKey($userId)
                                ->lockForUpdate()
                                ->first();

                            if ($user === null) {
                                return null;
                            }

                            if ($user->coins >= $lockedServer->cost_per_hour) {
                                $user->decrement('coins', $lockedServer->cost_per_hour);

                                return true;
                            }

                            if ($lockedServer->pterodactyl_server_id !== null) {
                                $pterodactylService->suspendServer($lockedServer->pterodactyl_server_id);
                            }

                            $lockedServer->status = 'suspended';
                            $lockedServer->save();

                            return false;
                        });
                    } catch (PterodactylApiException) {
                        $failures++;
                        $this->error("Could not suspend Pterodactyl server {$server->pterodactyl_server_id}; billing will retry next hour.");

                        continue;
                    }

                    if ($result === true) {
                        $charged++;
                    } elseif ($result === false) {
                        $suspended++;
                    }
                }
            });

        $this->info("Billing complete: {$charged} server(s) charged, {$suspended} suspended, {$failures} suspension failure(s).");

        return $failures === 0 ? self::SUCCESS : self::FAILURE;
    }
}
