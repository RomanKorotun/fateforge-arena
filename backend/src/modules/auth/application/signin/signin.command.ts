export interface SigninCommand {
  email: string;
  password: string;
  ip: string;
  device: {
    browser: string;
    os: string;
    type: string;
  };
  geo: {
    country: string | null;
    region: string | null;
    city: string | null;
  };
}
