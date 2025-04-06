import { gql, useApolloClient, useMutation } from "@apollo/client";
import { graphql } from "../../gql";
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from "../../gql/graphql";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet-async";

interface IEditProfileForm {
  email?: string;
  password?: string;
}

const EDIT_PROFILE_MUTATION = graphql(`
  mutation EditProfile($editProfileInput: EditProfileInput!) {
    editProfile(input: $editProfileInput) {
      ok
      error
    }
  }
`);

export const EditProfile = () => {
  const { data: userData } = useMe();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<IEditProfileForm>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });

  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    const { email, password } = getValues();
    if (ok && userData?.me.id) {
      // client.writeFragment({
      //   id: `User:${userData.me.id}`,
      //   fragment: gql`
      //     fragment EditedUser on User {
      //       email
      //       password
      //     }
      //   `,
      //   data: {
      //     email,
      //     password,
      //   },
      // });
      history.push("/");
    }
  };
  const [editProfileMutaion, { data: editProfileMutationResult, loading }] =
    useMutation<EditProfileMutation, EditProfileMutationVariables>(
      EDIT_PROFILE_MUTATION,
      {
        onCompleted,
      }
    );

  const onSubmit = () => {
    const { email, password } = getValues();
    console.log(getValues());
    editProfileMutaion({
      variables: {
        editProfileInput: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | CUber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <input
            {...register("email", {
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            type="email"
            placeholder="Email"
            className="input"
          />
          <input
            {...register("password", {
              minLength: 10,
            })}
            type="password"
            placeholder="Password"
            className="input"
          />
          <Button
            canClick={isValid}
            loading={loading}
            actionText="Update Profile"
          />
        </form>
      </div>
    </div>
  );
};
