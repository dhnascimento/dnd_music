<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Exception\HttpNotFoundException;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/helpers/requests.php';

use DnDGenerator\SpotifyHandler;

$app = AppFactory::create();

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
            ->withHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
            ->withHeader('Access-Control-Allow-Headers','Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

$app->get('/user', function (Request $request, Response $response, $args) {
    
    if (isset($_SESSION['token'])) {
        // Use the token from the session for authentication
        $token = $_SESSION['token'];
        $data = getUserItems($token);
    } else {
        // Handle the case when the token is not in the session
        $data = json_encode(['error' => 'Token not found']);
    }

    $response->getBody()->write($data);
    return $response->withHeader('Content-Type', 'application/json');
});

//route to debug on postman
$app->post('/token', function (Request $request, Response $response, $args) {
    $parsedBody = $request->getBody()->getContents();
    $jsonBody = json_decode($parsedBody);
    $token = getSpotifyToken($jsonBody->code);
    $response->getBody()->write($token);
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/code', function (Request $request, Response $response, $args) {
    $parsedBody = $request->getBody()->getContents();
    $jsonBody = json_decode($parsedBody);
    if (isset($jsonBody->token)) {
        $token = $jsonBody->token;
    } else {
        $token = getSpotifyToken($jsonBody->code);
    }
    $spotifyData = new SpotifyHandler($token, 'https://api.spotify.com/v1/');
    $spotifyData->getUserItems();
    $spotifyData->createTracksResponse();
    $spotifyData->getUserProfile();
    $artistsFromTracks = $spotifyData->filterArtists();
    $spotifyData->fetchArtistData($artistsFromTracks);
    $spotifyData->fetchTracksAudioFeatures();
    $spotifyData->calculateAverages();
    $tracksResponse = json_encode($spotifyData->tracksResponse);
    $response->getBody()->write($tracksResponse);
    return $response->withHeader('Content-Type', 'application/json');
});

/**
 * Catch-all route to serve a 404 Not Found page if none of the routes match
 * NOTE: make sure this route is defined last
 */
$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    throw new HttpNotFoundException($request);
});

$app->run();