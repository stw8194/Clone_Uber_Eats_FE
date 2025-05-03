import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { graphql } from "../../gql";
import {
  AllCategoriesQuery,
  AllCategoriesQueryVariables,
  EditRestaurantMutation,
  EditRestaurantMutationVariables,
} from "../../gql/graphql";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../../components/submit-button";
import { FormError } from "../../components/form-error";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { ALL_CATEGORIES, IPosition } from "./add-restaurant";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import { AddRestaurantAddress } from "../../components/modal/add-restaurant-address";

const EDIT_RESTAURANT_MUTATION = graphql(`
  mutation EditRestaurant($editRestaurantInput: EditRestaurantInput!) {
    editRestaurant(input: $editRestaurantInput) {
      ok
      error
    }
  }
`);

interface IMyRestaurantParams {
  id: string;
}

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  rawFile: FileList;
}

export const EditRestaurant = () => {
  const { id } = useParams<IMyRestaurantParams>();
  const client = useApolloClient();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [restaurantCoords, setRestaurantCoords] = useState<IPosition | null>(
    null
  );
  const [restaurantAddress, setRestaurantAddress] = useState<string>("");

  const { data: allCategoriesQueryRestults } = useQuery<
    AllCategoriesQuery,
    AllCategoriesQueryVariables
  >(ALL_CATEGORIES);

  const { data: myRestaurantQueryResults, loading } = useQuery(
    MY_RESTAURANT_QUERY,
    {
      variables: { restaurantId: +id },
    }
  );

  useEffect(() => {
    if (myRestaurantQueryResults?.myRestaurant.restaurant?.coverImg) {
      setPreview(myRestaurantQueryResults.myRestaurant.restaurant.coverImg);
    }
  }, [myRestaurantQueryResults]);

  const onCompleted = (data: EditRestaurantMutation) => {
    const {
      editRestaurant: { ok },
    } = data;
    if (ok) {
      const { name, address, categoryName } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      if (queryResult && queryResult.myRestaurants.restaurants) {
        client.writeQuery({
          query: MY_RESTAURANTS_QUERY,
          data: {
            myRestaurants: {
              ...queryResult?.myRestaurants,
              restaurants: [
                {
                  id: +id,
                  name,
                  address,
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
    }
  };

  const [editRestaurantMutation, { data: editRestaurantMutationResults }] =
    useMutation<EditRestaurantMutation, EditRestaurantMutationVariables>(
      EDIT_RESTAURANT_MUTATION,
      {
        onCompleted,
        refetchQueries: [
          {
            query: MY_RESTAURANTS_QUERY,
          },
        ],
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
      let coverImg = "";
      const { name, address, categoryName, rawFile } = getValues();
      const file = rawFile[0];
      const formBody = new FormData();
      if (file) {
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
        coverImg = url;
        if (myRestaurantQueryResults?.myRestaurant.restaurant?.coverImg) {
          const [_, encodedFileName] =
            myRestaurantQueryResults?.myRestaurant.restaurant?.coverImg.split(
              "amazonaws.com/"
            );
          await fetch(`http://localhost:4000/uploads/${encodedFileName}`, {
            method: "DELETE",
          });
        }
        setImageUrl(coverImg);
      } else {
        myRestaurantQueryResults?.myRestaurant.restaurant?.coverImg &&
          setImageUrl(
            myRestaurantQueryResults?.myRestaurant.restaurant?.coverImg
          );
      }
      editRestaurantMutation({
        variables: {
          editRestaurantInput: {
            restaurantId: +id,
            name,
            address,
            categoryName,
            ...(coverImg && { coverImg }),
          },
        },
      });
      history.push(`/restaurants/${id}`);
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
    !loading && (
      <div className="container">
        <title>Edit Restaurant | CUber Eats</title>
        <h1>Edit Restaurant</h1>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            placeholder="Name"
            defaultValue={
              myRestaurantQueryResults?.myRestaurant.restaurant?.name
            }
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
              restaurantAddress={restaurantAddress}
              setRestaurantAddress={setRestaurantAddress}
            />
          )}
          {errors.address?.message && (
            <FormError errorMessage={errors.address.message} />
          )}
          <select
            {...register("categoryName", { required: "Category is required" })}
            defaultValue={
              myRestaurantQueryResults?.myRestaurant.restaurant?.category?.name
            }
            className="input"
          >
            {allCategoriesQueryRestults?.allCategories.ok &&
              allCategoriesQueryRestults?.allCategories.categories?.map(
                (category, index) => (
                  <option key={index}>{category.name}</option>
                )
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
            actionText="Edit Restaurant"
          />
          {editRestaurantMutationResults?.editRestaurant?.error && (
            <FormError
              errorMessage={editRestaurantMutationResults.editRestaurant.error}
            />
          )}
          {uploadError && <FormError errorMessage={uploadError} />}
        </form>
      </div>
    )
  );
};
