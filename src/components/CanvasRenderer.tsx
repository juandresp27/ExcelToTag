import React, { useRef, useEffect } from 'react';

interface CanvasRendererProps {
  object: Record<string, string>;
  columns: number;
  canvasWidth: number;
  canvasHeight: number;
  textSize: number;
  margin: number; // Nuevo prop para el margen
  padding: number; // Nuevo prop para el padding entre conjuntos
}

interface TextPosition {
  key: string;
  value: string;
  x: number;
  y: number;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ object, columns, canvasWidth, canvasHeight, textSize, margin, padding }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const positionsRef = useRef<TextPosition[]>([]);
  const draggingRef = useRef<{ index: number | null, offsetX: number, offsetY: number }>({ index: null, offsetX: 0, offsetY: 0 });

  const resetPositions = () => {
    const entries = Object.entries(object);
    const columnWidth = (canvasWidth - 2 * margin) / columns;
    const rowHeight = textSize + padding; // Ajuste aquí

    positionsRef.current = entries.map(([key, value], index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      return {
        key,
        value,
        x: margin + column * columnWidth,
        y: margin + row * rowHeight + textSize // Ajuste aquí
      };
    });

    redrawCanvas();
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.font = `${textSize}px Arial`;
        positionsRef.current.forEach(({ key, value, x, y }) => {
          context.fillText(`${key}: ${value}`, x, y);
        });
      }
    }
  };

  useEffect(() => {
    resetPositions();
  }, [object, columns, canvasWidth, canvasHeight, textSize, margin, padding]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const foundIndex = positionsRef.current.findIndex(pos => {
        const textWidth = canvas.getContext('2d')!.measureText(`${pos.key}: ${pos.value}`).width;
        return x >= pos.x && x <= pos.x + textWidth && y >= pos.y - textSize && y <= pos.y;
      });

      if (foundIndex !== -1) {
        draggingRef.current = {
          index: foundIndex,
          offsetX: x - positionsRef.current[foundIndex].x,
          offsetY: y - positionsRef.current[foundIndex].y,
        };
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingRef.current.index !== null) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const index = draggingRef.current.index;
        positionsRef.current[index].x = x - draggingRef.current.offsetX;
        positionsRef.current[index].y = y - draggingRef.current.offsetY;

        redrawCanvas();
      }
    }
  };

  const handleMouseUp = () => {
    draggingRef.current.index = null;
  };

  return (
    <div>
      <button onClick={resetPositions}>Reset</button>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
};
