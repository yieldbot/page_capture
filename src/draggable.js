//http://jsfiddle.net/tovic/Xcb8d/light/

(function() {
  var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

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
   * Will be called when user dragging an element
   *
   * @param e
   * @private
   */
  function _move_elem(e) {
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    if (selected !== null) {
      selected.style.left = (x_pos - x_elem) + 'px';
      selected.style.top = (y_pos - y_elem) + 'px';
    }
  }

  var positionAlignment = function (){
    var overlay = null;

    document.body.onmousemove = function (e) {
      overlay = null;
      if (e.target.dataset.pcType) {
        overlay = e.target;
        localStorage.setItem('pc_' + overlay.dataset.pcId, overlay.offsetTop + 'px|' + overlay.offsetLeft+'px');
      }
    };

    document.body.onkeydown = function (e) {
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

        top = (top < 0 ? 0 : top) + 'px';
        left = (left < 0 ? 0 : left) + 'px';

        overlay.style.top = top;
        overlay.style.left = left;
        localStorage.setItem('pc_' + overlay.dataset.pcId, top + '|' + left);
      }
    };
  };

  window.draggable = function(img) {
    if (img && img.tagName === 'IMG') {
      var size = img.width + 'x' + img.height;

      img.style.cursor = 'move';
      img.setAttribute('data-pc-type', 'overlay');
      img.setAttribute('data-pc-id', size);

      img.onmousedown = function() {
        _drag_init(this);
        return false;
      };

      document.onmousemove = _move_elem;
      document.onmouseup = function() {
        selected = null;
      };

      positionAlignment();
    }
  };

})();
