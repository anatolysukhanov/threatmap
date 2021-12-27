var Renderer = function () {

	this.url = "config";

	this.defaultConfigurationSettings = {
		"malicious-threat-color": "red", 
		"malicious-behavior-indicator-color" : "rgb(218,43,2)",
		"suspicious-threat-color": "orange", 
		"nothreat-color": "green", 
		"text-color": "#aec2e0", 
		"header-color": "#267fb5", 
		"table-color": "#324357",
		"behavior-indicators-update-interval": "350",
		"network-indicators-update-interval": "500",
		"first-detonation-duration": "2",
		"secind-detonation-duration": "1",
		"detonation-ring-delay": "500",
		"detonation-delay": "500",
		"detonation-mark-duration": "45",
		"detonation-radius": "300000",
		"detonation-mark-radius": "50000",
		"logo-position": "topleft",
		"logo-width": "250",
		"initial-map-zoom": "3",
		"initial-map-center-latitude": "37",
		"initial-map-center-longitude": "-25",
		"blacklist" : "8.8.8.8"
	};

	this.currentHostIndex = 0;
	this.currentAlertIndex = 0;

	this.behaviorIndicatorsIndex = 0;

	this.hosts = [];
	this.alerts = [];
	this.indicators = [];

	this.countries = [];

	this.location = L.latLng(0, 0);
}

/**
 * Returns the css class name and detonation mark radius depending on the host threat level.
 * @param {string} host 
 */
Renderer.prototype.getColorClassAndRadius = function(host) {

	var colorClass = "nothreat";

	var circleRadius = this["detonation-mark-radius"];

	if (host.level == 2) {
		colorClass = "malicious";
		circleRadius = this["detonation-mark-radius"] * 3;
	} else if (host.level == 1) {
		colorClass = "suspicious";
		circleRadius = this["detonation-mark-radius"] * 2;
	}

	return [colorClass, circleRadius];
}

/**
 * Returns the index of a country if its name is present in the countries or -1 otherwise.
 * @param {string} name
 */
Renderer.prototype.findAffectedCountryIndexByName = function(name) {

	for (var i = 0, len = this.countries.length; i < len; i++) {
		if (this.countries[i].name == name) {
			return i;
		}
	}

	return -1;
}

/**
 * Returns a new randomized location if there are 2 same locations in a row.
 * @param {string} lat
 * @param {string} lng
 */
Renderer.prototype.randomizeLocation = function(lat, lng) {

	var location = L.latLng(lat, lng);

	if (this.location.equals(location)) {

		location.lat += Math.random() * 2 - 1;
		location.lng += Math.random() * 2 - 1;
	}

	this.location.lat = location.lat;
	this.location.lng = location.lng;

	return location;
}

/**
 * Returns jqXHR object which gets and sets configuration settings from the backend or sets default configuration settings if the response is empty.
 */
Renderer.prototype.getConfiguration = function() {

	var self = this;

	return $.getJSON(this.url, function(response) {
		if (response.length) {
			$.each(response, function(key, val) {
				self[val.name] = val.value;
			});
		} else {
			self.setDefaultConfiguration();
		}
	});
}

/**
 * Sets the configuration settings to the given values.
 * @param {Object} configuration
 */
Renderer.prototype.setConfiguration = function(configuration) {

    var self = this;

	$.each(configuration, function(key, val) {
		self[val.name] = val.value;
	});
}

/**
 * Sets the configuration settings to default values.
 */
Renderer.prototype.setDefaultConfiguration = function() {

	var self = this;

	$.each(this.defaultConfigurationSettings, function(key, val) {
		self[key] = val;
	});
}

/**
 * Appends some css rules to the existing stylesheet. Sets css rule indices for detonations.
 */
