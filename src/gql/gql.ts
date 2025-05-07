/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation EditOrder($editOrderInput: EditOrderInput!) {\n    editOrder(input: $editOrderInput) {\n      ok\n      error\n    }\n  }\n": typeof types.EditOrderDocument,
    "\n  query GetOrders($getOrdersInput: GetOrdersInput!) {\n    getOrders(input: $getOrdersInput) {\n      ok\n      error\n      orders {\n        ...OrderParts\n      }\n    }\n  }\n": typeof types.GetOrdersDocument,
    "\n  fragment RestaurantParts on Restaurant {\n    id\n    name\n    coverImg\n    category {\n      name\n    }\n    address\n    isPromoted\n  }\n": typeof types.RestaurantPartsFragmentDoc,
    "\n  fragment CategoryParts on Category {\n    id\n    name\n    coverImg\n    slug\n    restaurantCount\n  }\n": typeof types.CategoryPartsFragmentDoc,
    "\n  fragment DishParts on Dish {\n    id\n    name\n    price\n    photo\n    description\n    options {\n      name\n      extra\n      choices {\n        name\n        extra\n      }\n    }\n  }\n": typeof types.DishPartsFragmentDoc,
    "\n  fragment OrderParts on Order {\n    id\n    status\n    total\n    driver {\n      email\n    }\n    customer {\n      email\n    }\n    restaurant {\n      name\n    }\n  }\n": typeof types.OrderPartsFragmentDoc,
    "\n  query Me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n": typeof types.MeDocument,
    "\n  query Category($categoryInput: CategoryInput!) {\n    category(input: $categoryInput) {\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n      category {\n        ...CategoryParts\n      }\n    }\n  }\n": typeof types.CategoryDocument,
    "\n  query Restaurant($restaurantId: Float!) {\n    restaurant(restaurantId: $restaurantId) {\n      restaurant {\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n      }\n    }\n  }\n": typeof types.RestaurantDocument,
    "\n  mutation CreateOrder($createOrderInput: CreateOrderInput!) {\n    createOrder(input: $createOrderInput) {\n      ok\n      error\n      orderId\n    }\n  }\n": typeof types.CreateOrderDocument,
    "\n  query RestaurantsPage($restaurantsInput: RestaurantsInput!) {\n    allCategories {\n      ok\n      error\n      categories {\n        ...CategoryParts\n      }\n    }\n\n    restaurants(input: $restaurantsInput) {\n      totalPages\n      totalResults\n      results {\n        ...RestaurantParts\n      }\n    }\n  }\n": typeof types.RestaurantsPageDocument,
    "\n  query SearchRestaurant($searchRestaurantInput: SearchRestaurantInput!) {\n    searchRestaurant(input: $searchRestaurantInput) {\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n": typeof types.SearchRestaurantDocument,
    "\n  mutation CreateAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n": typeof types.CreateAccountDocument,
    "\n  mutation Login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      token\n      error\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation CreateDish($createDishInput: CreateDishInput!) {\n    createDish(input: $createDishInput) {\n      ok\n      error\n      dishId\n    }\n  }\n": typeof types.CreateDishDocument,
    "\n  mutation CreateRestaurant($createRestaurantInput: CreateRestaurantInput!) {\n    createRestaurant(input: $createRestaurantInput) {\n      ok\n      error\n      restaurantId\n    }\n  }\n": typeof types.CreateRestaurantDocument,
    "\n  query allCategories {\n    allCategories {\n      ok\n      error\n      categories {\n        name\n        coverImg\n      }\n    }\n  }\n": typeof types.AllCategoriesDocument,
    "\n  mutation EditDish($editDishInput: EditDishInput!) {\n    editDish(input: $editDishInput) {\n      ok\n      error\n    }\n  }\n": typeof types.EditDishDocument,
    "\n  query MyDish($myDishInput: MyDishInput!) {\n    myDish(input: $myDishInput) {\n      ok\n      error\n      dish {\n        ...DishParts\n      }\n    }\n  }\n": typeof types.MyDishDocument,
    "\n  mutation EditRestaurant($editRestaurantInput: EditRestaurantInput!) {\n    editRestaurant(input: $editRestaurantInput) {\n      ok\n      error\n    }\n  }\n": typeof types.EditRestaurantDocument,
    "\n  query MyRestaurant($restaurantId: Float!) {\n    myRestaurant(restaurantId: $restaurantId) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n        promotedUntil\n        menu {\n          ...DishParts\n        }\n        orders {\n          id\n          createdAt\n          total\n        }\n      }\n    }\n  }\n": typeof types.MyRestaurantDocument,
    "\n  query MyRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        ...RestaurantParts\n        promotedUntil\n      }\n    }\n  }\n": typeof types.MyRestaurantsDocument,
    "\n  mutation VerifyEmail($verifyEmailInput: VerifyEmailInput!) {\n    verifyEmail(input: $verifyEmailInput) {\n      ok\n      error\n    }\n  }\n": typeof types.VerifyEmailDocument,
    "\n          fragment VerifiedUser on User {\n            verified\n          }\n        ": typeof types.VerifiedUserFragmentDoc,
    "\n  mutation EditProfile($editProfileInput: EditProfileInput!) {\n    editProfile(input: $editProfileInput) {\n      ok\n      error\n    }\n  }\n": typeof types.EditProfileDocument,
    "\n            fragment EditedUser on User {\n              verified\n              email\n            }\n          ": typeof types.EditedUserFragmentDoc,
    "\n  query GetOrder($getOrderInput: GetOrderInput!) {\n    getOrder(input: $getOrderInput) {\n      ok\n      error\n      order {\n        ...OrderParts\n      }\n    }\n  }\n": typeof types.GetOrderDocument,
    "\n  subscription OrderUpdates($orderUpdatesInput: OrderUpdatesInput!) {\n    orderUpdates(input: $orderUpdatesInput) {\n      ...OrderParts\n    }\n  }\n": typeof types.OrderUpdatesDocument,
    "\n  subscription PendingOrders {\n    pendingOrders {\n      ...OrderParts\n    }\n  }\n": typeof types.PendingOrdersDocument,
};
const documents: Documents = {
    "\n  mutation EditOrder($editOrderInput: EditOrderInput!) {\n    editOrder(input: $editOrderInput) {\n      ok\n      error\n    }\n  }\n": types.EditOrderDocument,
    "\n  query GetOrders($getOrdersInput: GetOrdersInput!) {\n    getOrders(input: $getOrdersInput) {\n      ok\n      error\n      orders {\n        ...OrderParts\n      }\n    }\n  }\n": types.GetOrdersDocument,
    "\n  fragment RestaurantParts on Restaurant {\n    id\n    name\n    coverImg\n    category {\n      name\n    }\n    address\n    isPromoted\n  }\n": types.RestaurantPartsFragmentDoc,
    "\n  fragment CategoryParts on Category {\n    id\n    name\n    coverImg\n    slug\n    restaurantCount\n  }\n": types.CategoryPartsFragmentDoc,
    "\n  fragment DishParts on Dish {\n    id\n    name\n    price\n    photo\n    description\n    options {\n      name\n      extra\n      choices {\n        name\n        extra\n      }\n    }\n  }\n": types.DishPartsFragmentDoc,
    "\n  fragment OrderParts on Order {\n    id\n    status\n    total\n    driver {\n      email\n    }\n    customer {\n      email\n    }\n    restaurant {\n      name\n    }\n  }\n": types.OrderPartsFragmentDoc,
    "\n  query Me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n": types.MeDocument,
    "\n  query Category($categoryInput: CategoryInput!) {\n    category(input: $categoryInput) {\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n      category {\n        ...CategoryParts\n      }\n    }\n  }\n": types.CategoryDocument,
    "\n  query Restaurant($restaurantId: Float!) {\n    restaurant(restaurantId: $restaurantId) {\n      restaurant {\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n      }\n    }\n  }\n": types.RestaurantDocument,
    "\n  mutation CreateOrder($createOrderInput: CreateOrderInput!) {\n    createOrder(input: $createOrderInput) {\n      ok\n      error\n      orderId\n    }\n  }\n": types.CreateOrderDocument,
    "\n  query RestaurantsPage($restaurantsInput: RestaurantsInput!) {\n    allCategories {\n      ok\n      error\n      categories {\n        ...CategoryParts\n      }\n    }\n\n    restaurants(input: $restaurantsInput) {\n      totalPages\n      totalResults\n      results {\n        ...RestaurantParts\n      }\n    }\n  }\n": types.RestaurantsPageDocument,
    "\n  query SearchRestaurant($searchRestaurantInput: SearchRestaurantInput!) {\n    searchRestaurant(input: $searchRestaurantInput) {\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n": types.SearchRestaurantDocument,
    "\n  mutation CreateAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n": types.CreateAccountDocument,
    "\n  mutation Login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      token\n      error\n    }\n  }\n": types.LoginDocument,
    "\n  mutation CreateDish($createDishInput: CreateDishInput!) {\n    createDish(input: $createDishInput) {\n      ok\n      error\n      dishId\n    }\n  }\n": types.CreateDishDocument,
    "\n  mutation CreateRestaurant($createRestaurantInput: CreateRestaurantInput!) {\n    createRestaurant(input: $createRestaurantInput) {\n      ok\n      error\n      restaurantId\n    }\n  }\n": types.CreateRestaurantDocument,
    "\n  query allCategories {\n    allCategories {\n      ok\n      error\n      categories {\n        name\n        coverImg\n      }\n    }\n  }\n": types.AllCategoriesDocument,
    "\n  mutation EditDish($editDishInput: EditDishInput!) {\n    editDish(input: $editDishInput) {\n      ok\n      error\n    }\n  }\n": types.EditDishDocument,
    "\n  query MyDish($myDishInput: MyDishInput!) {\n    myDish(input: $myDishInput) {\n      ok\n      error\n      dish {\n        ...DishParts\n      }\n    }\n  }\n": types.MyDishDocument,
    "\n  mutation EditRestaurant($editRestaurantInput: EditRestaurantInput!) {\n    editRestaurant(input: $editRestaurantInput) {\n      ok\n      error\n    }\n  }\n": types.EditRestaurantDocument,
    "\n  query MyRestaurant($restaurantId: Float!) {\n    myRestaurant(restaurantId: $restaurantId) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n        promotedUntil\n        menu {\n          ...DishParts\n        }\n        orders {\n          id\n          createdAt\n          total\n        }\n      }\n    }\n  }\n": types.MyRestaurantDocument,
    "\n  query MyRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        ...RestaurantParts\n        promotedUntil\n      }\n    }\n  }\n": types.MyRestaurantsDocument,
    "\n  mutation VerifyEmail($verifyEmailInput: VerifyEmailInput!) {\n    verifyEmail(input: $verifyEmailInput) {\n      ok\n      error\n    }\n  }\n": types.VerifyEmailDocument,
    "\n          fragment VerifiedUser on User {\n            verified\n          }\n        ": types.VerifiedUserFragmentDoc,
    "\n  mutation EditProfile($editProfileInput: EditProfileInput!) {\n    editProfile(input: $editProfileInput) {\n      ok\n      error\n    }\n  }\n": types.EditProfileDocument,
    "\n            fragment EditedUser on User {\n              verified\n              email\n            }\n          ": types.EditedUserFragmentDoc,
    "\n  query GetOrder($getOrderInput: GetOrderInput!) {\n    getOrder(input: $getOrderInput) {\n      ok\n      error\n      order {\n        ...OrderParts\n      }\n    }\n  }\n": types.GetOrderDocument,
    "\n  subscription OrderUpdates($orderUpdatesInput: OrderUpdatesInput!) {\n    orderUpdates(input: $orderUpdatesInput) {\n      ...OrderParts\n    }\n  }\n": types.OrderUpdatesDocument,
    "\n  subscription PendingOrders {\n    pendingOrders {\n      ...OrderParts\n    }\n  }\n": types.PendingOrdersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditOrder($editOrderInput: EditOrderInput!) {\n    editOrder(input: $editOrderInput) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation EditOrder($editOrderInput: EditOrderInput!) {\n    editOrder(input: $editOrderInput) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrders($getOrdersInput: GetOrdersInput!) {\n    getOrders(input: $getOrdersInput) {\n      ok\n      error\n      orders {\n        ...OrderParts\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetOrders($getOrdersInput: GetOrdersInput!) {\n    getOrders(input: $getOrdersInput) {\n      ok\n      error\n      orders {\n        ...OrderParts\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RestaurantParts on Restaurant {\n    id\n    name\n    coverImg\n    category {\n      name\n    }\n    address\n    isPromoted\n  }\n"): (typeof documents)["\n  fragment RestaurantParts on Restaurant {\n    id\n    name\n    coverImg\n    category {\n      name\n    }\n    address\n    isPromoted\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryParts on Category {\n    id\n    name\n    coverImg\n    slug\n    restaurantCount\n  }\n"): (typeof documents)["\n  fragment CategoryParts on Category {\n    id\n    name\n    coverImg\n    slug\n    restaurantCount\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment DishParts on Dish {\n    id\n    name\n    price\n    photo\n    description\n    options {\n      name\n      extra\n      choices {\n        name\n        extra\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment DishParts on Dish {\n    id\n    name\n    price\n    photo\n    description\n    options {\n      name\n      extra\n      choices {\n        name\n        extra\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrderParts on Order {\n    id\n    status\n    total\n    driver {\n      email\n    }\n    customer {\n      email\n    }\n    restaurant {\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment OrderParts on Order {\n    id\n    status\n    total\n    driver {\n      email\n    }\n    customer {\n      email\n    }\n    restaurant {\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Category($categoryInput: CategoryInput!) {\n    category(input: $categoryInput) {\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n      category {\n        ...CategoryParts\n      }\n    }\n  }\n"): (typeof documents)["\n  query Category($categoryInput: CategoryInput!) {\n    category(input: $categoryInput) {\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n      category {\n        ...CategoryParts\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Restaurant($restaurantId: Float!) {\n    restaurant(restaurantId: $restaurantId) {\n      restaurant {\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Restaurant($restaurantId: Float!) {\n    restaurant(restaurantId: $restaurantId) {\n      restaurant {\n        ...RestaurantParts\n        menu {\n          ...DishParts\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateOrder($createOrderInput: CreateOrderInput!) {\n    createOrder(input: $createOrderInput) {\n      ok\n      error\n      orderId\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOrder($createOrderInput: CreateOrderInput!) {\n    createOrder(input: $createOrderInput) {\n      ok\n      error\n      orderId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RestaurantsPage($restaurantsInput: RestaurantsInput!) {\n    allCategories {\n      ok\n      error\n      categories {\n        ...CategoryParts\n      }\n    }\n\n    restaurants(input: $restaurantsInput) {\n      totalPages\n      totalResults\n      results {\n        ...RestaurantParts\n      }\n    }\n  }\n"): (typeof documents)["\n  query RestaurantsPage($restaurantsInput: RestaurantsInput!) {\n    allCategories {\n      ok\n      error\n      categories {\n        ...CategoryParts\n      }\n    }\n\n    restaurants(input: $restaurantsInput) {\n      totalPages\n      totalResults\n      results {\n        ...RestaurantParts\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchRestaurant($searchRestaurantInput: SearchRestaurantInput!) {\n    searchRestaurant(input: $searchRestaurantInput) {\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n"): (typeof documents)["\n  query SearchRestaurant($searchRestaurantInput: SearchRestaurantInput!) {\n    searchRestaurant(input: $searchRestaurantInput) {\n      totalPages\n      totalResults\n      restaurants {\n        ...RestaurantParts\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      token\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation Login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      token\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDish($createDishInput: CreateDishInput!) {\n    createDish(input: $createDishInput) {\n      ok\n      error\n      dishId\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDish($createDishInput: CreateDishInput!) {\n    createDish(input: $createDishInput) {\n      ok\n      error\n      dishId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateRestaurant($createRestaurantInput: CreateRestaurantInput!) {\n    createRestaurant(input: $createRestaurantInput) {\n      ok\n      error\n      restaurantId\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRestaurant($createRestaurantInput: CreateRestaurantInput!) {\n    createRestaurant(input: $createRestaurantInput) {\n      ok\n      error\n      restaurantId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query allCategories {\n    allCategories {\n      ok\n      error\n      categories {\n        name\n        coverImg\n      }\n    }\n  }\n"): (typeof documents)["\n  query allCategories {\n    allCategories {\n      ok\n      error\n      categories {\n        name\n        coverImg\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditDish($editDishInput: EditDishInput!) {\n    editDish(input: $editDishInput) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation EditDish($editDishInput: EditDishInput!) {\n    editDish(input: $editDishInput) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyDish($myDishInput: MyDishInput!) {\n    myDish(input: $myDishInput) {\n      ok\n      error\n      dish {\n        ...DishParts\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyDish($myDishInput: MyDishInput!) {\n    myDish(input: $myDishInput) {\n      ok\n      error\n      dish {\n        ...DishParts\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditRestaurant($editRestaurantInput: EditRestaurantInput!) {\n    editRestaurant(input: $editRestaurantInput) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation EditRestaurant($editRestaurantInput: EditRestaurantInput!) {\n    editRestaurant(input: $editRestaurantInput) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyRestaurant($restaurantId: Float!) {\n    myRestaurant(restaurantId: $restaurantId) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n        promotedUntil\n        menu {\n          ...DishParts\n        }\n        orders {\n          id\n          createdAt\n          total\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyRestaurant($restaurantId: Float!) {\n    myRestaurant(restaurantId: $restaurantId) {\n      ok\n      error\n      restaurant {\n        ...RestaurantParts\n        promotedUntil\n        menu {\n          ...DishParts\n        }\n        orders {\n          id\n          createdAt\n          total\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        ...RestaurantParts\n        promotedUntil\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        ...RestaurantParts\n        promotedUntil\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyEmail($verifyEmailInput: VerifyEmailInput!) {\n    verifyEmail(input: $verifyEmailInput) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyEmail($verifyEmailInput: VerifyEmailInput!) {\n    verifyEmail(input: $verifyEmailInput) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          fragment VerifiedUser on User {\n            verified\n          }\n        "): (typeof documents)["\n          fragment VerifiedUser on User {\n            verified\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditProfile($editProfileInput: EditProfileInput!) {\n    editProfile(input: $editProfileInput) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation EditProfile($editProfileInput: EditProfileInput!) {\n    editProfile(input: $editProfileInput) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n            fragment EditedUser on User {\n              verified\n              email\n            }\n          "): (typeof documents)["\n            fragment EditedUser on User {\n              verified\n              email\n            }\n          "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrder($getOrderInput: GetOrderInput!) {\n    getOrder(input: $getOrderInput) {\n      ok\n      error\n      order {\n        ...OrderParts\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetOrder($getOrderInput: GetOrderInput!) {\n    getOrder(input: $getOrderInput) {\n      ok\n      error\n      order {\n        ...OrderParts\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription OrderUpdates($orderUpdatesInput: OrderUpdatesInput!) {\n    orderUpdates(input: $orderUpdatesInput) {\n      ...OrderParts\n    }\n  }\n"): (typeof documents)["\n  subscription OrderUpdates($orderUpdatesInput: OrderUpdatesInput!) {\n    orderUpdates(input: $orderUpdatesInput) {\n      ...OrderParts\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription PendingOrders {\n    pendingOrders {\n      ...OrderParts\n    }\n  }\n"): (typeof documents)["\n  subscription PendingOrders {\n    pendingOrders {\n      ...OrderParts\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;