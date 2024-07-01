
export const MAX_WIDTH = 500; //PX
export const MAX_HEIGHT = 250; //PX

export const calculateMCD = (a: number, b: number) => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export const isFloat = (num: number) => !Number.isInteger(num);

export const reductFraction = (numerador: number, denominador: number) =>  {
  if (isFloat(numerador) || isFloat(denominador)) {
      return [numerador, denominador];
  } else {
      const mcd = calculateMCD(numerador, denominador);
      return [numerador / mcd, denominador / mcd];
  }
}

export const calculateSize = (widthCm: number, heightCm: number, maxWidthPx: number, maxHeightPx: number) => {
  let newWidth = maxWidthPx;
  let newHeight = (heightCm * maxWidthPx) / widthCm;
  if(newHeight > maxHeightPx){
    newHeight = maxHeightPx;
    newWidth = (widthCm * maxHeightPx) / heightCm;
  }
  return [newWidth, newHeight]
}

export const convertCoordinatesToCm = (widthCm: number, heightCm: number, x: number, y: number) => {
  const [widthInPx, heightInPx] = calculateSize(widthCm, heightCm, MAX_WIDTH, MAX_HEIGHT);
  const xInCm = (widthCm * x) / widthInPx;
  const yInCm = (heightCm * y) / heightInPx;
  return ({x: xInCm, y: yInCm})
}