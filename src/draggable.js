/**
 * page_capture
 *
 * draggable portion copied from http://jsfiddle.net/tovic/Xcb8d/light/
 *
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

(function() {
  // Object of the element to be moved
  var selected = null;
  var overlay = null;
  var overlayImg = null;
  // Stores x & y coordinates of the mouse pointer
  var x_pos = 0;
  var y_pos = 0;
  // Stores top, left values (edge) of the element
  var x_elem = 0;
  var y_elem = 0;

  var addImageToPage = function(img){
    var size = img.width + 'x' + img.height;
    var pos = localStorage.getItem('pc_' + size);
    var top = '10px';
    var left = '10px';
    if(pos){
      pos = pos.split('|');
      top = pos[0];
      left = pos[1];
    }

    var w = parseInt(left) + parseInt(img.width);
    var h = parseInt(top) + parseInt(img.height);
    if (w > window.screen.width){
      left = '10px';
    }
    if (h > window.screen.height){
      top = '10px';
    }

    img.style.position = 'absolute';
    img.style.top = top;
    img.style.left = left;
    img.style.zIndex = '99999';
    img.setAttribute('data-top', parseInt(top));
    img.setAttribute('data-left', parseInt(left));

    document.body.appendChild(img);
  };

  /**
   * Will be called when user starts dragging an element
   *
   * @param elem
   * @private
   */
  function _drag_init(elem) {
    // Store the object of the element which needs to be moved
    selected = elem;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
  }

  var updatePosition = function(el, top, left){
    if (el) {
      top = parseInt(top);
      left = parseInt(left);
      el.style.top = top + 'px';
      el.style.left = left + 'px';
      el.style.opacity = 0.5;
      el.setAttribute('data-top', top);
      el.setAttribute('data-left', left);
      localStorage.setItem('pc_' + el.dataset.size, top + 'px|' + left + 'px');
    }
  };

  /**
   * Will be called when user dragging an element
   *
   * @param e
   * @private
   */
  function moveElement(e) {
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    overlayImg = null;
    if (e.target.dataset.pcType) {
      overlayImg = e.target;
    }
    updatePosition(selected, (y_pos - y_elem), (x_pos - x_elem));
  }

  /**
   * allow for finer positioning via up, down, left & right arrow keys
   *
   * @return {undefined}
   */
  var positionAlignment = function (e) {
    if (overlayImg && (e.keyCode >= 37 && e.keyCode <= 40)) {
      e.preventDefault();

      var top = overlayImg.offsetTop;
      var left = overlayImg.offsetLeft;

      // up
      if (e.keyCode === 38) {
        top--;
      }
      // right
      else if (e.keyCode === 39) {
        left++;
      }
      // down
      else if (e.keyCode === 40) {
        top++;
      }
      // left
      else if (e.keyCode === 37) {
        left--;
      }

      top = (top < 0 ? 0 : top) + 'px';
      left = (left < 0 ? 0 : left) + 'px';
      updatePosition(overlayImg, top, left);
    }
  };

  /**
   *
   * @param {HTMLImageElement} img
   * #return {undefined}
   */
  window.draggable = function(img) {
    if (img && img.tagName === 'IMG') {
      addImageToPage(img);
      overlay = img;

      var size = img.width + 'x' + img.height;

      img.style.cursor = 'move';
      img.setAttribute('data-pc-type', 'overlay');
      img.setAttribute('data-size', size);
      img.setAttribute('data-width', img.width);
      img.setAttribute('data-height', img.height);

      img.onmousedown = function() {
        _drag_init(this);
        return false;
      };

      document.addEventListener('keydown', positionAlignment);

      document.addEventListener('keyup', function(){
        img.style.opacity = 1;
      });

      document.addEventListener('mousemove', moveElement);

      document.addEventListener('mouseup', function() {
        overlay.style.opacity = 1;
        selected = null;
      });

    }
  };

})();
