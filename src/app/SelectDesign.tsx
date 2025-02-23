import { RefObject, useRef, useState, useEffect } from "react";
import { DraggableTextDiv, DraggableContainerDiv } from "./DraggableDiv";
import qr from "qr.js";

interface DesignState {
  verifyURL: string;
  name: {
    value: string;
    x: number;
    y: number;
    size: number;
  };
  qr: {
    code: boolean[][];
    cellSize: number;
    x: number;
    y: number;
  };
}

function createDesignState(verifyURL: string, name: string): DesignState {
  return {
    verifyURL,
    name: {
      value: name,
      x: 1080 / 2,
      y: 720 / 2,
      size: 50,
    },
    qr: {
      code: qr(verifyURL).modules,
      cellSize: 2,
      x: 10,
      y: 10,
    },
  };
}

function paintQRCode(ctx: CanvasRenderingContext2D, state: DesignState) {
  const size = state.qr.cellSize;
  const code = state.qr.code;

  ctx.fillStyle = "#000";
  let x = state.qr.x;
  for (const row of code) {
    let y = state.qr.y;
    for (const col of row) {
      if (col) ctx.fillRect(x, y, size, size);
      y += size;
    }
    x += size;
  }
}

function paintName(ctx: CanvasRenderingContext2D, state: DesignState) {
  ctx.font = "50px Arial";
  ctx.fillText(state.name.value, state.name.x, state.name.size + state.name.y);
}

export function SelectDesign({ background, verifyURL, name }) {
  const [state, setState] = useState(createDesignState(verifyURL, name));
  const imgRef: RefObject<HTMLImageElement | null> = useRef(null);
  const canvas: RefObject<HTMLCanvasElement | null> = useRef(null);

  useEffect(() => {
    if (!canvas.current || !imgRef.current) return;

    imgRef.current.onload = () => {
      canvas.current.height = imgRef.current.height;
      canvas.current.width = imgRef.current.width;
      imgRef.current.onload = () => {};

      setState({ ...state });
    }
  }, []);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || !canvas.current) return;
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);

    paintQRCode(ctx, state);
  }, [state]);

  function handleNameDragUpdate(x: number, y: number) {
    setState({ ...state, name: { ...state.name, x, y } });
  }
  function handleQRCodeDragUpdate(x: number, y: number) {
    setState({ ...state, qr: { ...state.qr, x, y } });
  }

  function downloadCanvas() {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || !canvas.current) return;

    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    ctx.drawImage(imgRef.current, 0, 0);
    paintName(ctx, state);
    paintQRCode(ctx, state);

    const a = document.createElement("a");
    a.download = "certificate.jpg";
    a.href = String(canvas.current?.toDataURL("image/jpg"));
    a.click();

    setState({ ...state });
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <button onClick={downloadCanvas}> Download </button>
      <label> QR Code Size: </label>
      <input
        type="number"
        min="1"
        max="5"
        value={state.qr.cellSize}
        onChange={(e) =>
          setState({
            ...state,
            qr: { ...state.qr, cellSize: Number(e.target.value) },
          })
        }
      />

      <div className="relative">
        <img style={{ opacity: 1 }} ref={imgRef} src={URL.createObjectURL(background)} alt="Background Image" />
        <canvas
          className="absolute border border-black"
          style={{ top: 0, left: 0 }}
          ref={canvas}
        ></canvas>
        <DraggableTextDiv
          name={state.name.value}
          size={state.name.size}
          initX={state.name.x}
          initY={state.name.y}
          onDrag={handleNameDragUpdate}
        />
        <DraggableContainerDiv
          height={state.qr.cellSize * state.qr.code.length}
          width={state.qr.cellSize * state.qr.code.length}
          initX={state.qr.x}
          initY={state.qr.y}
          onDrag={handleQRCodeDragUpdate}
        />
      </div>
    </div>
  );
}
