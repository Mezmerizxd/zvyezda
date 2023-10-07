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
  accountId: string;
  date: Date;
  price: number;
  paid: boolean;
  confirmed: boolean;
  createdAt: Date;
}

type PostEvents = {
  /* ACCOUNT */
  '/account/login': () => Account;
  '/account/create': () => Account;
  '/account/delete': () => null;

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

  /* BOOKING */
  '/bookings/get-all': () => Booking[];
  '/bookings/get': () => Booking;
};

type PatchEvents = {
  /* ACCOUNT */
  '/account/profile/update': () => Profile;

  /* BOOKING */
  '/bookings/confirm': () => Booking;
  '/bookings/confirm-payment': () => Booking;
};

type BaseResponse = {
  success: boolean;
  error: string;
};
