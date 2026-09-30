<?php

namespace App\Console\Commands;

use App\Models\BotServer;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('billing:hourly')]
#[Description('Deduct hourly costs for active bot servers.')]
class DeductServerCosts extends Command
{
    public function handle(): int
    {
        $charged = 0;
        $suspended = 0;

        BotServer::query()
            ->with('user')
            ->where('status', 'active')
            ->chunkById(100, function ($servers) use (&$charged, &$suspended): void {
                foreach ($servers as $server) {
                    $result = DB::transaction(function () use ($server): ?bool {
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

                        $lockedServer->status = 'suspended';
                        $lockedServer->save();

                        return false;
                    });

                    if ($result === true) {
                        $charged++;
                    } elseif ($result === false) {
                        $suspended++;
                    }
                }
            });

        $this->info("Billing complete: {$charged} server(s) charged, {$suspended} suspended.");

        return self::SUCCESS;
    }
}
