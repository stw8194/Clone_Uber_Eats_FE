import { useParams } from "react-router-dom";
import { graphql } from "../../gql";
import { useQuery } from "@apollo/client";
import { CategoryQuery, CategoryQueryVariables } from "../../gql/graphql";
import { useState } from "react";
import { Restaurant } from "../../components/restaurant";
import { ShowMoreButton } from "../../components/showmore-button";

export const CATEGORY_QUERY = graphql(`
  query Category($categoryInput: CategoryInput!) {
    category(input: $categoryInput) {
      totalPages
      totalResults
      restaurants {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
      category {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
  }
`);

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const { slug } = useParams<ICategoryParams>();
  type RestaurantFromQuery = NonNullable<
    NonNullable<CategoryQuery["category"]["restaurants"]>[number]
  >;

  const [allRestaurants, setAllRestaurants] = useState<RestaurantFromQuery[]>(
    []
  );
  const [page, setPage] = useState(1);
  const onClick = () => {
    setPage((current) => current + 1);
  };

  const onCompleted = (data: CategoryQuery) => {
    const {
      category: { restaurants },
    } = data;
    if (restaurants) {
      setAllRestaurants((prev) => [...prev, ...restaurants]);
    }
  };

  const { data: categoryQueryResults } = useQuery<
    CategoryQuery,
    CategoryQueryVariables
  >(CATEGORY_QUERY, {
    variables: {
      categoryInput: {
        page,
        slug,
      },
    },
    onCompleted,
  });

  return (
    <div className="max-w-screen-xl pb-20 mx-auto mt-8">
      <title>Category | CUber Eats</title>
      <div className="flex items-center justify-between w-full mx-auto px-16">
        <div className="mt-1 mr-96 text-6xl font-bold whitespace-nowrap">
          {categoryQueryResults?.category.category?.name}
        </div>
        <div
          data-testid={categoryQueryResults?.category.category?.id}
          className="w-32 h-32 ml-80 bg-cover rounded-full"
          style={{
            backgroundImage: `url(${categoryQueryResults?.category.category?.coverImg})`,
          }}
        ></div>
      </div>
      <div className="grid mt-10 md:grid-cols-4 gap-x-4 gap-y-8">
        {allRestaurants.map((restaurant) => (
          <Restaurant
            key={restaurant.id}
            id={restaurant.id + ""}
            coverImg={restaurant.coverImg}
            name={restaurant.name}
          />
        ))}
      </div>
      {categoryQueryResults?.category.totalPages && (
        <ShowMoreButton
          page={page}
          totalPages={categoryQueryResults.category.totalPages}
          onClick={onClick}
        />
      )}
    </div>
  );
};
