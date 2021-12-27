# VxThreatMap

The marketing "threat map" of Falcon Sandbox that is based on the public feed at https://www.hybrid-analysis.com/

## Installation

1. git clone https://github.com/PayloadSecurity/VxThreatMap/ yourappname

2. cd yourappname/map

3. php composer.phar install

4. mongoimport --jsonArray  -d VxThreatMap -c config config.json

## Requirements

[Composer](https://getcomposer.org/)

PHP 5.6.0 or above

MongoDB 3.2 or above

[MongoDB PHP Driver](https://github.com/mongodb/mongo-php-driver) 1.1.0 or above

## Setup

In order to change the various default values for the colors, animation durations, initial zoom level, center position of the map and others, open yourappname/map/admin/ in a browser.

## Database Connection

See line 6 in yourappname/map/admin/index.php:

$client = new MongoDB\Client("mongodb://localhost:27017");

## Admin

You may want to protect yourappname/map/admin using something like this:

[Password Protect a Directory](https://github.com/phanan/htaccess/blob/master/README.md#password-protect-a-directory)

## Live URL

https://www.hybrid-analysis.com/map