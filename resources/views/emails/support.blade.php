<!DOCTYPE html>
<html>

<head>
    <title>Nuevo mensaje de soporte</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #7c3aed;
            color: white;
            padding: 15px;
            border-radius: 5px 5px 0 0;
        }

        .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }

        .field {
            margin-bottom: 20px;
        }

        .label {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .message-box {
            background: #f9f9f9;
            padding: 15px;
            border-left: 3px solid #7c3aed;
            margin-top: 10px;
        }

        .request-type {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            margin-top: 5px;
        }

        .consulta {
            background-color: #e0f2fe;
            color: #0369a1;
        }

        .reporte {
            background-color: #fee2e2;
            color: #b91c1c;
        }

        .reclamo {
            background-color: #fef3c7;
            color: #92400e;
        }

        .sugerencia {
            background-color: #dcfce7;
            color: #166534;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1 style="margin: 0; font-size: 24px;">Nuevo mensaje de soporte</h1>
    </div>
    <div class="content">
        <div class="field">
            <div class="label">Tipo de solicitud:</div>
            <div class="request-type {{ $data['requestType'] }}">
                @if($data['requestType'] == 'consulta')
                Consulta
                @elseif($data['requestType'] == 'reporte')
                Reporte de errores
                @elseif($data['requestType'] == 'reclamo')
                Reclamo
                @elseif($data['requestType'] == 'sugerencia')
                Sugerencia
                @endif
            </div>
        </div>

        <div class="field">
            <div class="label">Nombre:</div>
            <div>{{ $data['name'] }}</div>
        </div>

        <div class="field">
            <div class="label">Email:</div>
            <div>{{ $data['email'] }}</div>
        </div>

        @if(!empty($data['phone']))
        <div class="field">
            <div class="label">Teléfono:</div>
            <div>{{ $data['phone'] }}</div>
        </div>
        @endif

        <div class="field">
            <div class="label">Asunto:</div>
            <div>{{ $data['subject'] }}</div>
        </div>

        <div class="field">
            <div class="label">Mensaje:</div>
            <div class="message-box">{{ $data['message'] }}</div>
        </div>
    </div>
</body>

</html>
