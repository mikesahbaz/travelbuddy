export interface TripForm {
  name: string;
  startDate: string;
  endDate: string;
  creator: string;
  travelers: string[];
}

export interface isTrip {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  creator: string[];
  travelers: string[];
  flights: isFlight[];
  stays: isAirbnb[];
  activities: isActivity[];
  photoUrl: string;
};


export interface isFlight extends Document {
  itineraryId: string;
  entityId?: string;
  lng?: string;
  lat?: string;
}

export interface isAirbnb extends Document {
  propertyId: number;
};


export interface isActivity extends Document {
  poiName: string;
  poiType: string;
  poiTypeCategory: string;
  poiTypeLocale: string;
};

export interface isUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  trips: string[];
};

export interface ILeg {
  origin: {
    display_code: String;
  };
  destination: {
    display_code: String;
  };
  departure: Date;
}

export interface IActivity {
  entityId: string;
  poiName: string;
  poiType: string;
  poiTypeCategory: string;
  poiTypeLocale: string;
};

// export interface IStay extends Document {
//   propertyId: number;
// };