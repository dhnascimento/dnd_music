<?php

namespace DnDGenerator;

class SpotifyHandler extends APIHandler {

    public array $userProfile;
    public array $userItems;
    public array $artistsItems;
    public array $tracksIds;
    public array $tracksFeatures;
    public array $tracksResponse;

    public function getUserProfile(bool $output = false):?array {

        $userProfile = $this->fetchAndDecode('me');

        $this->tracksResponse['username'] = $userProfile['display_name'];
        $this->tracksResponse['country'] = $userProfile['country'];
        $this->tracksResponse['images'] = $userProfile['images'];
        
        return $output ? $userProfile : null;

    }

    public function getUserItems(bool $output = false):?array {
    
        $userData = $this->fetchAndDecode('me/top/tracks?limit=20');
        
        $this->userItems = $userData['items'];

        return $output ? $userData['items'] : null;

    }

    private function setTrackId(string $id):void {
        $this->tracksIds[] = $id;
    }

    public function createTracksResponse(bool $output = false):?array {

        $tracksResponse = [];

        foreach($this->userItems as $item) {

            $this->setTrackId($item['id']);
            $tracksResponse['tracks'][$item['id']] = [
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

            $this->tracksResponse['tracks'][$trackId]['artists'] = [...$info];
    
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

        foreach($tracksFeaturesReq['audio_features'] as $trackFeature) {
            $this->tracksResponse['tracks'][$trackFeature['id']] += [
                'danceability' => $trackFeature['danceability'],
                'energy' => $trackFeature['energy'],
                'loudness' => $trackFeature['loudness'],
                'key' => $trackFeature['key'],
                'speechiness' => $trackFeature['speechiness'],
                'acousticness' => $trackFeature['acousticness'],
                'liveness' => $trackFeature['liveness'],
                'valence' => $trackFeature['valence'],
                'tempo' => $trackFeature['tempo'],
                'duration_ms' => $trackFeature['duration_ms']
            ];
        }

        if ($output) {
            return $tracksFeaturesReq;
        }

        return null;
    }

    public function calculateAverages():void {

        $featuresKeys = [
            'danceability',
            'energy',
            'loudness',
            'key',
            'speechiness',
            'acousticness',
            'liveness',
            'valence',
            'tempo',
            'duration_ms',
            'popularity'
        ];
        $series = [];

        foreach($featuresKeys as $key) {
            $series[$key] = [];
        }


        foreach($this->tracksResponse['tracks'] as $trackId => $trackInfo) {
            foreach($trackInfo as $key => $value) {
                if (in_array($key, $featuresKeys)) {
                    $series[$key][] = $value;
                }
            }
        }

        
        foreach($series as $key => $value) {
            $this->tracksResponse[$key . '_avg'] = round(array_sum($value) / count($value),4);
        }

    }

}