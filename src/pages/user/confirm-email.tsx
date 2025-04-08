import { gql, useApolloClient, useMutation } from "@apollo/client";
import { graphql } from "../../gql";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../gql/graphql";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useMe } from "../../hooks/useMe";

const VERIFY_EMAIL_MUTATION = graphql(`
  mutation VerifyEmail($verifyEmailInput: VerifyEmailInput!) {
    verifyEmail(input: $verifyEmailInput) {
      ok
      error
    }
  }
`);

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      history.push("/");
    }
  };
  const [verifyEmailMutation] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted,
  });
  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmailMutation({
      variables: {
        verifyEmailInput: {
          code,
        },
      },
    });
  }, []);
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <head>
        <title>Verify Email | CUber Eats</title>
      </head>
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
