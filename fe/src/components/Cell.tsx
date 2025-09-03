import type { MouseEventHandler } from 'react';

const Cell = ({
  value,
  onClick = () => {},
}: {
  value: string | null;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button className="border border-black" onClick={onClick}>
      {value}
    </button>
  );
};
export default Cell;
