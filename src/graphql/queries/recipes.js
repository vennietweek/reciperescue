import gql from 'graphql-tag';

export const GET_RECIPE_BY_ID = gql`
    query {
        getRecipe {
            id
            title
            image
        }
    }
`;

