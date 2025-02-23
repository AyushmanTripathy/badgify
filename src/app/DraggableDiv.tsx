import { forwardRef, useEffect, useRef } from "react";

const DraggableDiv = forwardRef(({ initX, initY, onDrag }, ref) => {
  let startX: number = initX,
    startY: number = initY;

  function handleDragStart(e: MouseEvent) {
    startX = e.clientX;
    startY = e.clientY;
  }

  function handleDragEnd(e: MouseEvent) {
    const ele = ref.current;
    if (!ele) return;

    const curr = ele.getBoundingClientRect();
    const parent = ele.parentElement?.getBoundingClientRect();
    if (!parent || !curr) return;

    const bound = (x: number, y: number) =>
      Math.floor(Math.max(0, Math.min(y, x)));

    const x = bound(
      curr.x + (e.clientX - startX) - parent.x,
      parent.width - curr.width
    );
    const y = bound(
      curr.y + (e.clientY - startY) - parent.y,
      parent.height - curr.height
    );
    ele.style.top = y + "px";
    ele.style.left = x + "px";

    onDrag(x, y);
  }

  return (
    <div
      className="absolute"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ top: initY, left: initX, background: "traparent" }}
      ref={ref}
    ></div>
  );
});

export function DraggableContainerDiv({ height, width, initX, initY, onDrag }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ele = ref.current;
    if (!ele) return;

    ele.style.height = height + "px";
    ele.style.width = height + "px";
  }, [height, width]);

  return <DraggableDiv ref={ref} initX={initX} initY={initY} onDrag={onDrag} />;
}

export function DraggableTextDiv({ name, size, initX, initY, onDrag }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ele = ref.current;
    if (!ele) return;

    ele.innerText = name;
    ele.style.fontSize = size + "px";
  }, []);

  return <DraggableDiv ref={ref} initX={initX} initY={initY} onDrag={onDrag} />;
}
