import { IconButton, Tooltip } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function OrderButtons({ label, index, count, disabled, onMove }: {
  label: string; index: number; count: number; disabled: boolean; onMove: (direction: -1 | 1) => void;
}) {
  return <>
    <Tooltip title="Move up"><span><IconButton aria-label={`Move ${label} up`} disabled={disabled || index === 0} onClick={() => onMove(-1)}><ArrowUpwardIcon /></IconButton></span></Tooltip>
    <Tooltip title="Move down"><span><IconButton aria-label={`Move ${label} down`} disabled={disabled || index === count - 1} onClick={() => onMove(1)}><ArrowDownwardIcon /></IconButton></span></Tooltip>
  </>;
}
