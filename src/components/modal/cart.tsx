// import { useEffect, useRef } from "react";

// interface ICartProps {
//   restaurantName: string;
//   dish: string;
//   setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export const Cart: React.FC<ICartProps> = ({
//   restaurantName,
//   setIsCartOpen,
// }) => {
//   const modalRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
//         setIsCartOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div
//       ref={modalRef}
//       className="fixed right-15 mt-2 w-80 bg-gray-100 p-4 rounded shadow-xl z-50 origin-top-right transform scale-95 opacity-0 animate-dropdown"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="flex flex-col space-y-2">
//         <div className="text-3xl font-semibold">{restaurantName}</div>
//         {/* <div>{dish}</div> */}
//         <button className="bg-lime-600 text-white px-4 py-2 rounded w-full">
//           CheckOut
//         </button>
//       </div>
//     </div>
//   );
// };
