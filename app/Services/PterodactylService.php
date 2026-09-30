<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Throwable;
use UnexpectedValueException;

class PterodactylService
{
    public function createServer(string $name, string $language, int $ramMb): string
    {
        $runtime = match ($language) {
            'nodejs' => [
                'docker_image' => 'ghcr.io/parkervcp/yolks:nodejs_22',
                'startup' => 'npm start',
            ],
            'python' => [
                'docker_image' => 'ghcr.io/parkervcp/yolks:python_3.12',
                'startup' => 'python main.py',
            ],
            default => null,
        };

        if ($runtime === null || $ramMb < 1) {
            $this->throwApiException(
                'createServer',
                new InvalidArgumentException('Unsupported server language or memory size.')
            );
        }

        $eggId = $this->configuredPositiveInteger("eggs.{$language}");
        $userId = $this->configuredPositiveInteger('user_id');
        $locationId = $this->configuredPositiveInteger('location_id');

        $payload = [
            'name' => $name,
            'user' => $userId,
            'egg' => $eggId,
            'docker_image' => $runtime['docker_image'],
            'startup' => $runtime['startup'],
            'environment' => [],
            'limits' => [
                'memory' => $ramMb,
                'swap' => 0,
                'disk' => max($ramMb * 2, 1024),
                'io' => 500,
                'cpu' => 100,
                'threads' => null,
            ],
            'feature_limits' => [
                'databases' => 0,
                'allocations' => 1,
                'backups' => 0,
            ],
            'deploy' => [
                'locations' => [$locationId],
                'dedicated_ip' => false,
                'port_range' => [],
            ],
            'start_on_completion' => true,
        ];

        $response = $this->post('createServer', '/servers', $payload);
        $serverId = $response->json('attributes.id');

        if (! is_int($serverId) && (! is_string($serverId) || ! ctype_digit($serverId))) {
            $this->throwApiException(
                'createServer',
                new UnexpectedValueException('The API response did not include a valid server ID.')
            );
        }

        return (string) $serverId;
    }

    public function suspendServer(string $pterodactylServerId): void
    {
        $this->post('suspendServer', $this->serverActionPath($pterodactylServerId, 'suspend'));
    }

    public function unsuspendServer(string $pterodactylServerId): void
    {
        $this->post('unsuspendServer', $this->serverActionPath($pterodactylServerId, 'unsuspend'));
    }

    private function serverActionPath(string $serverId, string $action): string
    {
        if (trim($serverId) === '') {
            $this->throwApiException(
                $action.'Server',
                new InvalidArgumentException('A Pterodactyl server ID is required.')
            );
        }

        return '/servers/'.rawurlencode($serverId).'/'.$action;
    }

    private function post(string $operation, string $path, array $payload = []): Response
    {
        try {
            return $this->request()->post($path, $payload)->throw();
        } catch (Throwable $exception) {
            $this->throwApiException($operation, $exception);
        }
    }

    private function request(): PendingRequest
    {
        $url = rtrim((string) config('services.pterodactyl.url'), '/');
        $apiKey = (string) config('services.pterodactyl.api_key');

        if ($url === '' || filter_var($url, FILTER_VALIDATE_URL) === false || $apiKey === '') {
            throw new InvalidArgumentException('Pterodactyl URL and API key must be configured.');
        }

        return Http::baseUrl($url.'/api/application')
            ->withToken($apiKey)
            ->acceptJson()
            ->asJson()
            ->connectTimeout(5)
            ->timeout(15);
    }

    private function configuredPositiveInteger(string $key): int
    {
        $value = config("services.pterodactyl.{$key}");
        $integer = filter_var($value, FILTER_VALIDATE_INT);

        if ($integer === false || $integer < 1) {
            $this->throwApiException(
                'createServer',
                new InvalidArgumentException("Pterodactyl configuration value [{$key}] must be a positive integer.")
            );
        }

        return $integer;
    }

    private function throwApiException(string $operation, Throwable $exception): never
    {
        Log::error('Pterodactyl API request failed.', [
            'operation' => $operation,
            'exception' => $exception::class,
            'message' => $exception->getMessage(),
        ]);

        throw new PterodactylApiException(
            'The Pterodactyl API request failed.',
            previous: $exception,
        );
    }
}
