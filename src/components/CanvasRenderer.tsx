import React, { useRef, useEffect, useMemo } from 'react';
import { TextPosition } from '../models/general';
import { MAX_HEIGHT, MAX_WIDTH, calculateSize, calculateTextSize } from '../utils/canvas';
import { Button } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

interface CanvasRendererProps {
  object: Record<string, string>;
  columns: number;
  canvasWidth: number;
  canvasHeight: number;
  textSize: number;
  margin: number;
  padding: number;
  onPositionsChange: (positions: TextPosition[]) => void; 
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ object, columns, canvasWidth, canvasHeight, textSize, margin, padding, onPositionsChange }) => {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const positionsRef = useRef<TextPosition[]>([]);
  const draggingRef = useRef<{ index: number | null, offsetX: number, offsetY: number }>({ index: null, offsetX: 0, offsetY: 0 });


  const [newWidth, newHeight] = useMemo(
    () => calculateSize(canvasWidth, canvasHeight, MAX_WIDTH, MAX_HEIGHT),
    [canvasWidth, canvasHeight]
  )

  const text = useMemo(
    () => calculateTextSize(canvasWidth, newWidth, textSize),
    [canvasWidth, newWidth, textSize]
  )

  const resetPositions = () => {
    const entries = Object.entries(object);
    const columnWidth = (newWidth - 2 * margin) / columns;
    const rowHeight = text + padding; 

    positionsRef.current = entries.map(([key, value], index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      return {
        key,
        value,
        x: margin + column * columnWidth,
        y: margin + row * rowHeight + text 
      };
    });

    onPositionsChange(positionsRef.current);
    redrawCanvas();
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, newWidth, newHeight);
        context.fillStyle="white"
        context.fillRect(0, 0, newWidth, newHeight);
        context.font = `${text}pt Arial`;
        context.fillStyle="black"
        positionsRef.current.forEach(({ key, value, x, y }) => {
          context.fillText(`${key}: ${value}`, x, y);
        });
      }
    }
  };

  useEffect(() => {
    resetPositions();
  }, [object, columns, canvasWidth, canvasHeight, text, margin, padding]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const foundIndex = positionsRef.current.findIndex(pos => {
        const textWidth = canvas.getContext('2d')!.measureText(`${pos.key}: ${pos.value}`).width;
        return x >= pos.x && x <= pos.x + textWidth && y >= pos.y - text && y <= pos.y;
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

        onPositionsChange(positionsRef.current); 

        redrawCanvas();
      }
    }
  };

  const handleMouseUp = () => {
    draggingRef.current.index = null;
  };

  return (
    <div className='w-fit'>
      <div className='flex justify-between py-1 items-center'>
        <span className='font-semibold'>Preview:</span>
        <Button isIconOnly onClick={resetPositions} variant="flat">
          <FontAwesomeIcon icon={faArrowsRotate}/>
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        width={newWidth}
        height={newHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
};
