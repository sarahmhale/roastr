<script lang="ts">

  interface MouseCoordinate {
    x: number;
    y: number;
  }

  interface PathCoordinates {
    x: number,
    y: number,
    time: number,
  }

  import { onMount } from "svelte";

  const imgUrl =
    "https://firebasestorage.googleapis.com/v0/b/roastr.appspot.com/o/defaults%2Ftest_image.jpg?alt=media&token=5d40257d-9d40-4b03-a78c-84665c476c4f";

  let currentContext: CanvasRenderingContext2D | undefined;
  let currentCanvas: HTMLCanvasElement | undefined;

  let currentCoord: MouseCoordinate = { x: 0, y: 0 };
  let lastRenderedCoord: MouseCoordinate = { x: 0, y: 0 };
  let recordCoordinates = false;

  let currentLayer = 0;
  const paths: Array<Array<PathCoordinates>> = [];

  function clearAndRedraw() {
    const canvas = document.getElementById("display") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height); 


    for(const layer of paths) {
      let prevCoord;

      const newLayer = layer.filter((value, index, arr) => {
        return true; //return (index % 2 === 0)
      });

      for(let i = 2; i < newLayer.length; i += 2) {
        if(!prevCoord) {
          context.beginPath();
          //prevCoord = newLayer[0];
        } 

        let subCoord = newLayer[i - 1];
        let coord = newLayer[i];


        //context.moveTo(prevCoord.x, prevCoord.y);
        //context.lineTo(coord.x, coord.y);
        //context.bezierCurveTo(prevCoord.x, prevCoord.y, subCoord.x, subCoord.y, coord.x, coord.y);
        context.quadraticCurveTo(subCoord.x, subCoord.y, coord.x, coord.y);
        prevCoord = coord;
      }
      prevCoord = undefined;
      context.stroke();
      context.closePath();
    }
    
  };

  function calculateCanvasCoord(
    event: MouseEvent,
    canvas: HTMLCanvasElement
  ): MouseCoordinate {
    let mouse: MouseCoordinate = { x: 0, y: 0 };

    let bounds = canvas.getBoundingClientRect();

    //Stolen from https://stackoverflow.com/questions/43853119/javascript-wrong-mouse-position-when-drawing-on-canvas
    // get the mouse coordinates, subtract the canvas top left and any scrolling
    mouse.x = event.pageX - bounds.left - scrollX;
    mouse.y = event.pageY - bounds.top - scrollY;

    // first normalize the mouse coordinates from 0 to 1 (0,0) top left
    // off canvas and (1,1) bottom right by dividing by the bounds width and height
    mouse.x /= bounds.width;
    mouse.y /= bounds.height;

    // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution
    mouse.x *= canvas.width;
    mouse.y *= canvas.height;

    return mouse;
  }

  function shouldRenderNewCoords(oldCoord: MouseCoordinate, newCoord: MouseCoordinate): boolean {
    return !(oldCoord.x === newCoord.x && oldCoord.y === newCoord.y);
  }

  function mainLoop(time: number) {
    if (recordCoordinates && shouldRenderNewCoords(lastRenderedCoord, currentCoord)) {
      //currentContext.quadraticCurveTo(lastRenderedCoord.x, lastRenderedCoord.y, currentCoord.x, currentCoord.y);
      currentContext.moveTo(lastRenderedCoord.x, lastRenderedCoord.y);
      currentContext.lineTo(currentCoord.x, currentCoord.y);
      currentContext.stroke();
      lastRenderedCoord = currentCoord;

      paths[currentLayer].push({
        ...lastRenderedCoord,
        time,
      });
    }

    if (recordCoordinates) {
      requestAnimationFrame(mainLoop);
    }
  }

  function onMouseMove(event: MouseEvent) {
    if (recordCoordinates) {
      currentCoord = calculateCanvasCoord(event, currentCanvas);
    }
  }

  function onMouseDown(event: MouseEvent) {
    recordCoordinates = true;
    currentCanvas = document.getElementById("display") as HTMLCanvasElement;
    currentContext = currentCanvas.getContext("2d");
    currentContext.lineWidth = 3;
    currentContext.strokeStyle = "red"; // This path is green.

    const mouseCoords = calculateCanvasCoord(event, currentCanvas);
    currentCoord = mouseCoords;
    lastRenderedCoord = mouseCoords;
    currentContext.beginPath();
    currentContext.moveTo(mouseCoords.x, mouseCoords.y);

    paths.push([{
      ...mouseCoords,
      time: 0,
    }])

    requestAnimationFrame(mainLoop);
  }

  function onMouseUp(event: MouseEvent) {
    recordCoordinates = false;
    currentContext.closePath();
    currentContext = undefined;
    currentCanvas = undefined;
    currentLayer++;
    console.log(paths);
    clearAndRedraw();
  }

  onMount(() => {
    const background = document.getElementById("background-canvas") as HTMLCanvasElement;
    const canvas = document.getElementById("display") as HTMLCanvasElement;
    const context = background.getContext("2d");
    let image = new Image();
    image.src = imgUrl;

    background.width = image.width;
    background.height = image.height;
    canvas.width = image.width;
    canvas.height = image.height;

    image.onload = function () {
      context.drawImage(image, 0, 0, background.width, background.height);
    };
  });
</script>

<style>
  canvas {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
  }
  #display {
    background-color: transparent;
    z-index: 1;
  }
  #background-canvas {
    background-color: transparent;
    z-index: 0;
  }
  .canvas-wrapper {
    position: relative;
    height: 100vh;
    width: 100%;
  }
</style>


<div class="canvas-wrapper">
  <canvas
  on:mouseup={onMouseUp}
  on:mousedown={onMouseDown}
  on:mousemove={onMouseMove}
  id="display" />
  <canvas
    on:mouseup={onMouseUp}
    on:mousedown={onMouseDown}
    on:mousemove={onMouseMove}
    id="background-canvas" />
</div>

