<?php

namespace DnDGenerator;

use GuzzleHttp\Client;
require_once __DIR__ . '/../helpers/common.php';

class OpenAIHandler {

    public string $apiUrl;
    private string $token;
    private Client $client;

    function __construct() {
        $this->token = $_ENV['OA'];
        $this->apiUrl = 'https://api.openai.com/v1/chat/completions';
        $this->client = new Client();
    }

    public function generateCharacterSheet(string $spotifyData): array {
        
        $spotifyArray = json_decode($spotifyData, true);
        
        [
            'danceability_avg' => $danceability,
            'energy_avg'       => $energy,
            'loudness_avg'     => $loudness,
            'key_avg'          => $key,
            'speechiness_avg'  => $speechiness,
            'acousticness_avg' => $acousticness,
            'liveness_avg'     => $liveness,
            'valence_avg'      => $valence,
            'tempo_avg'        => $tempo,
            'duration_ms_avg'  => $duration,
            'popularity_avg'   => $popularity
        ] = $spotifyArray;

        $promptSystem = file_get_contents(__DIR__ . '/../helpers/promptSystem.txt');
        $promptUserPlaceholder = file_get_contents(__DIR__ . '/../helpers/promptUser.txt');
        $promptUser = sprintf(
            $promptUserPlaceholder,
            $danceability,
            $energy,
            $loudness,
            $key,
            $speechiness,
            $acousticness,
            $liveness,
            $valence,
            $tempo,
            $duration,
            $popularity
        );

        $request = $this->client->post($this->apiUrl, [
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->token
            ],
            'json' => [
                'model' => 'gpt-3.5-turbo',
                'response_format' => [
                    'type' => 'json_object'
                ],
                'temperature' => 1.3,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $promptSystem
                    ],
                    [
                        'role' => 'user',
                        'content' => $promptUser
                    ]
                ]
            ]
        ]);

        $response = json_decode($request->getBody()->getContents(), true);
        $characterSheet = json_decode($response['choices'][0]['message']['content'], true);

        return $characterSheet;
   }

   public function generateUserPrompt(array $spotifyData):string
   {
    return '';
   } 

}
