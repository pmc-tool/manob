"use client";
import { Input, Tooltip } from "antd";
import { useRef, useState, useEffect } from "react";

export default function DraggableNumberInput({
  value,
  onChange,
  icon: Icon,
  tooltip, // new prop
  ...props
}: any) {
  const startX = useRef(0);
  const startValue = useRef(0);
  const dragging = useRef(false);

  const [internalValue, setInternalValue] = useState<number>(0);

  // sync internal state with external value
  useEffect(() => {
    if (value) {
      const num = parseInt(value.toString().replace(/px/g, "")) || 0;
      setInternalValue(num);
    }
  }, [value]);

  const handleMouseDown = (e: any) => {
    dragging.current = true;
    startX.current = e.clientX;
    startValue.current = internalValue;

    document.body.style.cursor = "ew-resize";

    const handleMove = (ev: any) => {
      if (!dragging.current) return;

      const delta = ev.clientX - startX.current;
      const newValue = Math.max(0, startValue.current + delta);

      setInternalValue(newValue);
      onChange(`${newValue}px`);
    };

    const handleUp = () => {
      dragging.current = false;
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const handleInputChange = (e: any) => {
    const num = parseInt(e.target.value.replace(/px/g, "")) || 0;
    setInternalValue(num);
    onChange(`${num}px`);
  };

  return (
    <div className="relative">
      <Input
        {...props}
        value={internalValue}
        onChange={handleInputChange}
        suffix="px"
        variant="filled"
        prefix={
          <Tooltip title={tooltip}>
            <span onMouseDown={handleMouseDown} className="cursor-ew-resize">
              {Icon && <Icon size={15} />}
            </span>
          </Tooltip>
        }
      />
    </div>
  );
}
