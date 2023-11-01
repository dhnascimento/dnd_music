<?php

namespace DnDGenerator;

class SpotifyHandler extends APIHandler {

    public array $userItems;
    public array $artistsItems;
    public array $tracksIds;
    public array $tracksFeatures;
    public array $tracksResponse;

    public function getUserItems(bool $output = false):?array {
    
        $userData = $this->fetchAndDecode('me/top/tracks?limit=20');
        
        $this->userItems = $userData['items'];

        if ($output) {
            return $userData['items'];
        }

        return null;

    }

    private function setTrackId(string $id):void {
        $this->tracksIds[] = $id;
    }

    public function createTracksResponse(bool $output = false):?array {

        $tracksResponse = [];

        foreach($this->userItems as $item) {

            $this->setTrackId($item['id']);
            $tracksResponse[$item['id']] = [
                'name'       => $item['name'],
                'explicit'   => $item['explicit'],
                'popularity' => $item['popularity'],
                'album'      => [
                                'images'       => $item['album']['images'],
                                'name'         => $item['album']['name'],
                                'release_date' => $item['album']['release_date']
                                ]
            ];
        
        
        
        }

        $this->tracksResponse = $tracksResponse;

        return $output ? $this->tracksResponse : null;
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

    public function fetchTracksAudioFeatures(bool $output = false):?array {

        $tracksList = implode(',', $this->tracksIds);

        $tracksFeaturesReq = $this->fetchAndDecode('audio-features?ids=' . $tracksList);

        foreach($tracksFeaturesReq as $trackFeature) {
            $this->tracksResponse[$trackFeature['id']] = [
                'danceability' => $trackFeature['danceability'],
                'energy' => $trackFeature['energy'],
                'loudness' => $trackFeature['loudness'],
                'key' => $trackFeature['key'],
                'speechiness' => $trackFeature['speechiness'],
                'acousticness' => $trackFeature['acousticness'],
                'liveness' => $trackFeature['liveness'],
                'valence' => $trackFeature['valence'],
                'tempo' => $trackFeature['tempo']
            ];
        }

        if ($output) {
            return $tracksFeaturesReq;
        }

        return null;
    }

    public function createTracksInfoArray(array|null $artistsItems = null, array|null $tracksFeatures = null) {
        if (!isset($artistsItems)) {
            $artistsItems = $this->artistsItems;
        }

        if (!isset($tracksFeatures)) {
            $tracksFeatures = $this->$tracksFeatures;
        }

        
        
        
        return;
    }

}