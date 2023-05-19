import { IFlight } from './flightInterface';
import { IStay } from './stayInterface';
import { IActivity } from './activityInterface';

export interface TripForm {
  name: string;
  startDate: string;
  endDate: string;
  creator: string;
  travelers: string[];
}

export interface ITrip {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  creator: string;
  travelers: string[];
  flights: IFlight[];
  stays: IStay[];
  activities: IActivity[];
  photoUrl: string;
}
