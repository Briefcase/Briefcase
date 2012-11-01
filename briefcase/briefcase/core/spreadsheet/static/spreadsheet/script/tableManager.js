(function (global) {
	/* my code */
	global["tableManager"] = {
		fillTable : function (tablematrix, tableid) {
			alert("Plus px")

			var height = 20;
			var width = 20;

			heights=[];
			for (var i = 0; i < height; i++) {
				heights[i] = 40+"px";
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
					tablematrix[i][j] = i+j;
				}
			}

			// create partial document dom
			newtable = document.createElement('table');
			newtable.border=1;
			newtable.style.borderCollapse="collapse"

			for (var i = 0; i < height; i++) {
				var newRow = document.createElement('tr');
				newRow.style.height = heights[i];
				for (var j = 0; j < width; j++) {
					var newCell = document.createElement('td');
					//newCell.nodeValue =  tablematrix[i][j];
					newCell.innerHTML = tablematrix[i][j];
					newCell.style.width = widths[j];
					newRow.appendChild(newCell);
				}
				newtable.appendChild(newRow);
			}
			/*
			var table = document.getElementById(tableId);
			if (table == undefined) return;
			var rowNb = table.rows.length;
			// Take care of header
			var bAddNames = (table.tHead.rows[0].cells.length % 2 == 1);
			var newcell = table.rows[0].cells[bAddNames ? 1 : 0].cloneNode(true);
			table.rows[0].appendChild(newcell);
			// Add the remainder of the column
			for(var i = 1; i < rowNb; i++)
			{
				newcell = table.rows[i].cells[0].cloneNode(bAddNames);
				table.rows[i].appendChild(newcell);
			}



			*/
			//
			table = document.getElementById(tableid);
			table.parentNode.replaceChild(newtable,table);
		},
		changeElement : function(xlocation, ylocation, newvalue, table){

		}
	};
})(window);