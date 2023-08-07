<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Exception\HttpNotFoundException;
use Slim\Factory\AppFactory;


require __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/helpers/requests.php';

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

$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
});

$app->post('/code', function (Request $request, Response $response, $args) {
    $parsedBody = $request->getBody()->getContents();
    $jsonBody = json_decode($parsedBody);
    $token = getToken($jsonBody->code);
    $tokenObj = json_encode(['token' => $token]);
    $response->getBody()->write($tokenObj);
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