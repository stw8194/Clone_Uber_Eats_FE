import { useMutation, useQuery } from "@apollo/client";
import { graphql } from "../../gql";
import {
  AllCategoriesQuery,
  AllCategoriesQueryVariables,
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../gql/graphql";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../../components/submit-button";
import { FormError } from "../../components/form-error";
import { useHistory } from "react-router-dom";

const CREATE_RESTAURANT_MUTATION = graphql(`
  mutation CreateRestaurant($createRestaurantInput: CreateRestaurantInput!) {
    createRestaurant(input: $createRestaurantInput) {
      ok
      error
    }
  }
`);

const ALL_CATEGORIES = graphql(`
  query allCategories {
    allCategories {
      ok
      error
      categories {
        name
        coverImg
      }
    }
  }
`);

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}

export const AddRestaurant = () => {
  const { data: allCategoriesQueryRestults } = useQuery<
    AllCategoriesQuery,
    AllCategoriesQueryVariables
  >(ALL_CATEGORIES);

  const [
    createRestaurantMutation,
    { data: createRestaurantMutationResults, loading },
  ] = useMutation<CreateRestaurantMutation, CreateRestaurantMutationVariables>(
    CREATE_RESTAURANT_MUTATION
  );

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormProps>({ mode: "onChange" });

  const history = useHistory();
  const onSubmit = () => {
    const { name, address, categoryName: rawCategory } = getValues();
    const category = JSON.parse(rawCategory);
    createRestaurantMutation({
      variables: {
        createRestaurantInput: {
          name,
          address,
          categoryName: category.name,
          coverImg: category.coverImg,
        },
      },
    });
    history.push("/");
  };

  return (
    <div className="container">
      <title>Add Restaurant | CUber Eats</title>
      <h1>Add Restaurant</h1>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("name", { required: "Name is required" })}
          type="text"
          placeholder="Name"
          className="input"
        />
        {errors.name?.message && (
          <FormError errorMessage={errors.name.message} />
        )}
        <input
          {...register("address", { required: "Address is required" })}
          type="text"
          placeholder="Address"
          className="input"
        />
        {errors.address?.message && (
          <FormError errorMessage={errors.address.message} />
        )}
        <select
          {...register("categoryName", { required: "Category is required" })}
          className="input"
        >
          {allCategoriesQueryRestults?.allCategories.ok &&
            allCategoriesQueryRestults?.allCategories.categories?.map(
              (category, index) => (
                <option key={index} value={JSON.stringify(category)}>
                  {category.name}
                </option>
              )
            )}
        </select>
        {errors.categoryName?.message && (
          <FormError errorMessage={errors.categoryName.message} />
        )}
        <SubmitButton
          canClick={isValid}
          loading={loading}
          actionText="Create Restaurant"
        />
      </form>
    </div>
  );
};
