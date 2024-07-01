import { Button, Checkbox, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, getKeyValue } from "@nextui-org/react"
import { CanvasRenderer } from "./CanvasRenderer"
import { useState } from "react"
import { SliderComponent } from "./SliderComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Properties, TextPosition } from "../models/general";
import jsPDF from "jspdf";
import { convertCoordinatesToCm } from "../utils/canvas";


export function PrincipalApp({json}:{json: Record<string, string>[]}){

  const [properties, setProperties] = useState<Properties>({
    canvasColumn: 2,
    canvasHeight: 4,
    canvasWidth: 11,
    margin: 6,
    padding: 10,
    textSize: 25,
    qtyKey: "",
  })

  const [repeatQty, setRepeatQty] = useState<boolean>(false)
  const [touched, setTouched] = useState(false);

  const [position, setPosition] = useState<TextPosition[]>([]); // Posiciones

  const getColumns = (json: Array<Record<string, string>>) => {
    const keysSet = new Set<string>()
    json.forEach(data => {
      const keys = Object.keys(data)
      keys.forEach(key => key && keysSet.add(key))
    })
    return Array.from(keysSet).map(key => ({key, label: key}))
  }

  const handleSelectionRepeatC = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProperties(props => ({
      ...props,
      qtyKey: e.target.value
    }))
  }

  const handlePositionsChange = (newPositions: TextPosition[]) => {
    console.log("pos", newPositions)
    setPosition(newPositions)
  };

  const newJson = json.map(data => ({...data, id: crypto.randomUUID()}))
  const columns = getColumns(json)
  console.log("columns",columns)
  console.log("json",json)

  const isValid = json.every(data => !isNaN(parseFloat(data[properties.qtyKey])) && isFinite(Number(data[properties.qtyKey])))

  const generatePdf = () => {
    const doc = new jsPDF({
      unit: "cm",
      orientation: "landscape",
      format: [properties.canvasWidth, properties.canvasHeight],
    });

    doc.setFontSize(properties.textSize * 0.6)
    
    json.forEach(item => {
      doc.addPage()
      for(const [key] of Object.entries(item)) {
        const positionFound = position.find(pos => pos.key === key);
        if(!positionFound) continue;
        const {x, y} = convertCoordinatesToCm(properties.canvasWidth, properties.canvasHeight, positionFound.x, positionFound.y)
        const text = `${key}: ${item[key] ?? ""}`
        doc.text(text, x, y)
      }
    })

    doc.save("labels.pdf")
  }

  return (
    <section className="grid md:grid-cols-2 grid-cols-1 w-screen h-screen overflow-auto pb-4">
      <div className="col-span-1 px-6 py-2 flex flex-col gap-4">
        
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => <TableColumn 
              key={column.key} 
              >{column.label}</TableColumn>}
          </TableHeader>
          <TableBody items={newJson}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell 
                  
                  >{getKeyValue(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Checkbox isSelected={repeatQty} onValueChange={setRepeatQty}>
          <span>Use repeat column </span>
          <Tooltip content="Means that the rows will be repeat for the number in the column selected">
            <FontAwesomeIcon icon={faCircleInfo}/>
          </Tooltip>
        </Checkbox>

        { repeatQty && (
          <Select
            label="Repeat column"
            placeholder="Select a column"
            labelPlacement="outside"
            selectedKeys={[properties.qtyKey]}
            className="max-w-xs"
            onChange={handleSelectionRepeatC}
            errorMessage={isValid || !touched ? "" : "You must select a number column"}
            isInvalid={isValid || !touched ? false : true}
            onClose={() => setTouched(true)}
          >
            {columns.map((column) => (
              <SelectItem key={column.key}>
                {column.label}
              </SelectItem>
            ))}
          </Select>
        ) }
      </div>

      <div className="flex flex-col gap-6 px-4 ">
        <div className="w-full grid grid-cols-2 gap-2 gap-x-4 ">
          <SliderComponent 
            keyS="textSize"
            label="Text size"
            value={properties.textSize}
            setValue={setProperties}
            type="Normal"
          />

          <SliderComponent 
            keyS="padding"
            label="Padding"
            value={properties.padding}
            setValue={setProperties}
            type="Normal"
          />

          <SliderComponent 
            keyS="margin"
            label="Margin"
            value={properties.margin}
            setValue={setProperties}
            type="Normal"
          />

          <SliderComponent 
            keyS="canvasColumn"
            label="Columns"
            value={properties.canvasColumn}
            setValue={setProperties}
            type="Steps"
          />

          <Input 
            type="number" 
            label="Label width (cm)" 
            placeholder="Put width" 
            labelPlacement="outside"
            value={properties.canvasWidth.toString()}
            onValueChange={(e) => {
              setProperties(prop => ({
                ...prop,
                canvasWidth: Number(e)
              }))
            }}
          />
          <Input 
            type="number" 
            label="Label height (cm)" 
            placeholder="Put height" 
            labelPlacement="outside"
            value={properties.canvasHeight.toString()}
            onValueChange={(e) => {
              setProperties(prop => ({
                ...prop,
                canvasHeight: Number(e)
              }))
            }}
          />
        </div>
      
        <CanvasRenderer 
          object={json[0]}
          columns={properties.canvasColumn}
          canvasWidth={properties.canvasWidth}
          canvasHeight={properties.canvasHeight}
          textSize={properties.textSize}
          margin={properties.margin}
          padding={properties.padding}
          onPositionsChange={handlePositionsChange}
        />
      </div>
      <Button
        onClick={generatePdf}
      >PDF</Button>
    </section>
  );
}