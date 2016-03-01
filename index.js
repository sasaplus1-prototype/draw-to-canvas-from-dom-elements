(function(){

  'use strict';

  var image = d3.select('#js-image'),
      frame = d3.select('#js-frame');

  var frameWidth = parseInt(frame.property('clientWidth'), 10),
      frameHeight = parseInt(frame.property('clientHeight'), 10);

  var width = parseInt(image.attr('width'), 10),
      height = parseInt(image.attr('height'), 10);

  var lastX = 0,
      lastY = 0,
      lastScale = 1;

  var zoom = d3.behavior.zoom();

  zoom.scale(1);
  zoom.scaleExtent([0.1, 10]);
  zoom.size([frameWidth, frameHeight]);

  zoom.on('zoom.move', function() {
    var x, y, scale, transform;

    x = d3.event.translate[0];
    y = d3.event.translate[1];
    scale = d3.event.scale;

    console.group('data');
    console.log('x: %s', x);
    console.log('y: %s', y);
    console.log('scale: %s', scale);
    console.log('lastX: %s', lastX);
    console.log('lastY: %s', lastY);
    console.log('lastScale: %s', lastScale);
    console.groupEnd();

    if (width * scale < frameWidth || height * scale < frameHeight) {
      scale = lastScale;
    }

    if (x > 0) {
      x = 0;
    } else if (x < 0 - width * scale + frameWidth) {
      x = 0 - width * scale + frameWidth;
    }

    if (y > 0) {
      y = 0;
    } else if (y < 0 - height * scale + frameHeight) {
      y = 0 - height * scale + frameHeight;
    }

    console.group('controlled data');
    console.log('x: %s', x);
    console.log('y: %s', y);
    console.log('scale: %s', scale);
    console.groupEnd();

    // reset d3.event.scale
    zoom.scale(scale);
    // reset d3.event.translate
    zoom.translate([x, y]);

    transform = 'translate(%dpx,%dpx) scale(%d,%d)'
      .replace('%d', x)
      .replace('%d', y)
      .replace('%d', scale)
      .replace('%d', scale);

    lastX = x;
    lastY = y;
    lastScale = scale;

    image
      .style('transform-origin', '0 0')
      .style('-moz-transform-origin', '0 0')
      .style('-webkit-transform-origin', '0 0')
      .style('transform', transform)
      .style('-moz-transform', transform)
      .style('-webkit-transform', transform);
  });

  frame.call(zoom);

  //----------------------------------------------------------------------------

  var draw = d3.select('#js-draw'),
      canvas = d3.select('#js-canvas');

  draw.on('click', function() {
    var event, offscreen, context, ctx;

    event = d3.event;

    offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;

    context = offscreen.getContext('2d');
    context.scale(lastScale, lastScale);
    context.drawImage(image.node(), 0, 0);

    ctx = canvas.node().getContext('2d');
    ctx.clearRect(0, 0, frameWidth, frameHeight);
    ctx.drawImage(
      offscreen,
      -lastX, -lastY, frameWidth, frameHeight,
      0, 0, frameWidth, frameHeight
    );
  });

}());
