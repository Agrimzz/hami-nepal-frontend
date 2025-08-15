import { createContext } from "react";

interface RouteContextType {
  routePath: string;
  setRoutePath: (path: string) => void;
}

const AltLayoutRouteContext = createContext<RouteContextType>({
  routePath: "",
  setRoutePath: () => {},
});

export default AltLayoutRouteContext;
