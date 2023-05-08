export interface isTrip {
  flights: isFlight[];
  stays: isAirbnb[];
  activities: isActivity[];
  startDate: string;
  endDate: string;
  users: string[];
  creator: string[];
  name: string;
  _id: string;
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