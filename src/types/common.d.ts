type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

type Address = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
  stateCode: string;
  phone: string;
  email: string;
};
