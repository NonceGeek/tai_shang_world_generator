const drawOriginalMap = () => {
  let map = document.getElementById('map');
  let row = document.createElement('DIV');
  row.classList.add('map-row');
  row.classList.add('flex');
  let block = document.createElement('DIV');
  block.classList.add('map-block');
  // 32 is a fixed number for column number
  for (let i = 0; i < 32; i++) {
    row.appendChild(block.cloneNode(true));
  }
  // 25 is a changeable number for row number
  for (let i = 0; i < 24; i++) {
    map.appendChild(row.cloneNode(true));
  }
};

document.addEventListener('DOMContentLoaded', function () {
  drawOriginalMap();
});
