import React, { createContext, ReactNode, useState } from "react";
import { BusType } from "../types/Bus.type";

type BusContextType = {
  buses: BusType[];
  setBuses: (buses: BusType[]) => void;
  markBus: (id: number) => void;
};

const defaultBusContext: BusContextType = {
  buses: [],
  setBuses: () => {},
  markBus: () => {},
};

const BusContext = createContext<BusContextType>(defaultBusContext);

type Props = {
  children?: React.ReactNode;
};

/**
 * BusProvider is a React Context that is used so multiple pages have access to the bus state,
 * so once the checklist of cleaning location is checked for each bus,
 * the bus can be marked clean from the Buspage and the changes will be reflected in the Dashboard page.
 *
 * @returns JSX.Element
 */

function BusProvider({ children }: Props) {
  const [buses, setBuses] = useState<BusType[]>([]);

  const markBus = (id: number) => {
    setBuses((prevBuses) =>
      prevBuses.map((bus) =>
        bus.id === id ? { ...bus, isMarked: !bus.isMarked } : bus
      )
    );
  };

  return (
    <BusContext.Provider value={{ buses, setBuses, markBus }}>
      {children}
    </BusContext.Provider>
  );
}

const useBuses = () => {
  const context = React.useContext(BusContext);
  if (!context) {
    throw new Error("useBuses must be used within a BusProvider");
  }
  return context;
};

export { BusProvider, useBuses };
