export interface IFlight {
  itineraryId: string;
  price: Price;
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

export interface Price {
  amount: Number;
}