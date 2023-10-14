import gql from 'graphql-tag';

export const GET_ALL_RECIPES = gql`
    query {
        getAllRecipes {
            id
            title
            image
            ...
        }
    }
`;