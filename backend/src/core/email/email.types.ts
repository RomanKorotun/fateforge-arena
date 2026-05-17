export type EmailTemplates = {
  'verify-email': {
    username: string;
    confirmationLink: string;
  };

  'reset-password': {
    username: string;
    resetLink: string;
  };
};

export interface SendVerificationEmailOptions {
  email: string;
  username: string;
  confirmationLink: string;
}