Renderer.prototype.createStyleRules = function() {

	document.styleSheets[2].insertRule(".table-body { color: " + this["text-color"] + "; }", document.styleSheets[2].cssRules.length);
	document.styleSheets[2].insertRule(".table-head { color: " + this["header-color"] + "; }", document.styleSheets[2].cssRules.length);
	document.styleSheets[2].insertRule(".table-caption { color: " + this["header-color"] + "; background-color: " + this["table-color"] + "; }", document.styleSheets[2].cssRules.length);

	document.styleSheets[2].insertRule(".table-row.nothreat { color: " + this["text-color"] + "; }", document.styleSheets[2].cssRules.length);
	document.styleSheets[2].insertRule(".table-row.suspicious { color: " + this["suspicious-threat-color"] + "; }", document.styleSheets[2].cssRules.length);
	document.styleSheets[2].insertRule(".table-row.malicious { color: " + this["malicious-threat-color"] + "; }", document.styleSheets[2].cssRules.length);
	document.styleSheets[2].insertRule(".table-row.malicious-behavior-indicator { color: " + this["malicious-behavior-indicator-color"] + "; }", document.styleSheets[2].cssRules.length);

	document.styleSheets[2].insertRule(".detonation { animation: pulsate " + this["first-detonation-duration"] + "s linear; -webkit-animation: pulsate " + this["first-detonation-duration"] + "s linear; -moz-animation: pulsate " + this["first-detonation-duration"] + "s linear; }", document.styleSheets[2].cssRules.length);

	document.styleSheets[2].insertRule(".detonation.nothreat { background-color: " + this["nothreat-color"] + "; border: 2px solid " + this["nothreat-color"] + "; }", document.styleSheets[2].cssRules.length);
	document.styleSheets[2].insertRule(".detonation.suspicious { background-color: " + this["suspicious-threat-color"] + "; border: 2px solid " + this["suspicious-threat-color"] + "; }", document.styleSheets[2].cssRules.length);
	document.styleSheets[2].insertRule(".detonation.malicious { background-color: " + this["malicious-threat-color"] + "; border: 2px solid " + this["malicious-threat-color"] + "; }", document.styleSheets[2].cssRules.length);

	this.nothreatDetonationCssRuleIndex = document.styleSheets[2].insertRule(".detonation.nothreat { height: 0px; width: 0px; }", document.styleSheets[2].cssRules.length);
	this.suspiciousDetonationCssRuleIndex = document.styleSheets[2].insertRule(".detonation.suspicious { height: 0px; width: 0px; }", document.styleSheets[2].cssRules.length);
	this.maliciousDetonationCssRuleIndex = document.styleSheets[2].insertRule(".detonation.malicious { height: 0px; width: 0px; }", document.styleSheets[2].cssRules.length);

	document.styleSheets[2].insertRule(".second-detonation { animation: second-pulsate " + this["second-detonation-duration"] + "s linear; -webkit-animation: second-pulsate " + this["second-detonation-duration"] + "s linear; -moz-animation: second-pulsate " + this["second-detonation-duration"] + "s linear; }", document.styleSheets[2].cssRules.length);

	document.styleSheets[2].insertRule(".second-detonation.nothreat { border: 2px solid " + this["nothreat-color"] + "; }", document.styleSheets[2].cssRules.length);
	document.styleSheets[2].insertRule(".second-detonation.suspicious {	border: 2px solid " + this["suspicious-threat-color"] + "; }", document.styleSheets[2].cssRules.length);
	document.styleSheets[2].insertRule(".second-detonation.malicious { border: 2px solid " + this["malicious-threat-color"] + "; }", document.styleSheets[2].cssRules.length);

	this.nothreatSecondDetonationCssRuleIndex = document.styleSheets[2].insertRule(".second-detonation.nothreat { height: 0px; width: 0px; }", document.styleSheets[2].cssRules.length);
	this.suspiciousSecondDetonationCssRuleIndex = document.styleSheets[2].insertRule(".second-detonation.suspicious { height: 0px; width: 0px; }", document.styleSheets[2].cssRules.length);
	this.maliciousSecondDetonationCssRuleIndex = document.styleSheets[2].insertRule(".second-detonation.malicious { height: 0px; width: 0px; }", document.styleSheets[2].cssRules.length);

	document.styleSheets[2].insertRule(".detonation-mark { animation: fadeout " +  this["detonation-mark-duration"] + "s ease-in-out; -webkit-animation: fadeout " +  this["detonation-mark-duration"] + "s ease-in-out; -moz-animation: fadeout " +  this["detonation-mark-duration"] + "s ease-in-out; }", document.styleSheets[2].cssRules.length);

	document.styleSheets[2].insertRule(".detonation-mark.nothreat { fill: " + this["nothreat-color"] + "; }", document.styleSheets[2].cssRules.length);
 	document.styleSheets[2].insertRule(".detonation-mark.suspicious { fill: " + this["suspicious-threat-color"] + "; }", document.styleSheets[2].cssRules.length);
	document.styleSheets[2].insertRule(".detonation-mark.malicious { fill: " + this["malicious-threat-color"] + "; }", document.styleSheets[2].cssRules.length);
}

