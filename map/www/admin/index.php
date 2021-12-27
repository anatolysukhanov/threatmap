<?php
require __DIR__ . '/../../vendor/autoload.php';

$app = new \Slim\Slim();

$client = new MongoDB\Client("mongodb://localhost:27017");

$collection = $client->VxThreatMap->config;

$getConfigCallback = function () use ($app, $collection) {

	$cursor = $collection->find([], [
        'projection' => [
            '_id' => 0,
        ],
	]);

	$it = new \IteratorIterator($cursor);

	$it->rewind();
	
	$results = [];

	while($doc = $it->current()) {
		$results[$doc->name] = $doc->value;
		$it->next();
	}

	$app->render('config.php', array('data' => $results));
};

$app->get('/api/config', function () use ($app, $collection) {

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

	$app->response->headers->set('Content-Type', 'application/json');

    $app->response->write(json_encode($results));
});

$app->get('/config', $getConfigCallback);
$app->get('/', $getConfigCallback);

$app->post('/config', function () use ($app, $collection) {

	$data = $app->request->post();

	foreach ($data as $key => $value) {
		$collection->updateOne([ 'name' => $key ], [ '$set' => [ 'value' => $value ]], ['upsert' => true]);
	}

	$app->response->redirect('config');
});

$app->run();