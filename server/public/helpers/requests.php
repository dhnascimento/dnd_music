<?php

use GuzzleHttp\Client;

require_once 'common.php';

function getToken(string $code): string
{

    $url = 'https://accounts.spotify.com/api/token';
    // @TODO replace by env
    $redirectUrl = 'http://localhost:3000/';

    $cs = $_ENV['CS'];
    $ci = $_ENV['CI'];
    $credentials = $ci . ':' . $cs;

    $client = new Client();

    $request = $client->post($url, [
        'form_params' => [
            'code'         => $code,
            'grant_type'   => 'authorization_code',
            'redirect_uri' => $redirectUrl
        ],
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode($credentials)
        ]
    ]);
    
    $data = json_decode($request->getBody(), true);

    $accessToken = $data['access_token'];

    return $accessToken;
}
