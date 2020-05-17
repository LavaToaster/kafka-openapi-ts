export enum Status {
  Happy = "Happy",
  Sad = "Sad",
}

export interface User {
  id: number;
  email: string;
  name: string;
  status?: Status;
  phoneNumbers: string[];
}
