<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Threat Map - Configuration</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
</head>
<body>
<div class="container" style="padding-top: 10px">
	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">Configuration</h3>
		</div>
		<div class="panel-body">
			<form method="post" action="config">
				<?php
					$json = file_get_contents('php://input');
					print_r($json);
				?>
				<div class="form-group">
					<label for="malicious-threat-color">Malicious Threat Color</label>
					<input type="text" class="form-control" id="malicious-threat-color" name="malicious-threat-color" aria-describedby="malicious-threat-color-help" value="<?=$data['malicious-threat-color'];?>">
					<span id="malicious-threat-color-help" class="help-block">a valid color name - like "red" or an RGB value - like "rgb(255, 0, 0)" or a HEX value - like "#ff0000"</span>
				</div>
				<div class="form-group">
					<label for="malicious-behavior-indicator-color">Malicious Behavior Indicator Color</label>
					<input type="text" class="form-control" id="malicious-behavior-indicator-color" name="malicious-behavior-indicator-color" aria-describedby="malicious-behavior-indicator-color-help" value="<?=$data['malicious-behavior-indicator-color'];?>">
					<span id="malicious-behavior-indicator-color-help" class="help-block">a valid color name - like "red" or an RGB value - like "rgb(255, 0, 0)" or a HEX value - like "#ff0000"</span>
				</div>
				<div class="form-group">
					<label for="suspicious-threat-color">Suspicious Threat Color</label>
					<input type="text" class="form-control" id="suspicious-threat-color" name="suspicious-threat-color" aria-describedby="suspicious-threat-color-help" value="<?=$data['suspicious-threat-color'];?>">
					<span id="suspicious-threat-color-help" class="help-block">a valid color name - like "red" or an RGB value - like "rgb(255, 0, 0)" or a HEX value - like "#ff0000"</span>
				</div>
				<div class="form-group">
					<label for="nothreat-color">No Threat Color</label>
					<input type="text" class="form-control" id="nothreat-color" name="nothreat-color" aria-describedby="nothreat-color-help" value="<?=$data['nothreat-color'];?>">
					<span id="nothreat-color-help" class="help-block">a valid color name - like "red" or an RGB value - like "rgb(255, 0, 0)" or a HEX value - like "#ff0000"</span>
				</div>
				<div class="form-group">
					<label for="table-color">Table Color</label>
					<input type="text" class="form-control" id="table-color" name="table-color" aria-describedby="table-color-help" value="<?=$data['table-color'];?>">
					<span id="table-color-help" class="help-block">a valid color name - like "red" or an RGB value - like "rgb(255, 0, 0)" or a HEX value - like "#ff0000"</span>
				</div>
				<div class="form-group">
					<label for="header-color">Header Color</label>
					<input type="text" class="form-control" id="header-color" name="header-color" aria-describedby="header-color-help" value="<?=$data['header-color'];?>">
					<span id="header-color-help" class="help-block">a valid color name - like "red" or an RGB value - like "rgb(255, 0, 0)" or a HEX value - like "#ff0000"</span>
				</div>
				<div class="form-group">
					<label for="text-color">Text Color</label>
					<input type="text" class="form-control" id="text-color" name="text-color" aria-describedby="text-color-help" value="<?=$data['text-color'];?>">
					<span id="text-color-help" class="help-block">a valid color name - like "red" or an RGB value - like "rgb(255, 0, 0)" or a HEX value - like "#ff0000"</span>
				</div>
				<div class="form-group">
					<label for="behavior-indicators-update-interval">Behavior Indicators Update Interval</label>
					<input type="text" class="form-control" id="behavior-indicators-update-interval" name="behavior-indicators-update-interval" aria-describedby="behavior-indicators-update-interval-help" value="<?=$data['behavior-indicators-update-interval'];?>">
					<span id="behavior-indicators-update-interval-help" class="help-block">in milliseconds</span>
				</div>
				<div class="form-group">
					<label for="network-indicators-update-interval">Network Indicators Update Interval</label>
					<input type="text" class="form-control" id="network-indicators-update-interval" name="network-indicators-update-interval" aria-describedby="network-indicators-update-interval-help" value="<?=$data['network-indicators-update-interval'];?>">
					<span id="network-indicators-update-interval-help" class="help-block">in milliseconds</span>
				</div>
				<div class="form-group">
					<label for="first-detonation-duration">First Detonation Duration</label>
					<input type="text" class="form-control" id="first-detonation-duration" name="first-detonation-duration" aria-describedby="first-detonation-duration-help" value="<?=$data['first-detonation-duration'];?>">
					<span id="first-detonation-duration-help" class="help-block">in seconds</span>
				</div>
				<div class="form-group">
					<label for="second-detonation-duration">Second Detonation Duration</label>
					<input type="text" class="form-control" id="second-detonation-duration" name="second-detonation-duration" aria-describedby="second-detonation-duration-help" value="<?=$data['second-detonation-duration'];?>">
					<span id="second-detonation-duration-help" class="help-block">in seconds</span>
				</div>
				<div class="form-group">
					<label for="detonation-ring-delay">Detonation Ring Delay</label>
					<input type="text" class="form-control" id="detonation-ring-delay" name="detonation-ring-delay" aria-describedby="detonation-ring-delay-help" value="<?=$data['detonation-ring-delay'];?>">
					<span id="detonation-ring-delay-help" class="help-block">in milliseconds</span>
				</div>
				<div class="form-group">
					<label for="detonation-delay">Detonation Delay</label>
					<input type="text" class="form-control" id="detonation-delay" name="detonation-delay" aria-describedby="detonation-delay-help" value="<?=$data['detonation-delay'];?>">
					<span id="detonation-delay-help" class="help-block">in milliseconds</span>
				</div>
				<div class="form-group">
					<label for="detonation-mark-duration">Detonation Mark Duration</label>
					<input type="text" class="form-control" id="detonation-mark-duration" name="detonation-mark-duration" aria-describedby="detonation-mark-duration-help" value="<?=$data['detonation-mark-duration'];?>">
					<span id="detonation-mark-duration-help" class="help-block">in seconds</span>
				</div>
				<div class="form-group">
					<label for="detonation-radius">Detonation Radius</label>
					<input type="text" class="form-control" id="detonation-radius" name="detonation-radius" aria-describedby="detonation-radius-help" value="<?=$data['detonation-radius'];?>">
					<span id="detonation-radius-help" class="help-block">in meters</span>
				</div>
				<div class="form-group">
					<label for="detonation-mark-radius">Detonation Mark Radius</label>
					<input type="text" class="form-control" id="detonation-mark-radius" name="detonation-mark-radius" aria-describedby="detonation-mark-radius-help" value="<?=$data['detonation-mark-radius'];?>">
					<span id="detonation-mark-radius-help" class="help-block">in meters</span>
				</div>
				<div class="form-group">
					<label for="logo-position">Logo Position</label>
					<select class="form-control" id="logo-position" name="logo-position" aria-describedby="logo-position-help">
					<?php
						$options = ['topleft', 'topright', 'bottomleft', 'bottomright'];
						foreach ($options as $option) {
							if ($option == $data['logo-position']) {
								echo "<option value=\"{$option}\" selected>{$option}</option>";
							} else {
								echo "<option value=\"{$option}\">{$option}</option>";
							}
						}
					?>
					</select>
				</div>
				<div class="form-group">
					<label for="logo-width">Logo Width</label>
					<input type="text" class="form-control" id="logo-width" name="logo-width" aria-describedby="logo-width-help" value="<?=$data['logo-width'];?>">
					<span id="logo-width-help" class="help-block">in pixels</span>
				</div>
				<div class="form-group">
					<label for="initial-map-zoom">Initial Map Zoom Level</label>
					<input type="text" class="form-control" id="initial-map-zoom" name="initial-map-zoom" aria-describedby="initial-map-zoom-help" value="<?=$data['initial-map-zoom'];?>">
					<span id="initial-map-zoom-help" class="help-block">from 3 to 19</span>
				</div>
				<div class="form-group">
					<label for="initial-map-center-latitude">Initial Map Center Latitude</label>
					<input type="text" class="form-control" id="initial-map-center-latitude" name="initial-map-center-latitude" aria-describedby="initial-map-center-latitude-help" value="<?=$data['initial-map-center-latitude'];?>">
					<span id="initial-map-center-latitude-help" class="help-block">from -90 to 90</span>
				</div>
				<div class="form-group">
					<label for="initial-map-center-longitude">Initial Map Center Longitude</label>
					<input type="text" class="form-control" id="initial-map-center-longitude" name="initial-map-center-longitude" aria-describedby="initial-map-center-longitude-help" value="<?=$data['initial-map-center-longitude'];?>">
					<span id="initial-map-center-longitude-help" class="help-block">from -180 to 180</span>
				</div>
				<div class="form-group">
					<label for="blacklist">Blacklist</label>
					<input type="text" class="form-control" id="blacklist" name="blacklist" aria-describedby="blacklist-help" value="<?=$data['blacklist'];?>">
					<span id="blacklist-help" class="help-block">a list of values like x.x.x.x separated by comma</span>
				</div>
				<button type="submit" class="btn btn-primary" id="saveBtn" onclick="return configurationForm.validate()">Save</button>
			</form>
		</div>
	</div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mouse0270-bootstrap-notify/3.1.7/bootstrap-notify.min.js"></script>
<script src="config.js"></script>
</body>
</html>