<?php
require __DIR__ . '/../vendor/autoload.php';

$app = new \Slim\Slim();

$client = new MongoDB\Client("mongodb://localhost:27017");

$collection = $client->VxThreatMap->config;

$app->get('/', function () use ($app, $collection) {

	$cursor = $collection->find([], [
        'projection' => [
            '_id' => 0,
        ],
	]);

	$it = new \IteratorIterator($cursor);

	$it->rewind();

	$results = [];

	while($doc = $it->current()) {
		$results[] = $doc;
		$it->next();
	}

    $app->render('index.php', array('configuration' => json_encode($results)));
});

$app->run();