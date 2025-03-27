<?php

namespace App\Services;

use Twilio\Rest\Client;

class TwilioService
{
    protected Client $client;
    protected string $from;

    public function __construct(string $accountSid, string $authToken, string $from)
    {
        // Permitir sobrescribir los valores por defecto si en un futuro cada usuario tiene sus propias credenciales.
        $accountSid = $accountSid ?: config('twilio.default.account_sid');
        $authToken = $authToken ?: config('twilio.default.auth_token');
        $this->from = $from ?: config('twilio.default.from');

        $this->client = new Client($accountSid, $authToken);
    }

    /**
     * Enviar un mensaje vía WhatsApp.
     *
     * @param string $to Número de destino con prefijo "whatsapp:" ej. "whatsapp:+1234567890"
     * @param string $body Texto del mensaje.
     * @return \Twilio\Rest\Api\V2010\Account\MessageInstance
     */
    public function sendWhatsappMessage(string $to, string $body)
    {
        return $this->client->messages->create(
            $to,
            [
                'from' => $this->from,
                'body' => $body,
            ]
        );
    }
}
