<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SupportFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->subject('Soporte: ' . $this->data['subject'])
            ->view('emails.support')
            ->priority(1) // Marca como alta prioridad
            // O alternativamente puedes usar estos encabezados:
            ->withSymfonyMessage(function ($message) {
                $message->getHeaders()
                    ->addTextHeader('X-Priority', '1')
                    ->addTextHeader('X-MSMail-Priority', 'High')
                    ->addTextHeader('Importance', 'High');
            });
    }
}
