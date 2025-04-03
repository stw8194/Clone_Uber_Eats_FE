interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => (
  <button
    className={`mt-3 py-4 px-5 text-lg font-medium focus:outline-none text-white transition-colors ${
      canClick
        ? "bg-lime-600 hover:bg-lime-800"
        : "bg-gray-300 pointer-events-none"
    }`}
  >
    {loading ? "Loading..." : actionText}
  </button>
);
