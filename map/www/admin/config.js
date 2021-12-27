var ConfigurationForm = function () {

	this.url = "config";

	this.elements = ["malicious-threat-color", "malicious-behavior-indicator-color", "suspicious-threat-color", "nothreat-color", "text-color", "header-color", "table-color", "network-indicators-update-interval", "behavior-indicators-update-interval", 
		"first-detonation-duration", "second-detonation-duration", "detonation-ring-delay", "detonation-delay", "detonation-mark-duration", "detonation-radius", "detonation-mark-radius", "logo-position", "logo-width", "initial-map-zoom", "initial-map-center-latitude", 
		"initial-map-center-longitude"];

	var self = this;

	$.each(this.elements, function(key, val) {
		self.addElementValidator(val);
	})
}

ConfigurationForm.prototype.addElementValidator = function(element) {

	$("#" + element).focusout(function() {
	
		if (!this.value) {
	
			if ($("#" + element).parent().hasClass("has-success")) {
				$("#" + element).parent().removeClass("has-success");
			}
	
			if (!$("#" + element).parent().hasClass("has-error")) {
				$("#" + element).parent().addClass("has-error");
			}

		} else {
	
			if ($("#" + element).parent().hasClass("has-error")) {
				$("#" + element).parent().removeClass("has-error");
			}
	
			if (!$("#" + element).parent().hasClass("has-success")) {
				$("#" + element).parent().addClass("has-success");
			}
		}
	})
}

ConfigurationForm.prototype.validate = function() {

	var isValid = true;

	$.each(this.elements, function(key, element) {

		if (!$("#" + element).val()) {

			if (!$("#" + element).parent().hasClass("has-error")) {
				$("#" + element).parent().addClass("has-error");
			}

			$.notify({
				message: element.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + " is empty"
			},{
				type: "danger",
				placement: {
					from: "top",
					align: "center"
				},
				delay: 1,
			});

			isValid = false;
		}
	})

	if (isValid) {

		$.notify({
			message: "Saving..."
		},{
			type: "success",
			placement: {
				from: "top",
				align: "center"
			},
			delay: 2,
		});
	}

	return isValid;
}

var configurationForm = new ConfigurationForm();