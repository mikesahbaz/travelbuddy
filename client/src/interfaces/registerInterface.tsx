export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
}

export const initialRegisterFormState = {
  firstName: '',
  lastName: '',
  email: '',
}