/**
 * Creates and returns a div icon whose size depends on the host threat level.
 * @param {string} host
 */
Renderer.prototype.createIcon = function(host) {

	var iconSize = [ this.pixelsForDetonationRadius + 2, this.pixelsForDetonationRadius + 2];

	if (host.level == 2) {
		iconSize = [ this.pixelsForDetonationRadius * 3 + 2, this.pixelsForDetonationRadius * 3 + 2 ];
	} else if (host.level == 1) {
		iconSize = [ this.pixelsForDetonationRadius * 2 + 2, this.pixelsForDetonationRadius * 2 + 2 ];
	}

	return new L.divIcon({
		className: "explode-icon",
		html: "<div></div>",
		iconSize: iconSize
	});
}

/**
 * Creates the map, adds a tile layer to it, shows a spinner, creates zoomend event handler to adjust the detonation radius.
 */
Renderer.prototype.createMap = function() {

	var worldBounds = [[-90, -180], [90, 180]];
          
	this.map = L.map("map", {
		minZoom: 3,
		maxBoundsViscosity: 1.0,
		maxBounds: worldBounds,
		zoomControl: false,
		attributionControl: false
	});

	this.map.on("zoomend", ( function() {

		this.setPixelsForDetonationRadius();

		document.styleSheets[2].cssRules[this.nothreatDetonationCssRuleIndex].style.width = this.pixelsForDetonationRadius + "px";
		document.styleSheets[2].cssRules[this.suspiciousDetonationCssRuleIndex].style.width = this.pixelsForDetonationRadius * 2 + "px" ;
		document.styleSheets[2].cssRules[this.maliciousDetonationCssRuleIndex].style.width = this.pixelsForDetonationRadius * 3 + "px" ;

		document.styleSheets[2].cssRules[this.nothreatDetonationCssRuleIndex].style.height = this.pixelsForDetonationRadius + "px";
		document.styleSheets[2].cssRules[this.suspiciousDetonationCssRuleIndex].style.height = this.pixelsForDetonationRadius * 2 + "px" ;
		document.styleSheets[2].cssRules[this.maliciousDetonationCssRuleIndex].style.height = this.pixelsForDetonationRadius * 3 + "px" ;

		document.styleSheets[2].cssRules[this.nothreatSecondDetonationCssRuleIndex].style.width = this.pixelsForDetonationRadius + "px";
		document.styleSheets[2].cssRules[this.suspiciousSecondDetonationCssRuleIndex].style.width = this.pixelsForDetonationRadius * 2 + "px" ;
		document.styleSheets[2].cssRules[this.maliciousSecondDetonationCssRuleIndex].style.width = this.pixelsForDetonationRadius * 3 + "px" ;

		document.styleSheets[2].cssRules[this.nothreatSecondDetonationCssRuleIndex].style.height = this.pixelsForDetonationRadius + "px";
		document.styleSheets[2].cssRules[this.suspiciousSecondDetonationCssRuleIndex].style.height = this.pixelsForDetonationRadius * 2 + "px" ;
		document.styleSheets[2].cssRules[this.maliciousSecondDetonationCssRuleIndex].style.height = this.pixelsForDetonationRadius * 3 + "px" ;

	}).bind(this) );

	this.map.spin(true, {
		color: "#324357"
	});

	this.map.setView([this["initial-map-center-latitude"], this["initial-map-center-longitude"]], this["initial-map-zoom"]);

	var layer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
		noWrap: true, 
		bounds: worldBounds
	});

	this.map.addLayer(layer);
}

