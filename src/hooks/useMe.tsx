import { useQuery } from "@apollo/client";
import { graphql } from "../gql";
import { MeQuery } from "../gql/graphql";

export const ME_QUERY = graphql(`
  query Me {
    me {
      id
      email
      role
      verified
      selectedAddress {
        id
        address
        lat
        lng
      }
    }
  }
`);

export const useMe = () => {
  return useQuery<MeQuery>(ME_QUERY);
};
