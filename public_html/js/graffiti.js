//////////////////////////////////////////////////////////////////////////////
//  tareksherif.ca: codebase for www.tareksherif.ca
//  Copyright (C) 2013  Tarek Sherif
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as
//  published by the Free Software Foundation, either version 3 of the
//  License, or (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
//////////////////////////////////////////////////////////////////////////////


// Spray paint and captureMouse code taken from 
// Foundation HTML5 Animation with JavaScript
// by Billy Lamberta and Keith Peters
var graffiti = (function() {
  var canvas = null;
  var showing = false;
  
  function captureMouse(canvas) {
    var mouse = {x: 0, y: 0};
    
    canvas.addEventListener('mousemove', function(e) {
      var x, y;
      
      if (e.pageX !== undefined) {
        x = e.pageX;
        y = e.pageY;
      } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      
      x -= canvas.offsetLeft;
      y -= canvas.offsetTop;
      
      mouse.x = x;
      mouse.y = y;
    }, false);
    
    return mouse;
  }
  
  function show() {
    if (showing) return;
    showing = true;
    
    canvas = document.createElement("canvas");
    canvas.id = "graffiti-canvas";
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    var context = canvas.getContext("2d");
    var mouse = captureMouse(canvas);
    var image_data = context.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = image_data.data;
    var brush_size;
    var brush_density = 500;
    var brush_color;
    
    canvas.addEventListener("mousedown", function() {
      brush_color = Math.floor(Math.random() * 0xFFFFFF);
      brush_size = Math.random() * 90 + 10;
      spray();
      canvas.addEventListener("mousemove", spray, false);
    }, false);
    
    canvas.addEventListener("mouseup", function() {
      canvas.removeEventListener("mousemove", spray, false);
    }, false);
    
    document.body.appendChild(canvas);
    
    function spray() {
      var i, angle, radius, xpos, ypos, offset;
      
      for (i = 0; i < brush_density; i++) {
        angle = Math.random() * Math.PI * 2;
        radius = Math.random() * brush_size;
        xpos = Math.floor(mouse.x + Math.cos(angle) * radius);
        ypos = Math.floor(mouse.y + Math.sin(angle) * radius);
        offset = (ypos * image_data.width + xpos) * 4;
        
        pixels[offset] = brush_color >> 16;
        pixels[offset+1] = (brush_color >> 8) & 0xFF;
        pixels[offset+2] = brush_color & 0xFF;
        pixels[offset+3] = 255;
      }
      
      context.putImageData(image_data, 0, 0);
    }
  }
  
  function hide() {
    if (!showing) return;
  
    document.body.removeChild(canvas);
    canvas = null;
    showing = false;
  }
  
  function isShowing() {
    return showing;
  }

  return {
    show: show,
    hide: hide,
    isShowing: isShowing
  };
})();
