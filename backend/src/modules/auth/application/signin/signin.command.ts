export interface SigninCommand {
  email: string;
  password: string;
  ip: string;
  device: {
    browser: string;
    os: string;
    type: string;
  };
}
