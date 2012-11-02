(function (global) {
	/* my code */
	global["tableManager"] = {
		fillTable : function (tablematrix, tableid) {
			//alert("Plus px")

			var height = 20;
			var width = 20;
			var padding = 1;

			heights=[];
			for (var i = 0; i < height; i++) {
				heights[i] = 18+"px";
			}
			widths=[];
			for (var i = 0; i < width; i++) {
				widths[i] = 130+"px";
			}

			// Create temporary matrix
			tablematrix = [];
			for (var i = 0 ; i < height; i ++){
				tablematrix[i] = [];
				for (var j = 0; j < width; j++) {
					if (j == 5 || j==6)
						tablematrix[i][j] = i+j+"HELLLLLOOOOOOOOTHERERERERRERE";
					else        tablematrix[i][j] = "";
				}
			}

			// create partial document dom
			newtable = document.createElement('table');
			newtable.border=1;
			newtable.borderColor="#CCC";
			newtable.style.borderCollapse="collapse"

			for (var i = 0; i < height; i++) {
				var newRow = document.createElement('tr');
				for (var j = 0; j < width; j++) {
					var newCell = document.createElement('td');
					newCell.style.padding="0px";

					var newContent = document.createElement('div');
					newCell.appendChild(newContent);


					newContent.innerHTML = tablematrix[i][j];
					if (tablematrix[i][j] != "") {
							newContent.style.background = "#FFF";
					}	

					newContent.style.position = "absolute";

					newCell.style.maxWidth = widths[j];
					//newContent.style.maxWidth = widths[j];
					//newContent.style.width = widths[j];
					newCell.style.minWidth = widths[j];
					newCell.style.verticalAlign="top";
					//newContent.style.borderWidth = "1px";
					//newContent.style.borderStyle = "solid";
					//newContent.style.borderColor = "#CCC";

					//newContent.style.minWidth = "100%";
					//newContent.style.minHeight = "100%";

					newContent.style.zIndex = "50";
					
					newContent.style.maxHeight = "16px";
					newContent.style.height = "16px";

					newCell.style.maxHeight = heights[i];
					newCell.style.height = heights[i];

					newContent.style.overflow = "hidden";

					newContent.style.padding = padding+"px";
					newContent.style.fontSize = "15px"
					newRow.appendChild(newCell);
				}
				newtable.appendChild(newRow);
			}

			table = document.getElementById(tableid);
			table.parentNode.replaceChild(newtable,table);

			// Loop through an change the widths for cells that are out of bounds
		},
		changeElement : function(xlocation, ylocation, newvalue, table){

		}
	};
})(window);