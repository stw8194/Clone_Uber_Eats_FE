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
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

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
  [key: `${number}-optionName`]: string;
  [key: `${number}-optionExtra`]: string;
  [key: `${number}-choiceName`]: string;
  [key: `${number}-choiceExtra`]: string;
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
  const [optionsNumber, setOptionsNumber] = useState<[number, number[]][]>([]);
  const [options, setOptions] = useState<
    {
      name: string;
      extra: number;
      choices: { name: string; extra: number }[];
    }[]
  >([]);

  const onCompleted = (data: CreateDishMutation) => {
    const {
      createDish: { ok, dishId },
    } = data;
    if (ok && dishId) {
      const { name, price, description } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({
        query: MY_RESTAURANT_QUERY,
        variables: { restaurantId: +id },
      });
      if (queryResult && queryResult.myRestaurant.restaurant) {
        client.writeQuery({
          query: MY_RESTAURANT_QUERY,
          data: {
            myRestaurant: {
              ...queryResult?.myRestaurant,
              restaurant: {
                ...queryResult.myRestaurant.restaurant,
                menu: [
                  {
                    id: dishId,
                    name,
                    price: +price,
                    photo: imageUrl,
                    description,
                    options,
                    __typename: "Dish",
                  },
                  ...queryResult.myRestaurant.restaurant.menu,
                ],
                __typename: "Restaurant",
              },
            },
          },
        });
        history.push(`/restaurant/${id}`);
      }
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
    unregister,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormProps>({ mode: "onChange" });

  const history = useHistory();
  const onSubmit = async () => {
    try {
      setUploading(true);
      let photo = "";
      const { name, price, description, rawFile, ...rest } = getValues();
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
        setImageUrl(photo);
      }
      const optionObject = optionsNumber.map(([optionId, choices]) => ({
        name: rest[`${optionId}-optionName`],
        extra: +rest[`${optionId}-optionExtra`],
        choices: choices.map((choiceId) => ({
          name: rest[`${choiceId}-choiceName`],
          extra: +rest[`${choiceId}-choiceExtra`],
          __typename: "DishChoice",
        })),
        __typename: "DishOption",
      }));
      setOptions(optionObject);
      createDishMutation({
        variables: {
          createDishInput: {
            restaurantId: +id,
            name,
            price: +price,
            ...(description && { description }),
            ...(photo && { photo }),
            options,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onAddOptionClick = () => {
    setOptionsNumber((current) => [...current, [Date.now(), []]]);
  };

  const onAddChoicesClick = (optionId: number) => {
    setOptionsNumber((current) =>
      current.map(([id, choices]) =>
        id === optionId ? [id, [...choices, Date.now()]] : [id, choices]
      )
    );
    unregister(`${optionId}-optionExtra`);
  };

  const onDeleteClick = (idToDelete: number) => {
    optionsNumber.map(([optionId, choiceIds]) => {
      if (optionId === idToDelete) {
        choiceIds.map((choiceId) => {
          unregister(`${choiceId}-choiceName`);
          unregister(`${choiceId}-choiceExtra`);
        });
      }
    });
    setOptionsNumber((current) => current.filter((id) => id[0] !== idToDelete));
    unregister(`${idToDelete}-optionName`);
    unregister(`${idToDelete}-optionExtra`);
  };

  const onChoiceDeleteClick = (
    choiceIdToDelete: number,
    optionIdToDelete: number
  ) => {
    optionsNumber.map(([_, choices]) => {
      choices.map((choiceId) => {
        if (choiceId === choiceIdToDelete) {
          unregister(`${choiceId}-choiceName`);
          unregister(`${choiceId}-choiceExtra`);
        }
      });
    });
    setOptionsNumber((current) =>
      current.map(([optionId, choices]) =>
        optionId === optionIdToDelete
          ? [optionId, choices.filter((id) => id !== choiceIdToDelete)]
          : [optionId, choices]
      )
    );
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
          min={0}
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
              className="absolute top-1 right-1 w-4 h-6 cursor-pointer"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </div>
          </div>
        )}
        {errors.rawFile?.message && (
          <FormError errorMessage={errors.rawFile.message} />
        )}
        <div className="my-10">
          <div className="font-medium mb-3 text-lg">
            Dish Options
            <span
              onClick={onAddOptionClick}
              className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 ml-5"
            >
              Add Dish Option
            </span>
          </div>
          {optionsNumber.length !== 0 &&
            optionsNumber.map(([optionId, choices]) => {
              return (
                <div key={optionId} className="mt-5">
                  <div className="flex">
                    <input
                      {...register(`${optionId}-optionName`, {
                        required: "Option name is required",
                      })}
                      className="px-4 mr-3 py-2 focus:outline-none border-gray-300 focus:border-gray-500 border-2"
                      type="text"
                      placeholder="Option Name"
                    />
                    {choices.length === 0 && (
                      <input
                        {...register(`${optionId}-optionExtra`)}
                        defaultValue={0}
                        className="px-4 py-2 focus:outline-none border-gray-300 focus:border-gray-500 border-2"
                        type="number"
                        min={0}
                        placeholder="Option Extra"
                      />
                    )}
                    <div
                      onClick={() => onAddChoicesClick(optionId)}
                      className="w-4 h-6 mt-2 ml-3 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPlus} size="xl" />
                    </div>
                    {choices.map((choiceId) => {
                      return (
                        <div key={choiceId}>
                          <input
                            {...register(`${choiceId}-choiceName`, {
                              required: "Option name is required",
                            })}
                            className="px-4 mr-3 py-2 focus:outline-none border-gray-300 focus:border-gray-500 border-2"
                            type="text"
                            placeholder="Choice Name"
                          />
                          <input
                            {...register(`${choiceId}-choiceExtra`)}
                            defaultValue={0}
                            className="px-4 py-2 focus:outline-none border-gray-300 focus:border-gray-500 border-2"
                            type="number"
                            min={0}
                            placeholder="Choice Extra"
                          />
                          <div
                            onClick={() =>
                              onChoiceDeleteClick(choiceId, optionId)
                            }
                            className="w-4 h-6 mt-2 ml-3 cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faTrashCan} size="xl" />
                          </div>
                        </div>
                      );
                    })}
                    <div
                      onClick={() => onDeleteClick(optionId)}
                      className="w-4 h-6 mt-2 ml-3 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTrashCan} size="xl" />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
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
