<?php
use GuzzleHttp\Client;
use Dotenv;
require('common.php');

function getToken(string $code):string {

    $url = 'https://accounts.spotify.com/api/token';
    // @TODO replace by env
    $redirectUrl = 'http://localhost:3000/';

    $cs = $_ENV['CS'];
    $ci = $_ENV['CD'];
    $credentials = $ci . ':' . $cs;

    $client = new Client();

    $response = $client->post($url, [
        'form_params' => [
            'code'         => $code,
            'grant_type'   => 'authorization_code',
            'redirect_uri' => $redirectUrl
        ],
        'headers' => [
            'Authorization'=> 'Basic ' . base64_encode($credentials)
        ]
    ]);


    return 'token';

}