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
  // Stores x & y coordinates of the mouse pointer
  var x_pos = 0;
  var y_pos = 0;
  // Stores top, left values (edge) of the element
  var x_elem = 0;
  var y_elem = 0;

  /**
   *
   * @param {HTMLDivElement} divElement
   * @param {string} w
   * @param {string} h
   * @return {HTMLDivElement}
   */
  var addDivToPage = function(divElement, w, h){
    var size = w + 'x' + h;
    var pos = localStorage.getItem('pc_' + size);
    var top = '10px';
    var left = '10px';
    if(pos){
      pos = pos.split('|');
      top = pos[0];
      left = pos[1];
    }

    var width = parseInt(left) + parseInt(w);
    var height = parseInt(top) + parseInt(h);
    if (width > window.screen.width){
      left = '10px';
    }
    if (height > window.screen.height){
      top = '10px';
    }

    divElement.style.position = 'absolute';
    divElement.style.overflow = 'auto';
    divElement.style.top = top;
    divElement.style.left = left;
    divElement.style.cursor = 'move';
    divElement.style.zIndex = '9999999';
    divElement.setAttribute('data-pc-type', 'overlay');
    divElement.setAttribute('data-top', parseInt(top));
    divElement.setAttribute('data-left', parseInt(left));
    divElement.setAttribute('data-size', size);

    return document.body.appendChild(divElement);
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

  /**
   *
   * @param {HTMLElement} el
   * @param {Number} top
   * @param {Number} left
   */
  var updatePosition = function(el, top, left){
    if (el) {
      top = parseInt(top);
      left = parseInt(left);
      top = (top < 0 ? 0 : top) + 'px';
      left = (left < 0 ? 0 : left) + 'px';

      el.style.top = top;
      el.style.left = left;
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
    updatePosition(selected, (y_pos - y_elem), (x_pos - x_elem));
  }

  var onTouchStart = function(e){
    e.preventDefault();
    var el = overlay;
    el.setAttribute('data-x', e.targetTouches[0].clientX);
    el.setAttribute('data-y', e.targetTouches[0].clientY);
    el.setAttribute('data-top', el.offsetTop);
    el.setAttribute('data-left', el.offsetLeft);
  };

  var onTouchEnd = function(e){
    e.preventDefault();
    overlay.setAttribute('data-top', overlay.offsetTop);
    overlay.setAttribute('data-left', overlay.offsetLeft);
  };

  var onTouchMove = function(e){
    e.preventDefault();
    var el = overlay;
    var touch = e.targetTouches[0];
    var deltaY = touch.clientY - parseInt(el.dataset.y);
    var deltaX = touch.clientX - parseInt(el.dataset.x);
    var top = parseFloat(el.dataset.top) + deltaY;
    var left = parseFloat(el.dataset.left) + deltaX;

    top = (top < 0 ? 0 : top) + 'px';
    left = (left < 0 ? 0 : left) + 'px';
    el.style.top = top;
    el.style.left = left;
  };

  /**
   * allow for finer positioning via up, down, left & right arrow keys
   *
   * @return {undefined}
   */
  var positionAlignment = function (e) {
    if (overlay && (e.keyCode >= 37 && e.keyCode <= 40)) {
      e.preventDefault();

      var top = overlay.offsetTop;
      var left = overlay.offsetLeft;

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

      updatePosition(overlay, top, left);
    }
  };

  /**
   *
   * @param {HTMLDivElement} divElement
   * @param {string} w
   * @param {string} h
   * @return {undefined}
   */
  window.__pc_draggable = function(divElement, w, h) {
    if (divElement && divElement.tagName === 'DIV') {
      overlay = addDivToPage(divElement, w, h);

      divElement.onmousedown = function() {
        _drag_init(this);
        return false;
      };

      document.addEventListener('keydown', positionAlignment);

      document.addEventListener('keyup', function(){
        divElement.style.opacity = 1;
      });

      document.addEventListener('mousemove', moveElement);

      // mobile handlers
      document.addEventListener('touchstart', onTouchStart, false);
      document.addEventListener('touchmove', onTouchMove, false);
      document.addEventListener('touchend', onTouchEnd, false);

      document.addEventListener('mouseup', function() {
        overlay.style.opacity = 1;
        selected = null;
      });

    }
  };

})();
