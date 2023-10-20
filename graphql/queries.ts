import { gql } from '@apollo/client';

export const GETUSERIDBYEMAIL = gql`
  query email($email: String!) {
    email(email: $email) {
        id
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

export const GETTEAMBYID = gql`
    query TeamById($id: Int!) {
        team(id: $id) {
            name
            description
            idUsers
            idCreator
        }
    }
`;