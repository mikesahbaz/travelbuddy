export interface FlightForm {
  itineraryId: string,
  price: number,
  legs: [Leg]
}

export interface IFlight {
  itineraryId: string;
  price: number;
  legs: [Leg];
}

export interface Leg {
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
