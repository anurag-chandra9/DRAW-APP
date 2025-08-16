import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        p-2 rounded-full border transition-colors
        ${activated ? "bg-red-500 text-white" : "bg-black text-white hover:bg-gray-700"}
      `}
    >
      {icon}
    </button>
  );
}
