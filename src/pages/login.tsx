import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { useMutation } from "@apollo/client";
import { graphql } from "../gql";
import logo from "../images/logo.svg";
import { LoginMutation, LoginMutationVariables } from "../gql/graphql";
import { Button } from "../components/button";
import { Link } from "react-router-dom";

const LOGIN_MUTATION = graphql(`
  mutation Login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`);

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<ILoginForm>();
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={logo} alt="" className="w-52 mb-5" />
        <h4 className="w-full text-left text-3xl mb-10">Welcome back</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5  w-full mb-5"
        >
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
                message: "invalid email address",
              },
            })}
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
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
          <Button canClick={isValid} loading={loading} actionText="Log in" />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to Clone_uber?{" "}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
