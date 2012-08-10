function convertMenu () {
	var originalMenu = document.getElementById("originalmenu").value;
	var originalMenuType = document.getElementById("originalmenutype").value;
	
	/*
	var types = "";
	for (e in originalMenuType) {
		types+= e + "\n";
	}
	alert (types);*/

	var JSONMenu;

	switch (originalMenuType) {
		case "XML":
			JSONMenu = parseXMLtoJSON(originalMenu);
			break;
		case "JSON":
			JSONMenu = originalmenu;
			break;
	}
}

var jsonmenu = {};
function parseXMLtoJSON(originalXML) {
	// Parse through each layer of the XML, each time there is a menu object parse it's sublayer
	alert(originalXML);
	var pxml = $.parseXML(originalXML);
	alert("POINT 1");
 	pxml = $(pxml).children();// break out of the global menu
  	(pxml).children().each(function() {extractElements(this);});
}

function extractXMLElements ( XMLtree ) {
	// Get the name of the element (eg: menu, menuitem, break)
	var type = XMLtree.nodeName;
	// Create the new object
	var newMenuElement = {};
	newMenuElement["type"] = name;

	if (type === "menu") {

	}
	else if (type === "menuitem") {
		newMenuElement["name"]     = $(XMLTree).attr("name");
		newMenuElement["function"] = $(XMLTree).attr("function");
		newMenuElement["iconsrc"]  = $(XMLTree).attr("iconsrc");
		newMenuElement["shortcut"] = $(XMLTree).attr("shortcut");
		newMenuElement["version"]  = $(XMLTree).attr("version");
	}
	else if (type === "break") {
		// DONE! breaks have no variables
	}
 
}