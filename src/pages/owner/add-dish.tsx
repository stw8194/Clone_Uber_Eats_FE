import { useApolloClient, useMutation } from "@apollo/client";
import { graphql } from "../../gql";
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from "../../gql/graphql";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../../components/submit-button";
import { FormError } from "../../components/form-error";
import { useHistory, useParams } from "react-router-dom";
import { useState } from "react";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const CREATE_DISH_MUTATION = graphql(`
  mutation CreateDish($createDishInput: CreateDishInput!) {
    createDish(input: $createDishInput) {
      ok
      error
      dishId
    }
  }
`);

interface IFormProps {
  name: string;
  price: string;
  description: string;
  rawFile: FileList;
}

interface ICreateDishParams {
  id: string;
}

export const AddDish = () => {
  const { id } = useParams<ICreateDishParams>();
  const client = useApolloClient();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const onCompleted = (data: CreateDishMutation) => {
    const {
      createDish: { ok, dishId },
    } = data;
    if (ok) {
      const { name, price, description } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANT_QUERY });
      //   if (queryResult && queryResult.myRestaurant.restaurant) {
      //     client.writeQuery({
      //       query: MY_RESTAURANT_QUERY,
      //       data: {
      //         myRestaurant: {
      //           ...queryResult?.myRestaurant,
      //           restaurant: {
      //             ...queryResult?.myRestaurant.restaurant,
      //             id: +id,
      //             menu: {
      //               id: dishId,
      //               name,
      //               price: +price,
      //               description,
      //               choices: {
      //                 name: "name",
      //                 extra: 1,
      //               },
      //               __typename: "Dish",
      //             },
      //             __typename: "Restaurant",
      //           },
      //         },
      //       },
      //     });
      //   }
    }
  };

  const [createDishMutation, { data: createDishMutationResults }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(CREATE_DISH_MUTATION, {
    onCompleted,
  });

  const {
    register,
    setValue,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormProps>({ mode: "onChange" });

  const history = useHistory();
  const onSubmit = async () => {
    try {
      setUploading(true);
      let photo = "";
      const { name, price, description, rawFile } = getValues();
      const file = rawFile[0];
      if (file) {
        const formBody = new FormData();
        formBody.append("file", file);
        const { url, error } = await (
          await fetch("http://localhost:4000/uploads", {
            method: "POST",
            body: formBody,
          })
        ).json();
        if (error) {
          setUploadError(error);
          return;
        }
        photo = url;
      }
      createDishMutation({
        variables: {
          createDishInput: {
            restaurantId: +id,
            name,
            price: +price,
            ...(description && { description }),
            ...(photo && { photo }),
          },
        },
      });
      setImageUrl(photo);
      history.push(`/restaurant/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <title>Add Dish | CUber Eats</title>
      <h1>Add Dish</h1>
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
          {...register("price", { required: "Price is required" })}
          type="number"
          placeholder="Price"
          className="input"
        />
        {errors.price?.message && (
          <FormError errorMessage={errors.price.message} />
        )}
        <input
          {...register("description")}
          type="text"
          placeholder="Description (optional)"
          className="input"
        />
        {errors.description?.message && (
          <FormError errorMessage={errors.description.message} />
        )}
        <label
          htmlFor="rawFile"
          className="inline-flex items-center p-3  text-lg bg-lime-600 text-white font-medium rounded-xl shadow cursor-pointer hover:bg-lime-700 transition"
        >
          📁 Upload dish cover image
        </label>
        <input
          id="rawFile"
          className="hidden"
          {...register("rawFile", {
            validate: {
              isImage: (files) => {
                const file = files?.[0];
                if (!file) return true;
                return file.type.startsWith("image/")
                  ? true
                  : "Only image files are allowed";
              },
              sizeUnder5mb: (files) => {
                const file = files?.[0];
                if (!file) return true;
                return file.size < 5 * 1024 * 1024
                  ? true
                  : "Only images under 5MB are allowed";
              },
            },
            onChange: (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setPreview(url);
              } else {
                setPreview(null);
              }
            },
          })}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
        />
        {preview && (
          <div
            className="relative mt-4 w-60 h-60 object-cover bg-cover bg-center mx-auto rounded-xl border border-gray-300 shadow"
            style={{ backgroundImage: `url(${preview})` }}
          >
            <div
              onClick={() => {
                const dataTransfer = new DataTransfer();
                setPreview(null);
                setValue("rawFile", dataTransfer.files);
              }}
              className="absolute top-1 right-1 w-4 h-6 hover:cursor-pointer"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </div>
          </div>
        )}
        {errors.rawFile?.message && (
          <FormError errorMessage={errors.rawFile.message} />
        )}
        <SubmitButton
          canClick={isValid}
          loading={uploading}
          actionText="Create Dish"
        />
        {createDishMutationResults?.createDish?.error && (
          <FormError
            errorMessage={createDishMutationResults.createDish.error}
          />
        )}
        {uploadError && <FormError errorMessage={uploadError} />}
      </form>
    </div>
  );
};
