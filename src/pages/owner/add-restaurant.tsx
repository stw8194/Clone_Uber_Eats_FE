import { useApolloClient, useMutation, useQuery } from "@apollo/client";
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
import { useEffect, useState } from "react";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { AddRestaurantAddress } from "../../components/modal/add-restaurant-address";
import { useModalRef } from "../../hooks/useModalRef";

const CREATE_RESTAURANT_MUTATION = graphql(`
  mutation CreateRestaurant($createRestaurantInput: CreateRestaurantInput!) {
    createRestaurant(input: $createRestaurantInput) {
      ok
      error
      restaurantId
    }
  }
`);

export const ALL_CATEGORIES = graphql(`
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
  rawFile: FileList;
}

export interface IPosition {
  lat: number;
  lng: number;
}

export const AddRestaurant = () => {
  const client = useApolloClient();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useModalRef(setIsOpen);
  const [restaurantCoords, setRestaurantCoords] = useState<IPosition | null>(
    null
  );
  const [restaurantAddress, setRestaurantAddress] = useState<string>("");

  const { data: allCategoriesQueryRestults } = useQuery<
    AllCategoriesQuery,
    AllCategoriesQueryVariables
  >(ALL_CATEGORIES);

  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok && restaurantId) {
      const { name, address, categoryName } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      if (
        queryResult &&
        restaurantCoords &&
        queryResult.myRestaurants.restaurants
      ) {
        client.writeQuery({
          query: MY_RESTAURANTS_QUERY,
          data: {
            myRestaurants: {
              ...queryResult?.myRestaurants,
              restaurants: [
                {
                  id: restaurantId,
                  name,
                  address,
                  lat: restaurantCoords?.lat,
                  lng: restaurantCoords?.lng,
                  category: {
                    name: categoryName,
                    __typename: "Category",
                  },
                  coverImg: imageUrl,
                  isPromoted: false,
                  promotedUntil: null,
                  __typename: "Restaurant",
                },
                ...queryResult?.myRestaurants.restaurants,
              ],
            },
          },
        });
      }
      history.push("/");
    }
  };

  const [createRestaurantMutation, { data: createRestaurantMutationResults }] =
    useMutation<CreateRestaurantMutation, CreateRestaurantMutationVariables>(
      CREATE_RESTAURANT_MUTATION,
      {
        onCompleted,
      }
    );

  const {
    register,
    getValues,
    setValue,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormProps>({ mode: "onChange" });

  const history = useHistory();
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { name, address, categoryName, rawFile } = getValues();
      const file = rawFile[0];
      const formBody = new FormData();
      formBody.append("file", file);
      const { url: coverImg, error } = await (
        await fetch("http://localhost:4000/uploads", {
          method: "POST",
          body: formBody,
        })
      ).json();
      if (error) {
        setUploadError(error);
        return;
      }
      setImageUrl(coverImg);
      if (restaurantCoords) {
        createRestaurantMutation({
          variables: {
            createRestaurantInput: {
              name,
              address,
              categoryName,
              coverImg,
              lat: restaurantCoords.lat,
              lng: restaurantCoords.lng,
            },
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (restaurantAddress) {
      setValue("address", restaurantAddress, { shouldValidate: true });
    }
  }, [restaurantAddress, setValue]);

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
        <div className="flex mb-2 justify-between items-center">
          <input
            className="ml-2"
            {...register("address", {
              required: "Address is required",
            })}
            type="hidden"
            value={restaurantAddress}
          />
          <div className="text-lg font-medium">{restaurantAddress}</div>
          <button
            type="button"
            className="p-2 rounded-xl bg-lime-500 hover:bg-lime-600"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Address
          </button>
        </div>
        {isOpen && (
          <AddRestaurantAddress
            ref={modalRef}
            setIsOpen={setIsOpen}
            restaurantCoords={restaurantCoords}
            setRestaurantCoords={setRestaurantCoords}
            setRestaurantAddress={setRestaurantAddress}
          />
        )}
        {errors.address?.message && (
          <FormError errorMessage={errors.address.message} />
        )}
        <select
          {...register("categoryName", { required: "Category is required" })}
          className="input"
        >
          {allCategoriesQueryRestults?.allCategories.ok &&
            allCategoriesQueryRestults?.allCategories.categories?.map(
              (category, index) => <option key={index}>{category.name}</option>
            )}
        </select>
        {errors.categoryName?.message && (
          <FormError errorMessage={errors.categoryName.message} />
        )}
        <label
          htmlFor="rawFile"
          className="inline-flex items-center p-3  text-lg bg-lime-600 text-white font-medium rounded-xl shadow cursor-pointer hover:bg-lime-700 transition"
        >
          📁 Upload Restaurant cover image
        </label>
        <input
          id="rawFile"
          className="hidden"
          {...register("rawFile", {
            required: "Cover image is required",
            validate: {
              isImage: (files) => {
                const file = files?.[0];
                return file.type.startsWith("image/")
                  ? true
                  : "Only image files are allowed";
              },
              sizeUnder5mb: (files) => {
                const file = files?.[0];
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
              }
            },
          })}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
        />
        {preview && (
          <div
            className="mt-4 w-60 h-60 object-cover bg-cover bg-center mx-auto rounded-xl border border-gray-300 shadow"
            style={{ backgroundImage: `url(${preview})` }}
          ></div>
        )}
        {errors.rawFile?.message && (
          <FormError errorMessage={errors.rawFile.message} />
        )}
        <SubmitButton
          canClick={isValid}
          loading={uploading}
          actionText="Create Restaurant"
        />
        {createRestaurantMutationResults?.createRestaurant?.error && (
          <FormError
            errorMessage={
              createRestaurantMutationResults.createRestaurant.error
            }
          />
        )}
        {uploadError && <FormError errorMessage={uploadError} />}
      </form>
    </div>
  );
};
