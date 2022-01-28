import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Perfavore, inserisci un indirizzo email valido')
    .required("Devi inserire l'email"),
  password: yup
    .string()
    .min(6, 'La password deve contenere almeno 6 lettere')
    .required('La password deve contenere almeno 6 lettere'),
});

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(6, 'Il nome utente deve contenere almeno 6 caratteri')
    .required(),
  email: yup
    .string()
    .email('Perfavore, inserisci un indirizzo email valido')
    .required("Devi inserire l'email"),
  password: yup
    .string()
    .min(6, 'La password deve contenere almeno 6 lettere')
    .required('La password deve contenere almeno 6 lettere'),
  gender: yup.string().required('Devi inserire il Sesso'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'La password deve essere la stessa.'),
});
