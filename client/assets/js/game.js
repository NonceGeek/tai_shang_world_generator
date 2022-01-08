window.onload = function () {
  var oDiv = document.getElementById('moving-block');
  var map = document.querySelector('#map');
  var wrapper = document.querySelector('#map-container');

  const stepLength = 2.5;

  // move moving-block when possible
  const move = (oDiv, direction, stepLength) => {
    if (willCrossBorder(oDiv, map, direction, stepLength)) {
      return;
    }

    const style = oDiv.style;
    const currentPosition = getCoordinate(oDiv, stepLength);

    if (willCollide(currentPosition, direction)) {
      return;
    }

    switch (direction) {
      case 'left':
        style.left = parseFloat(style.left) - stepLength + 'vw';
        break;
      case 'top':
        style.top = parseFloat(style.top) - stepLength + 'vw';
        scrollIfNeeded(oDiv, wrapper, 'top');
        break;
      case 'right':
        style.left = parseFloat(style.left) + stepLength + 'vw';
        break;
      case 'bottom':
        style.top = parseFloat(style.top) + stepLength + 'vw';
        scrollIfNeeded(oDiv, wrapper, 'bottom');
        break;
      default:
        break;
    }
  };

  document.onkeydown = function (ev) {
    var ev = ev || event;
    var keyCode = ev.keyCode;

    switch (keyCode) {
      case 37:
        ev.preventDefault();
        left = true;
        move(oDiv, 'left', stepLength);
        break;
      case 38:
        ev.preventDefault();
        top = true;
        move(oDiv, 'top', stepLength);
        break;
      case 39:
        ev.preventDefault();
        right = true;
        move(oDiv, 'right', stepLength);
        break;
      case 40:
        ev.preventDefault();
        bottom = true;
        move(oDiv, 'bottom', stepLength);
        break;
      default:
        ev.preventDefault();
    }
  };

  document.onkeyup = function (ev) {
    var ev = ev || event;
    var keyCode = ev.keyCode;

    switch (keyCode) {
      case 37:
        ev.preventDefault();
        left = false;
        break;
      case 38:
        ev.preventDefault();
        top = false;
        break;
      case 39:
        ev.preventDefault();
        right = false;
        break;
      case 40:
        ev.preventDefault();
        bottom = false;
        break;
      default:
        ev.preventDefault();
    }
  };

  // check if moving-block will be out of map
  const willCrossBorder = (oDiv, map, direction, stepLength) => {
    if (direction === 'left') {
      if (oDiv.offsetLeft - stepLength < 0) {
        return true;
      }
      return false;
    } else if (direction === 'right') {
      if (oDiv.offsetLeft + oDiv.clientWidth + stepLength > map.clientWidth) {
        return true;
      }
      return false;
    } else if (direction === 'top') {
      if (oDiv.offsetTop - stepLength < 0) {
        return true;
      }
      return false;
    } else if (direction === 'bottom') {
      if (oDiv.offsetTop + oDiv.clientHeight + stepLength > map.clientHeight) {
        return true;
      }
      return false;
    }
  };

  const scrollSmoothly = (scrollLength, scrollStep) => {
    const scrollInterval = setInterval(() => {
      wrapper.scrollBy(0, scrollStep);
      scrollLength -= scrollStep;
      if (scrollLength === 0) {
        clearInterval(scrollInterval);
      }
    });
  };

  // scroll map when part of moving-block is out of wrapper
  const scrollIfNeeded = (oDiv, wrapper, direction) => {
    const scrollLength = parseInt(wrapper.clientHeight / 3);
    if (
      direction === 'bottom' &&
      oDiv.getBoundingClientRect().bottom >
        wrapper.getBoundingClientRect().bottom
    ) {
      scrollSmoothly(scrollLength, 1);
    } else if (
      direction === 'top' &&
      oDiv.getBoundingClientRect().top < wrapper.getBoundingClientRect().top
    ) {
      scrollSmoothly(-scrollLength, -1);
    }
  };

  const getCoordinate = (oDiv, stepLength) => {
    const x = parseFloat(oDiv.style.top) / stepLength;
    const y = parseFloat(oDiv.style.left) / stepLength;
    
    return { x, y };
  }

  const willCollide = (currentPosition, direction) => {
    let { x, y } = currentPosition;

    if (direction === 'left') {
      y -= 1;
    } else if (direction === 'right') {
      y += 1;
    } else if (direction === 'top') {
      x -= 1;
    } else if (direction === 'bottom') {
      x += 1;
    }

    return document
      .querySelectorAll('.map-row')[x]
      .children.item(y)
      .classList.contains('unwalkable')
  }
};
