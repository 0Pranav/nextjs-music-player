"use client"
import * as RadixSlider from "@radix-ui/react-slider"

interface SliderProps {
    value?: number,
    onChange: (value: number) => void
}

const Silder: React.FC<SliderProps> = ({ value = 1, onChange }) => {

    const handleChange = (newValues: number[]) => {
        onChange?.(newValues[0])
    }

    return <RadixSlider.Root className="relative flex items-center select-none touch-none w-full h-10" defaultValue={[1]} max={1}value={[value]} onValueChange={handleChange} step={0.1} aria-label="Volume">
        <RadixSlider.Track className="bg-neutral-500 relative grow rounded-full h-[3px] ">
            <RadixSlider.Range className="absolute bg-white rounded-full h-full " />
        </RadixSlider.Track>
    </RadixSlider.Root>
}

export default Silder
