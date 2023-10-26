<?php

use GuzzleHttp\Client;

require_once 'common.php';

function getSpotifyToken(string $code): string
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

function getAndDecode(string $token, string $endpoint, bool $fullUrl = null):array
{
    $client = new Client();

    $url = $fullUrl ? :'https://api.spotify.com/v1/' . $endpoint;

    $request = $client->get($url, [
        'headers' => [
            'Authorization' => 'Bearer ' . $token
        ]
    ]);
    
    return json_decode($request->getBody(), true);
}

function getUserItems(string $token): array
{

    $url = 'https://api.spotify.com/v1/me/top/tracks?limit=20';

    $client = new Client();

    $request = $client->get($url, [
        'headers' => [
            'Authorization' => 'Bearer ' . $token
        ]
    ]);
    
    $data = json_decode($request->getBody(), true);

    return $data;
}

function filterArtists(array $userItems): array
{
    if (empty($userItems)) {
        return [];
    }

    $artistsData = [];

    foreach($userItems as $item) {

        foreach($item['artists'] as $artist) {
            $artistsData[$item['id']] = [
                'name' => $artist['name'],
                'href' => $artist['href']
            ];
        }
    }

    return $artistsData;
}

function getArtistData(array $artistList, string $token):array
{
    $artists = [];

    foreach($artistList as $artist) {
        $artistInfo = getAndDecode($token, $artist['href'], true);
    }

    return $artists;
}


