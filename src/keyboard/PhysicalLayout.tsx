import {
  Dispatch,
  SetStateAction,
  CSSProperties,
  PropsWithChildren,
  useRef,
} from "react";
import { Key } from "./Key";

export type KeyPosition = PropsWithChildren<{
  header?: string;
  width: number;
  height: number;
  x: number;
  y: number;
  r?: number;
  rx?: number;
  ry?: number;
}>;

export type LayoutZoom = number | "auto";

interface PhysicalLayoutProps {
  positions: Array<KeyPosition>;
  selectedPosition?: number;
  oneU?: number;
  hoverZoom?: boolean;
  zoom?: LayoutZoom;
  onPositionClicked?: Dispatch<SetStateAction<number | undefined>>;
}

interface PhysicalLayoutPositionLocation {
  x: number;
  y: number;
  r?: number;
  rx?: number;
  ry?: number;
}

function scalePosition(
  { x, y, r, rx, ry }: PhysicalLayoutPositionLocation,
  oneU: number,
): CSSProperties {
  const left = x * oneU;
  const top = y * oneU;
  let transformOrigin = undefined;
  let transform = undefined;

  if (r) {
    const transformX = ((rx || x) - x) * oneU;
    const transformY = ((ry || y) - y) * oneU;
    transformOrigin = `${transformX}px ${transformY}px`;
    transform = `rotate(${r}deg)`;
  }

  return {
    top,
    left,
    transformOrigin,
    transform,
    willChange: "transform",
  };
}

export const PhysicalLayout = ({
  positions,
  selectedPosition,
  oneU = 48,
  hoverZoom = true,
  onPositionClicked,
  ...props
}: PhysicalLayoutProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // TODO: Add a bit of padding for rotation when supported
  const rightMost = positions
    .map((k) => k.x + k.width)
    .reduce((a, b) => Math.max(a, b), 0);
  const bottomMost = positions
    .map((k) => k.y + k.height)
    .reduce((a, b) => Math.max(a, b), 0);

  const positionItems = positions.map((p, idx) => (
    <div
      key={idx}
      onClick={() =>
        onPositionClicked?.((prev: number | undefined) =>
          prev !== idx ? idx : undefined,
        )
      }
      className="absolute data-[zoomer=true]:hover:z-[1000] leading-[0]"
      data-zoomer={hoverZoom}
      style={scalePosition(p, oneU)}
    >
      <Key
        hoverZoom={hoverZoom}
        oneU={oneU}
        selected={idx === selectedPosition}
        {...p}
      />
    </div>
  ));

  return (
    <div
      className="relative"
      style={{
        height: bottomMost * oneU + "px",
        width: rightMost * oneU + "px",
      }}
      ref={ref}
      {...props}
    >
      {positionItems}
    </div>
  );
};
