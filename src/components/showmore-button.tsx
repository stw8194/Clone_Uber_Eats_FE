import { MouseEventHandler } from "react";

interface IButtonProps {
  page: number;
  totalPages: number;
  onClick: MouseEventHandler;
}

export const ShowMoreButton: React.FC<IButtonProps> = ({
  page,
  totalPages,
  onClick,
}) => {
  return (
    <>
      {page !== totalPages && (
        <button
          className={
            "inline-flex items-center justify-center my-3 py-3 px-4 text-lg font-semibold focus:outline-none rounded-lg text-white transition-colors bg-black hover:bg-gray-900"
          }
          onClick={onClick}
        >
          Show more
        </button>
      )}
    </>
  );
};
