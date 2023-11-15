import { gql } from '@apollo/client';

export const GETTEAMS = gql`
    query Teams {
        teams {
            id
            name
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

export const GETTEAMSBYIDS = gql`
    query TeamsByIds($ids: [Int!]!) {
        teamsByIds(ids: $ids) {
            id
            name
            description
            idUsers
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

export const FINDTEAMSBYCREATORID = gql`
    query FindTeamsByCreatorId($id: Int!) {
        findTeamsByCreatorId(id: $id) {

            response

        }
    }
`;

export const GETPROJECTS = gql`
    query Projects {
        projects {
            id
            name
            description
            idTeams
        }
    }
`;

export const GETUSERSBYTEAMID = gql`
    query UsersByTeamId($id: Int!) {
        usersByTeamId(teamId: $id) {
            id
            name
            lastName
        }
    }
`;