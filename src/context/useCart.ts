import { useContext } from "react";
import { CartContext } from "./cartContextValue";

export const useCart = () => useContext(CartContext);
