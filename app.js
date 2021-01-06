//Learned about HTML5 Canvas from:
//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
//https://www.w3schools.com/graphics/canvas_intro.asp

function painter() {
  //setting the canvas
  const canvas = document.getElementById('paintCanvas');
  const ctx = canvas.getContext('2d');

  //stetting state variables
  let paintState = {
    brushColor: '#000000',
    brushSize: '11',
    isDrawing: false,
    mousePos: { x: 0, y: 0 },
  };

  //destructor
  let { brushColor, brushSize, isDrawing, mousePos } = paintState;

  //listener for brush size
  const onBrushSizeChange = (event) => {
    const size = event.target.value;
    brushSize = size;
    document.getElementById(`brushSizeVal`).innerHTML = size; //updates UI
  };

  //listener for brush color
  const onBrushColorChange = (event) => {
    const color = event.target.value;
    brushColor = color;
    document.getElementById(`brushColorVal`).innerHTML = color; //updates UI
  };

  //erase canvas content
  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  //listener for background color
  const onBgChange = (event) => {
    clearCanvas();
    ctx.fillStyle = event.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill(); // creates new rectangle with the bgColor value in the size of the canvas
  };

  //loading image from user computer files
  //https://www.webtrickshome.com/faq/how-to-display-uploaded-image-in-html-using-javascript
  const loadImage = () => {
    const file = document.getElementById('fileLoadBtn').files[0]; //getting file data from input
    const image = new Image(); //create new html img element
    image.src = URL.createObjectURL(file); //create a file url string and assign it to the img src tag
    image.onload = () => ctx.drawImage(image, 0, 0); //when image finished to load it will be draw on the canvas at the top left corner
  };

  //save canvas to user computer
  //https://weworkweplay.com/play/saving-html5-canvas-as-image/
  const saveImage = (event) => {
    const dataURL = canvas.toDataURL('image/png'); //creates image url from the canvas
    event.target.href = dataURL; //assign the url to href tag of the button
  };

  //update mouse location
  const updateMouseCoordinates = (event) => {
    //reduce the canvas offsets position to get the mouse coordinates relative to the canvas
    mousePos.x = event.clientX - canvas.offsetLeft; //horizontal mouse coordinate
    mousePos.y = event.clientY - canvas.offsetTop; //vertical mouse coordinate
    if (
      // validate mouse inside the canvas
      mousePos.x < 0 ||
      mousePos.x > canvas.width ||
      mousePos.y < 0 ||
      mousePos.y > canvas.height
    ) {
      mousePos.x = 0;
      mousePos.y = 0;
    }
    document.getElementById(
      'mousePos'
    ).innerHTML = `${mousePos.x},${mousePos.y}`; //updates UI
  };

  //draw with mouse on canvas
  const draw = (event) => {
    ctx.beginPath(); //reset line path
    ctx.moveTo(mousePos.x, mousePos.y); //set the start point of the line
    updateMouseCoordinates(event); //force updating mouse coordinates
    ctx.lineTo(mousePos.x, mousePos.y); //set the end point of the line
    ctx.strokeStyle = brushColor; //set brush color
    ctx.lineWidth = brushSize; //set brush size
    ctx.stroke(); //draw the line
  };

  //listener for mouse movement
  const onMouseMove = (event) => {
    isDrawing ? draw(event) : updateMouseCoordinates(event); // if drawing invoke draw function, otherwise just update mouse coordinates
  };

  //listener for mouse down
  const onMousedown = () => {
    isDrawing = true;
  };

  //listener for mouse up
  const onMouseup = () => {
    isDrawing = false;
  };

  //attaching listeners to HTML elements
  document
    .getElementById('brushColor')
    .addEventListener('change', (event) => onBrushColorChange(event));
  document
    .getElementById('brushSize')
    .addEventListener('change', (event) => onBrushSizeChange(event));
  document
    .getElementById('bgColor')
    .addEventListener('change', (event) => onBgChange(event));
  document.getElementById('clearBtn').addEventListener('click', clearCanvas);
  document
    .getElementById('saveBtn')
    .addEventListener('click', (event) => saveImage(event));
  document.getElementById('fileLoadBtn').addEventListener('change', loadImage);
  canvas.addEventListener('mousemove', (event) => onMouseMove(event));
  canvas.addEventListener('mousedown', onMousedown);
  canvas.addEventListener('mouseup', onMouseup);
}
painter(); //invokes the painter
