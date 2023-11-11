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
            idUsers
            idCreator
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

export const GETUSERSBYTEAMID = gql`
    query TeamUserIds($id: Int!) {
        teamUserIds(id: $id) {
            userIds
        }
    }
`;

export const GETUSERSBYIDS = gql`
    query UsersByIds($ids: [Int!]!) {
        usersByIds(ids: $ids) {
            id
            name
            lastName
            email
        }
    }
`;