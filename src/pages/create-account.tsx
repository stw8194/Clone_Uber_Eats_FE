import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { useMutation } from "@apollo/client";
import { graphql } from "../gql";
import logo from "../images/logo.svg";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
  UserRole,
} from "../gql/graphql";
import { SubmitButton } from "../components/submit-button";
import { Link, useHistory } from "react-router-dom";

const CREATE_ACCOUNT_MUTATION = graphql(`
  mutation CreateAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`);

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Client,
    },
  });
  const history = useHistory();
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      history.push("/");
    }
  };
  const [
    createAccountMutation,
    { data: createAccountMutationResult, loading },
  ] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );
  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <title>Create Account | CUber Eats</title>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={logo} alt="" className="w-52 mb-5" />
        <h4 className="w-full text-left text-3xl mb-10">Let's get started</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <input
            {...register("email", {
              required: "Email is required",
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"invalid email address"} />
          )}
          <input
            {...register("password", {
              required: "Password is required",
              minLength: 10,
            })}
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <select
            {...register("role", {
              required: true,
            })}
            className="input"
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <SubmitButton
            canClick={isValid}
            loading={loading}
            actionText="Create Account"
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          Already use CUber?{" "}
          <Link to="/" className="text-lime-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