/**
 * Calculates pixels per meter and sets the detonation radius.
 */
Renderer.prototype.setPixelsForDetonationRadius = function() {

	var centerLatLng = this.map.getCenter();
	var pointC = this.map.latLngToContainerPoint(centerLatLng);
	var pointX = [pointC.x + 1, pointC.y];
	var pointY = [pointC.x, pointC.y + 1];

	var latLngC = this.map.containerPointToLatLng(pointC);
	var latLngX = this.map.containerPointToLatLng(pointX);
	var latLngY = this.map.containerPointToLatLng(pointY);

	var distanceX = latLngC.distanceTo(latLngX);
	var distanceY = latLngC.distanceTo(latLngY);

	this.pixelsForDetonationRadius = Math.round(this["detonation-radius"] / Math.min(distanceX, distanceY));
}

/**
 * Creates a logo and adds it to the map.
 */
Renderer.prototype.createLogo = function() {

	var self = this;

	L.Control.Logo = L.Control.extend({
	    onAdd: function(map) {
	        var logo = L.DomUtil.create('div');
		logo.innerHTML = '<a href="https://www.hybrid-analysis.com" target="_blank"><img src="images/logo.png" style="width:' + self["logo-width"] + 'px;"></a>';
	        return logo;
	    },
	    onRemove: function(map) {
	    }
	});
	
	L.control.logo = function(opts) {
	    return new L.Control.Logo(opts);
	}
	
	L.control.logo({ position: this["logo-position"] }).addTo(this.map);
}

/**
 * Creates a table with 3 placeholders for the affected countries, behavior indicators and network indicators.
 */
Renderer.prototype.createTablesControl = function() {

	this.tablesControl = L.control({
	    position: 'bottomcenter'
	});
	
	this.tablesControl.onAdd = function(map) {

		this._div = L.DomUtil.create('div', 'tables');

		this._div.innerHTML = 
			'<div class="table-body">' +
				'<div class="table-row">' +
					'<div class="table-cell" style="width: 7%">' +
						'<div class="affected-countries">' +
							'<div class="table-caption">Affected Countries</div>' +
								'<div class="table-head">' +
									'<div class="table-row">' +
										'<div class="table-cell" style="text-align: center;">#</div>' +
										'<div class="table-cell" style="width: 70%">Country</div>' +
									'</div>' +
								'</div>' +
							'<div class="table-body"></div>' +
						'</div>' +
					'</div>' +
					'<div class="table-cell" style="width: 30%">' +
						'<div class="behavior-indicators">' + 
							'<div class="table-caption">Behavior Indicators</div>' +
								'<div class="table-head">' +
									'<div class="table-row">' +
										'<div class="table-cell" style="width: 85%">Description</div>' +
										'<div class="table-cell">ID</div>' +
									'</div>' +
								'</div>' +
							'<div class="table-body"></div>' +
						'</div>' +
					'</div>' +
					'<div class="table-cell" style="width: 60%">' +
						'<div class="network-indicators">' + 
							'<div class="table-caption">Network Indicators</div>' + 
								'<div class="table-head">' +
									'<div class="table-row">' +
										'<div class="table-cell" style="width: 9%">Host</div>' +
										'<div class="table-cell" style="width: 5%">Port</div>' +
										'<div class="table-cell" style="width: 20%">Category</div>' +
										'<div class="table-cell">Description</div>' +
										'<div class="table-cell" style="width: 10%">ETPro ID</div>' +
									'</div>' +
								'</div>' +
							'<div class="table-body"></div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';

	    return this._div;
	}
	
	this.map.addControl(this.tablesControl);
}

/**
 * Runs a web worker which parses the feed and returns 3 arrays: detonations, behavior indicators, network indicators. Starts the animation cycles.
 */
Renderer.prototype.getData = function() {

	if (window.Worker) {
	
		var worker = new Worker('js/parser.js');
	
		worker.postMessage(this.blacklist);

		var self = this;
	
		worker.onmessage = function(e) {

			self.map.spin(false);

			if (e.data[0].length > 0) {				
				self.hosts = e.data[0].reverse();
				self.showDetonation();
			}

			if (e.data[1].length > 0) {
				self.alerts = e.data[1].reverse();
				self.showNetworkIndicators();
			}

			if (e.data[2].length > 0) {
				self.indicators = e.data[2].reverse();
				self.showBehaviorIndicators();
			}
		}
	}
}

