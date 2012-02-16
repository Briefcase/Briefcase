/******************************************************************************\
|                                     ,,                                       |
|                    db             `7MM                                       |
|                   ;MM:              MM                                       |
|                  ,V^MM.    ,pP"Ybd  MMpMMMb.  .gP"Ya `7Mb,od8                |
|                 ,M  `MM    8I   `"  MM    MM ,M'   Yb  MM' "'                |
|                 AbmmmqMA   `YMMMa.  MM    MM 8M""""""  MM                    |
|                A'     VML  L.   I8  MM    MM YM.    ,  MM                    |
|              .AMA.   .AMMA.M9mmmP'.JMML  JMML.`Mbmmd'.JMML.                  |
|                                                                              |
|                                                                              |
|                                ,,    ,,                                      |
|                     .g8"""bgd `7MM    db        `7MM                         |
|                   .dP'     `M   MM                MM                         |
|                   dM'       `   MM  `7MM  ,p6"bo  MM  ,MP'                   |
|                   MM            MM    MM 6M'  OO  MM ;Y                      |
|                   MM.    `7MMF' MM    MM 8M       MM;Mm                      |
|                   `Mb.     MM   MM    MM YM.    , MM `Mb.                    |
|                     `"bmmmdPY .JMML..JMML.YMbmd'.JMML. YA.                   |
|                                                                              |
\******************************************************************************/
/******************************************************************************\
| Copyright (c) 2012, Asher Glick                                              |
| All rights reserved.                                                         |
|                                                                              |
| Redistribution and use in source and binary forms, with or without           |
| modification, are permitted provided that the following conditions are met:  |
|                                                                              |
| * Redistributions of source code must retain the above copyright notice,     |
|   this list of conditions and the following disclaimer.                      |
| * Redistributions in binary form must reproduce the above copyright notice,  |
|   this list of conditions and the following disclaimer in the documentation  |
|   and/or other materials provided with the distribution.                     |
|                                                                              |
| THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"  |
| AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE    |
| IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE   |
| ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE    |
| LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR          |
| CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF         |
| SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS     |
| INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN      |
| CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)      |
| ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE   |
| POSSIBILITY OF SUCH DAMAGE.                                                  |
\******************************************************************************/
/******************************************************************************\
| This file (draw.js) contains all the functions for drawing to the canvas. it |
| is only in a seperate file for ease of use. It takes in some large objects   |
| however because objects are passed by reference (while primatives are passed |
| by value it is ok!                                                           |
\******************************************************************************/



/******************************** REDRAW FRAME ********************************\
| This function redraws the entire frame, it is a very usefull function and    |
| will soon be the only function that does any drawing at all, this way we     |
| we wont get any errors with visualizations                                   |
\******************************************************************************/
function redrawFrame() {
  var c_canvas = document.getElementById("application");

  document.getElementById("framecontain").style.height = window.innerHeight - 30 + "px";
  document.getElementById("framecontain").style.width = window.innerWidth + "px";
  
  c_canvas.height = window.innerHeight;
  c_canvas.width = window.innerWidth;


  var context = c_canvas.getContext("2d");


  // draw the grid lines
  for (var x = 0.5; x < c_canvas.width; x += cellWidth) {
    context.moveTo(x,0);
    context.lineTo(x,c_canvas.height);
  }
  for (var y = 0.5; y < c_canvas.height; y += cellHeight) {
    context.moveTo(0,y);
    context.lineTo(c_canvas.width,y);
  }

  // Write the changes to the screen
  context.strokeStyle = "#ddd";
  context.stroke();
  
  // draw all the text
  for (var i in data) {
	  coordPair = i.split(',');
	  x_pos=parseInt(coordPair[0]);
	  y_pos=parseInt(coordPair[1]);
	  
	  context.font = "12px sans-serif";
	  
	  if (data[i][0]=='=') {
      context.fillText(eparse(data[i].substring(1,data[i].length)),(x_pos*cellWidth) +3 ,(y_pos*cellHeight)+14);
    }
    else {
      context.fillText(data[i],(x_pos*cellWidth) +3 ,(y_pos*cellHeight)+14);
    }
  }
  
  // draw the row lables
  for (var i = 1; i < c_canvas.height/cellHeight; i++) {
    context.fillText(i, 3, (i*cellHeight+14));
  }
  // draw the column lables
  for (var i = 1; i < c_canvas.width/cellWidth; i++) {
    context.fillText(i,(i*cellWidth+3),14);
  }
}
