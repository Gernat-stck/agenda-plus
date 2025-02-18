export type Appointment = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

export interface EventInteractionArgs<T> {
  event: T;
  start: Date;
  end: Date;
}
