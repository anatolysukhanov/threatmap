onmessage = function(e) {

	var blacklist = e.data.split(",");

	function shuffle(array) {
	
		var currentIndex = array.length, temporaryValue, randomIndex;
		
		while (0 !== currentIndex) {
		
			randomIndex = Math.floor(Math.random() * currentIndex);
			
			currentIndex -= 1;
			
			temporaryValue = array[currentIndex];
			
			array[currentIndex] = array[randomIndex];
			
			array[randomIndex] = temporaryValue;
		}	
	}

	var req = new XMLHttpRequest();

	req.open("GET", "https://www.hybrid-analysis.com/feed?json&indicators", false);

	req.send();

	var json = JSON.parse(req.responseText);

	var countries = [];

	var hosts = json.data.filter(function(data) {
		return data.hosts_geo != undefined;
	}).map(function(threat) {
		return {hosts: threat.hosts_geo, level: threat.threatlevel};
	}).map(function(host_geo) {
		host_geo.hosts = host_geo.hosts.map(function(host) {
			host.level = host_geo.level;
			return host;
		})
		return host_geo;
	}).map(function(host_geo) {
		return host_geo.hosts;
	}).reduce(function(a, b) {
		return a.concat(b);
	}).filter(function(host) {
		return blacklist.indexOf(host.ip) === -1
	}).map(function(host) {
		return {lat: host.lat, lng: host.lon, level: host.level, country: host.cc, ip: host.ip};
	})

	var alerts = json.data.filter(function(data) {
		return data.et_alerts != undefined;
	}).map(function(threat) {
		return threat.et_alerts;
	}).reduce(function(a, b) {
		return a.concat(b);
	}).filter(function(a) {
		return a.srcip != undefined || a.destip != undefined;
	}).map(function(a) {
		return {host: a.srcip ? a.srcip : a.destip, port: a.destport, category: a.action.category, description: a.action.description.replace(/ET INFO|ET TROJAN|ET POLICY|ET CURRENT_EVENTS/ig, "").trim(), signature: a.action.signatureid};
	}).filter(function(alert) {
		return blacklist.indexOf(alert.host) === -1
	}).filter(function(value, index, self) {
		for (var i = index + 1, len = self.length; i < len; i++) {
        	if (self[i].description === value.description) {
				return false;
			}
	    }
	    return true;
	});

	var indicators = json.data.filter(function(data) {
		return data.indicators != null && data.indicators.length > 0;
	}).map(function(threat) {
		return threat.indicators;
	}).reduce(function(a, b) {
		return a.concat(b);
	})

	shuffle(indicators);

	postMessage([hosts, alerts, indicators]);
}