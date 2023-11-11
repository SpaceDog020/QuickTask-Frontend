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
            id
            name
            lastName
            email
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

export const CHANGEPASSRECOVERY = gql`
  mutation ChangePassRecovery($password: String!, $recoveryPass: Int!) {
      changePassRecovery(changePassRecoveryUserInput: {
          password: $password,
          recoveryPass: $recoveryPass
      }) {
          
          response

      }
  }
`;

export const CHANGEPASSWORD = gql`
    mutation ChangePassword($email: String!, $oldPassword: String!, $newPassword: String!) {
        changePassword(changePassInput: {
            email: $email,
            oldPassword: $oldPassword,
            newPassword: $newPassword
        }) {
            
            response
    
        }
    }
    `;

export const UPDATEUSER = gql`
  mutation UpdateUser($oldEmail: String!, $name: String!, $lastName: String!, $email: String!) {
      updateUser(updateUserInput: {
          oldEmail: $oldEmail,
          name: $name,
          lastName: $lastName,
          email: $email
      }) {
          
          response

      }
  }
`;

export const CREATETEAM = gql`
    mutation CreateTeam($name: String!, $description: String!, $idUser: Int!) {
        createTeam(createTeamInput: {
            name: $name,
            description: $description,
            idUser: $idUser
        }) {
            
            id
    
        }
    }
`;

export const UPDATETEAM = gql`
    mutation UpdateTeam($idTeam: Int!, $idUser: Int!, $name: String!, $description: String!) {
        updateTeam(updateTeamInput: {
            idTeam: $idTeam,
            idUser: $idUser,
            name: $name,
            description: $description
        }) {
            
            response

        }
    }
`;

export const ADDTEAM = gql`
    mutation AddTeam($idUser: Int!, $idTeam: Int!) {
        addTeam(addTeamInput: {
            idUser: $idUser,
            idTeam: $idTeam
        }) {
            
            response

        }
    }
`;

export const ADDUSERS = gql`
    mutation AddUsers($idTeam: Int!, $idUser: Int!) {
        addUsers(addUsersInput: {
            idTeam: $idTeam,
            idUser: $idUser
        }) {
            
            response

        }
    }
`;