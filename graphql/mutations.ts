import { gql } from '@apollo/client';

export const REGISTER = gql`
    mutation Register($name: String!, $lastName: String!, $email: String!, $password: String!) {
        register(userInput: {
            name: $name,
            lastName: $lastName,
            email: $email,
            password: $password
        }) {

            response

        }
    }
`;

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(loginInput: {
            email: $email,
            password: $password
        }) {
            
            accessToken

        }
    }
`;

export const RECOVERY = gql`
    mutation Recovery($email: String!) {
        recovery(recoveryInput: {
            email: $email
        }) {
            
            response

        }
    }
`;

export const VALIDATERECOVERY = gql`
  mutation ValidateRecovery($recoveryPass: Int!) {
      validateRecovery(validaterecoveryInput: {
          recoveryPass: $recoveryPass
      }) {
          
          response

      }
  }
`;

export const CHANGEPASS = gql`
  mutation ChangePass($password: String!, $recoveryPass: Int!) {
      changePass(changePassUserInput: {
          password: $password
          recoveryPass: $recoveryPass
      }) {
          
          response

      }
  }
`;