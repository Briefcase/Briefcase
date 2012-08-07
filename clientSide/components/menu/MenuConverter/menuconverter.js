function () {
	var originalMenu = document.getElementById("originalmenu").text;
	var originalMenuType = document.getElementById("originalmenutype");
	
	var JSONMenu;

	switch originalmenutype {
		case "XML":
			JSONMenu = parseXMLtoJSON(originalmenu);
			break;
		case "JSON":
			JSONMenu = originalmenu;
			break;
	}
}

function parseXMLtoJSON(originalXML) {
	var jsonmenu = [];
	// Parse through each layer of the XML, each time there is a menu object parse it's sublayer
	




}