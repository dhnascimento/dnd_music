<?php

namespace DnDGenerator;

class SpotifyHandler extends APIHandler {

    public array $userItems;
    public array $artistsItems;

    public function getUserItems(bool $output = false):?array {
    
        $userData = $this->fetchAndDecode('me/top/tracks?limit=20');
        
        $this->userItems = $userData['items'];

        if ($output) {
            return $userData['items'];
        }

        return null;

    }

    public function filterArtists(array $userItems = null):array {
        if (!isset($userItems)) {
            $userItems = $this->userItems;
        }
    
        $artistsData = [];
    
        foreach($userItems as $item) {
    
            foreach($item['artists'] as $artist) {
                $artistsData[$item['id']][] = [
                    'name' => $artist['name'],
                    'href' => $artist['href']
                ];
            }
        }
    
        return $artistsData;
    }

    public function fetchArtistData(array $artistList, bool $output = false):?array {
        
        $artists = [];

        foreach($artistList as $trackId => $artistInfo) {
            $info = [];
            foreach($artistInfo as $artist) {
                $apiData = $this->fetchAndDecode($artist['href'], true);
                $info[] = $apiData;
            }
    
            $artists[$trackId] = [...$info];
        }

        $this->artistsItems = $artists;

        if ($output) {
            return $artists;
        }

        return null;
    }

}