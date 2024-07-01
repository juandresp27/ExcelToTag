import { Slider, SliderValue, Tooltip } from '@nextui-org/react';
import React, { useState } from 'react'
import { Properties } from '../models/general';

export function SliderComponent(
  { label, keyS, value, setValue, type }: 
  { label: string, keyS: string, value: number, setValue: (value: React.SetStateAction<Properties>) => void, type: 'Normal' | 'Steps'}
) {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  const handleChange = (value: SliderValue) => {
    if (isNaN(Number(value))) return;
    if (Array.isArray(value)) return;
    setValue(prop => ({
      ...prop,
      [keyS]: value
    }));
    setInputValue(value.toString());
  };

  if(type === "Steps"){
    return (
      <Slider
        size="md"
        step={1}
        color="secondary"
        label="Columns"
        showSteps={true} 
        maxValue={5} 
        minValue={1} 
        className="max-w-xs" 
        value={value}
        onChange={handleChange}
      />
    )
  }

  return (
    <Slider
      label={label}
      size="md"
      step={0.1} 
      maxValue={40} 
      minValue={5} 
      color="secondary"
      classNames={{
      base: "max-w-xs",
      label: "text-medium",
      }}
      // we extract the default children to render the input
      renderValue= {({...props}) => (
      <output {...props}>
          <Tooltip
          className="text-tiny text-default-500 rounded-md"
          content="Press Enter to confirm"
          placement="left"
          >
          <input
              className="px-1 py-0.5 w-12 text-right text-small text-default-700 font-medium bg-default-100 outline-none transition-colors rounded-small border-medium border-transparent hover:border-primary focus:border-primary"
              type="text"
              aria-label="Temperature value"
              value={inputValue}
              onChange={(e) => {
              const v = e.target.value;
              setInputValue(v);
              }}
              onKeyDown={(e) => {
              if (e.key === "Enter" && !isNaN(Number(inputValue))) {
                setValue(properties => ({
                  ...properties,
                  [keyS]: Number(inputValue)
                }))
              }
              }}
          />
          </Tooltip>
      </output>
      )}
      value={value}
      onChange={handleChange}
    />
  )
}

