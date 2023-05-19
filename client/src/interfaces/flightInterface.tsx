export interface FlightForm {
  itineraryId: string,
  price: number,
  legs: [ILeg]
}

export interface IFlight {
  itineraryId: string;
  price: number;
  legs: [ILeg];
}

export interface ILeg {
  carrier: {
    name: String;
  };
  origin: {
    display_code: String;
  };
  destination: {
    display_code: String;
  };
  departure: Date;
  arrival: Date;
  duration: Number;
}
