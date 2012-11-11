(function (global) {
	/* my code */
	global["tableManager"] = {


		/*************************** TABLEMANAGER.FILLTABLE ***************************\
		| This function creates a table and fills it with the data contain in the      |
		| table data matrix. The widths of each cell are defined within the Cell       |
		| Widths matrix and the heights of the cells are defined within the Cell       |
		| Heights matrix. All the overflow settings are also set within this function  |
		\******************************************************************************/

		fillTable : function (tablematrix, tableid, cellWidths, cellHeights) {
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
				if (i == 2) widths[i] = 50+"px";
				else widths[i] = 130+"px";
			}

			

			// Create partial document DOM
			newtable = document.createElement('table');
			newtable.border=1;
			newtable.borderColor="#CCC";
			newtable.style.borderCollapse="collapse";


			//
			for (var i = 0; i < height; i++) {
				var newRow = document.createElement('tr');
				for (var j = 0; j < width; j++) {

					// find the width until the next filled cell
					var widthToNextCell = 130; //261;
					for (var k = j+1; k < width; k++) {
						if (tablematrix[i][k] != "") break;
						widthToNextCell += 130 + 1;
					}
					if (tablematrix[i][j] != "") console.log(widthToNextCell);

					// Create all the new Dom objects
					var newCell = document.createElement('td');
					var cellSize = document.createElement('div');
					var cellContent = document.createElement('div');
					var celloverflowIndicator = document.createElement('div');

					// Configure the new cell
					newCell.style.padding="0px";
					newCell.style.minWidth = widths[j];
					newCell.style.verticalAlign="top";
					newCell.style.maxWidth = widths[j];
					newCell.style.maxHeight = heights[i];
					newCell.style.height = heights[i];

					// Confiugre the cell sizeing div (maybe not required)
					newCell.appendChild(cellSize);

					// Configure the new content
					cellSize.appendChild(cellContent);
					cellContent.innerHTML = tablematrix[i][j];
					cellContent.style.position = "absolute"; // Bring the object out so that is will overfow
					cellContent.style.maxHeight = heights[j];
					cellContent.style.height = heights[j];
					cellContent.style.maxWidth = widthToNextCell+"px";
					cellContent.style.overflow = "hidden";
					cellContent.style.fontSize = "15px"

					// Configure the overflow marker
					cellContent.appendChild(celloverflowIndicator);
					celloverflowIndicator.style.position = "absolute";
					celloverflowIndicator.style.left=widthToNextCell-1+"px";
					celloverflowIndicator.style.top="0px";
					celloverflowIndicator.style.width = "1px";
					celloverflowIndicator.style.height = "30px";
					celloverflowIndicator.style.background = "#F00"
					//celloverflowIndicator.style.

					// Append the newley created table data
					newRow.appendChild(newCell);
				}
				newtable.appendChild(newRow);
			}

			table = document.getElementById(tableid);
			table.parentNode.replaceChild(newtable,table);
			newtable.id = tableid;


			//table = document.getElementById(tableid);
			//table.innerHTML="";
			//newtable.parentNode.replaceChild(newtable,table);


			// Loop through an change the widths for cells that are out of bounds
		},
		changeElement : function(xlocation, ylocation, newvalue, table){

		}
	};
})(window);