/**
 * Creates a row for the affected countries table.
 * @param {Object} country
 */
Renderer.prototype.createAffectedCountryRow = function(country) {

	var row = L.DomUtil.create('div', 'table-row');

	row.innerHTML = '<div class="table-cell" style="text-align: center;">' + country.qty +'</div>' +
			'<div class="table-cell"><img src="images/flags/'  + country.name.toLowerCase() + '.png">&nbsp;' + country.name +'</div>';

	return row;
}

/**
 * Creates a row for the behavior indicators table.
 * @param {Object} indicator
 */
Renderer.prototype.createBehaviorIndicatorRow = function(indicator) {

	var colorClass;

	if (indicator.threatlevel == 2) {
		colorClass = "malicious-behavior-indicator";
	} else if (indicator.threatlevel == 1) {
		colorClass = "suspicious";
	}

	var row = L.DomUtil.create('div');

	row.className = colorClass ? "table-row " + colorClass : "table-row";

	row.innerHTML = '<div class="table-cell">' + indicator.description +'</div>' +
			'<div class="table-cell">' + indicator.id +'</div>';

	return row;
}

/**
 * Creates a row for the network indicators table.
 * @param {Object} indicator
 */
Renderer.prototype.createNetworkIndicatorRow = function(indicator) {

	var row = L.DomUtil.create('div', 'table-row');

	row.innerHTML = '<div class="table-cell">' + indicator.host +'</div>' +
			'<div class="table-cell">' + indicator.port +'</div>' +
			'<div class="table-cell">' + indicator.category +'</div>' +
			'<div class="table-cell">' + indicator.description +'</div>' +
			'<div class="table-cell">' + indicator.signature +'</div>';

	return row;
}

/**
 * Renders the affected countries table.
 */
Renderer.prototype.showAffectedCountries = function() {

	var tablesDiv = this.tablesControl.getContainer().children[0].children[0];

	var affectedCountriesTableBody = tablesDiv.children[0].children[0].children[2];

	var len = 5;

	if (this.countries.length < len) {
		len = this.countries.length;
	}

	while (affectedCountriesTableBody.hasChildNodes()) {
		affectedCountriesTableBody.removeChild(affectedCountriesTableBody.lastChild);
	}

	for (var i = 0; i < len; i++) {

		var row = this.createAffectedCountryRow(this.countries[i]);

    	affectedCountriesTableBody.appendChild(row);
	}
}

/**
 * Renders the behavior indicators table.
 */
Renderer.prototype.showBehaviorIndicators = function() {

	var tablesDiv = this.tablesControl.getContainer().children[0].children[0];

	var behaviorIndicatorsTableBody = tablesDiv.children[1].children[0].children[2];

	for (var i = 0; i < 5; i++) {

		var row = this.createBehaviorIndicatorRow(this.indicators[i]);

		behaviorIndicatorsTableBody.appendChild(row);

		this.behaviorIndicatorsIndex++;
	}	

	var self = this;

	window.setInterval(function() {

		if (self.behaviorIndicatorsIndex == self.indicators.length) {
			self.behaviorIndicatorsIndex = 0;
		}

		behaviorIndicatorsTableBody.removeChild(behaviorIndicatorsTableBody.children[4]);

		var row = self.createBehaviorIndicatorRow(self.indicators[self.behaviorIndicatorsIndex]);

		behaviorIndicatorsTableBody.insertBefore(row, behaviorIndicatorsTableBody.children[0]);

		self.behaviorIndicatorsIndex++

	}, this["behavior-indicators-update-interval"]);
}

/**
 * Renders the network indicators table.
 */
