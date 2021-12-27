<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<title>Falcon Sandbox - Intelligence Threatmap</title>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" integrity="sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ==" crossorigin=""/>
	<link rel="stylesheet" href="../lib/leaflet-control-topcenter.min.css"/>
	<link rel="stylesheet" href="../style.css"/>
</head>
<body>
	<div id="map"></div>
	<script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js" integrity="sha512-lInM/apFSqyy1o6s89K4iQUKg6ppXEgsVxT35HbzUupEVRh2Eu9Wdl4tHj7dZO0s1uvplcYGmt3498TtHq+log==" crossorigin=""></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="../lib/leaflet-control-topcenter.min.js"></script>
	<script src="../lib/spin.min.js" charset="utf-8"></script>
	<script src="../lib/leaflet.spin.min.js" charset="utf-8"></script>
	<script src="../js/renderer.js"></script>
	<script>
	    var configuration = <?=isset($configuration) ? $configuration : "null";?>;

		var renderer = new Renderer();

        if (configuration) {
		    renderer.setConfiguration(configuration);
		} else {
		    renderer.setDefaultConfiguration();
		}

		renderer.createStyleRules();
        renderer.createMap();
        renderer.createLogo();
        renderer.createTablesControl();
        renderer.getData();
	</script>
</body>
</html>