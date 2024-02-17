<?php

namespace DnDGenerator;

use GuzzleHttp\Client;


class OpenAIHandler extends APIHandler {
    public string $apiUrl;
    private string $token;
    private Client $client;


    public function generateCharacterSheet(string $spotifyData): string {
        
        $spotifyArray = json_decode($spotifyData);
        $request = $this->client->post($this->apiUrl, [
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->token,
            ],
            'json' => [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a Dungeon Master responsible for helping a player creating a Dungeons and Dragons 5th Edition Character Sheet for a 1st level character based on the average values of the audio features of their most listened Spotify tracks without biasing the character towards any specific class.'
                    ],
                    [
                        'role' => 'user',
                        'content' => 'What is the capital of France?'
                    ]
                ]
            ]
        ]);

        return $request->getBody()->getContents();
   }

   public function generateUserPrompt(array $spotifyData):string
   {
    return '';
   } 

}
