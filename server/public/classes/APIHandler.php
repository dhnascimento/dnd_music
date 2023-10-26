<?php

namespace DnDGenerator;

use GuzzleHttp\Client;

class APIHandler {
    public string $apiUrl;
    private string $token;
    private Client $client;

    function __construct(string $token, string $apiUrl) {
        $this->token = $token;
        $this->apiUrl = $apiUrl;
        $this->client = new Client();
    }

    public function fetchAndDecode(string $endpoint, bool $overrideApiUrl = false):array {

        $url = $overrideApiUrl ? $endpoint : $this->apiUrl . $endpoint;

        //@TODO try/catch to handle errors
        
        $request = $this->client->get($url, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->token
            ]
        ]);
        
        return json_decode($request->getBody(), true);
    }


}