Renderer.prototype.showNetworkIndicators = function() {

	var tablesDiv = this.tablesControl.getContainer().children[0].children[0];

	var networkIndicatorsTableBody = tablesDiv.children[2].children[0].children[2];

	for (var i = 0; i < 5; i++) {

		var row = this.createNetworkIndicatorRow(this.alerts[i]);

		networkIndicatorsTableBody.appendChild(row);

		this.currentAlertIndex++;
	}

	var self = this;

	window.setInterval(function() {

		if (self.currentAlertIndex == self.alerts.length) {
			self.currentAlertIndex = 0;
		}

		networkIndicatorsTableBody.removeChild(networkIndicatorsTableBody.children[4]);

		var row = self.createNetworkIndicatorRow(self.alerts[self.currentAlertIndex]);

		networkIndicatorsTableBody.insertBefore(row, networkIndicatorsTableBody.children[0]);

		self.currentAlertIndex++;

	}, this["network-indicators-update-interval"]);
}

/**
 * Renders the detonation mark.
 * @param {string} location
 * @param {string} circleRadius
 * @param {string} colorClass
 * @param {string} ip
 */
Renderer.prototype.showDetonationMark = function(location, circleRadius, colorClass, ip) {

	var circle = L.circle(location, {
		radius: circleRadius,
		stroke: false,
		className: "detonation-mark " + colorClass,
		ip: ip
	})

	circle.on("click", function() {
		window.open("https://www.hybrid-analysis.com/search?query=host%3A" + this.options.ip, "_blank");
	});

	circle.addTo(this.map);

	var circles = document.getElementsByClassName("detonation-mark");

	for (i = 0; i < circles.length; i++) {

		if (!circles[i].getAttribute("listener-added")) {
	
			circles[i].addEventListener("animationend", function() {

				this.removeEventListener("animationend", this);

				this.parentNode.removeChild(this);

			}, {once: true});

			circles[i].setAttribute("listener-added", 1);
		}
	}
}

/**
 * Sorts the affected countries by the amount of hits. Calls the affected countries renderer.
 * @param {Object} host
 */
Renderer.prototype.updateCountries = function(host) {

	var countryIndex = this.findAffectedCountryIndexByName(host.country);

	if (countryIndex > -1) {
		this.countries[countryIndex].qty = this.countries[countryIndex].qty + 1;
	} else {
		this.countries.push({index: this.countries.length, name: host.country, qty : 1});
	}

	this.countries.sort(function(a, b) {
		if (b.qty > a.qty) return 1;
		if (b.qty < a.qty) return -1;
		if (b.qty == a.qty) return a.index - b.index;
	});

	this.showAffectedCountries();
}

/**
 * Renders the detonations. Calls itself infinitely.
 */
Renderer.prototype.showDetonation = function() {

	if (this.currentHostIndex == this.hosts.length) {
		this.currentHostIndex = 0;
	}

	var tmp = this.getColorClassAndRadius(this.hosts[this.currentHostIndex]);

	var colorClass = tmp[0];

	var circleRadius = tmp[1];

	var location = this.randomizeLocation(this.hosts[this.currentHostIndex].lat, this.hosts[this.currentHostIndex].lng);

	var marker = L.marker(location, {
		icon: this.createIcon(this.hosts[this.currentHostIndex]),
		interactive: false
	});

	this.showDetonationMark(location, circleRadius, colorClass, this.hosts[this.currentHostIndex].ip);

	var self = this;

	marker.on("add", (function(event) {

		var detonationDiv = this._icon.children[0];

		detonationDiv.className = "detonation " + colorClass;

		detonationDiv.addEventListener("animationend", function() {

			this.removeEventListener("animationend", this);

			setTimeout(function() {
	
				detonationDiv.className = "second-detonation " + colorClass;

				detonationDiv.addEventListener("animationend", function() {

					this.removeEventListener("animationend", this);

					this.parentNode.removeChild(this);

					marker._map.removeLayer(marker);

				}, {once: true});
	
			}, self["detonation-ring-delay"]);
		})
	}))

	marker.addTo(this.map);

	if (this.hosts[this.currentHostIndex].level > 0) {
		this.updateCountries(this.hosts[this.currentHostIndex]);
	}

	this.currentHostIndex++;

	setTimeout( (function() {
		this.showDetonation();
	}).bind(this), this["detonation-delay"]);
}