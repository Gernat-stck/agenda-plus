<!DOCTYPE html>
<html>

<head>
    <title>Nuevo mensaje de contacto</title>
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
    </style>
</head>

<body>
    <div class="header">
        <h1 style="margin: 0; font-size: 24px;">Nuevo mensaje de contacto</h1>
    </div>
    <div class="content">
        <div class="field">
            <div class="label">Nombre:</div>
            <div>{{ $data['name'] }}</div>
        </div>

        <div class="field">
            <div class="label">Email:</div>
            <div>{{ $data['email'] }}</div>
        </div>

        <div class="field">
            <div class="label">Mensaje:</div>
            <div class="message-box">{{ $data['message'] }}</div>
        </div>
    </div>
</body>

</html>
