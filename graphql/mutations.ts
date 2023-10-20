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

export const GETUSERIDBYEMAIL = gql`
  query email($email: String!) {
    email(email: $email) {
        id
    }
  }
`;

export const GETTEAMSIDBYEMAIL = gql`
  query email($email: String!) {
    email(email: $email) {
        idTeams
    }
  }
`;

export const GETTEAMDETAILS = gql`
    query TeamsByUserId($id: Int!) {
        teamsByUserId(id: $id) {
            id
            name
            description
        }
    }
`;