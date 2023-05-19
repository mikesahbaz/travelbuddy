import db from '../database';
import { Document, Schema } from 'mongoose';

interface Leg {
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

interface Price {
  amount: Number;
}

const LegSchema: Schema = new Schema ({
  carrier: {
    name: String
  },
  origin: {
    display_code: String
  },
  destination: {
    display_code: String
  },
  departure: Date,
  arrival: Date,
  duration: Number,
});

const PriceSchema: Schema = new Schema ({
  amount: Number,
})

export interface IFlight {
  itineraryId: string;
  price: Price;
  legs: [Leg];
}

export interface IFlightModel extends IFlight, Document {};

const FlightSchema: Schema = new Schema (
  {
    itineraryId: {
      type: String,
      required: true,
    },
    price: {
      type: PriceSchema,
    },
    legs: {
      type: [LegSchema],
    }
  },
  {
    versionKey: false,
  }
);
export { FlightSchema };

const Flight = db.model<IFlightModel>('Flight', FlightSchema);
export default Flight;
