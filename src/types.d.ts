interface Profile {
  id: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'DEVELOPER' | 'USER';
  avatar?: string | null;
  biography?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Account {
  id: string;
  email: string;
  username: string;
  password: string;
  token?: string | null;
  tokenExp?: Date | null;
  role: 'ADMIN' | 'DEVELOPER' | 'USER';
  avatar?: string | null;
  biography?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Xbox {
  id: string;
  title: string;
  description: string;
  xboxType: string;
  xboxColour: string;
  motherboardType: string;
  serialNumber: string;
  mfrDate: Date;
  model: string;
  nandSize: string;
  rghVersion: string;
  rghGlitchType: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Discussion {
  id: string;
  message: string;
  username: string;
  avatar?: string;
  replyTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Surveillance {
  id: string;
  url: string;
  name: string;
}

interface Booking {
  id: string;
  date: Date;
  price: number;
  serviceType: string;
  paid: boolean;
  confirmed: boolean;
  address: Address;
  account: Account;
  createdAt: Date;
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  accountId: string;
}

type PostEvents = {
  /* ACCOUNT */
  '/account/login': () => Account;
  '/account/create': () => Account;
  '/account/delete': () => null;
  '/account/addresses/delete': () => null;
  '/account/addresses/create': () => Address;

  /* BOOKING */
  '/bookings/cancel': () => null;
  '/bookings/is-date-booked': () => boolean;
};

type GetEvents = {
  '/get-version': () => {
    server: string;
    client: string;
  };
  '/get-socket-details': () => {
    socketUrl: string;
  };

  /* ACCOUNT */
  '/account/profile': () => Profile;
  '/account/accounts': () => Account[];
  '/account/authorize': () => null;
  '/account/addresses': () => Address[] | null;

  /* BOOKING */
  '/bookings/get-all': () => Booking[];
  '/bookings/get': () => Booking;
};

type PatchEvents = {
  /* ACCOUNT */
  '/account/profile/update': () => Profile;
  '/account/addresses/update': () => Address;

  /* BOOKING */
  '/bookings/confirm': () => Booking;
  '/bookings/confirm-payment': () => Booking;
};

type BaseResponse = {
  success: boolean;
  error: string;
};
