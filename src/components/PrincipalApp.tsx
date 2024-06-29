import { Checkbox, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react"
import { CanvasRenderer } from "./CanvasRenderer"
import { useState } from "react"

interface Properties {
  qtyKey: string;
  canvasColumn: number;
  canvasWidth: number;
  canvasHeight: number;
  textSize: number;
  margin: number;
  padding: number;
}


export function PrincipalApp({json}:{json: Record<string, string>[]}){

  const [properties, setProperties] = useState<Properties>({
    canvasColumn: 2,
    canvasHeight: 180,
    canvasWidth: 400,
    margin: 6,
    padding: 10,
    textSize: 25,
    qtyKey: "",
  })

  const [repeatQty, setRepeatQty] = useState<boolean>(false)

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

  const newJson = json.map(data => ({...data, id: crypto.randomUUID()}))
  const columns = getColumns(json)
  console.log("columns",columns)
  console.log("json",json)

  const isValid = json.some(data => typeof data[properties.qtyKey] !== "number")

  return (
    <section className="grid md:grid-cols-2 grid-cols-1 w-full h-full">
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
          Usar columna de repetición
        </Checkbox>

        { repeatQty && (
          <Select
            label="Columna de repetición"
            placeholder="Select a column"
            labelPlacement="outside"
            selectedKeys={[properties.qtyKey]}
            className="max-w-xs"
            onChange={handleSelectionRepeatC}
          >
            {columns.map((column) => (
              <SelectItem key={column.key}>
                {column.label}
              </SelectItem>
            ))}
          </Select>
        ) }
      </div>
      <div>
        <CanvasRenderer 
          object={json[0]}
          columns={properties.canvasColumn}
          canvasWidth={properties.canvasWidth}
          canvasHeight={properties.canvasHeight}
          textSize={properties.textSize}
          margin={properties.margin}
          padding={properties.padding}
        />
      </div>
    </section>
  );
}