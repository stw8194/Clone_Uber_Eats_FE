import { graphql } from "./gql";

export const RESTAURANT_FRAGMENT = graphql(`
  fragment RestaurantParts on Restaurant {
    id
    name
    coverImg
    address
    lat
    lng
    category {
      name
    }
    address
    isPromoted
  }
`);

export const CATEGORY_FRAGMENT = graphql(`
  fragment CategoryParts on Category {
    id
    name
    coverImg
    slug
    restaurantCount
  }
`);

export const DISH_FRAGMENT = graphql(`
  fragment DishParts on Dish {
    id
    name
    price
    photo
    description
    options {
      name
      extra
      choices {
        name
        extra
      }
    }
  }
`);

export const ORDER_FRAGMENT = graphql(`
  fragment OrderParts on Order {
    id
    status
    total
    driver {
      email
    }
    customer {
      email
    }
    restaurant {
      name
      address
      lat
      lng
    }
  }
`);
