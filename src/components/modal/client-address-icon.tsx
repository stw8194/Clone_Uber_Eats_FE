import { forwardRef, useState } from "react";
import DaumPostcodeEmbed, { Address } from "react-daum-postcode";
import { useJsApiLoader } from "@react-google-maps/api";
import { graphql } from "../../gql";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import {
  ChangeClientAddressMutation,
  ChangeClientAddressMutationVariables,
  ClientAddressesQuery,
  ClientAddressesQueryVariables,
  CreateClientAddressMutation,
  CreateClientAddressMutationVariables,
  DeleteClientAddressMutation,
  DeleteClientAddressMutationVariables,
} from "../../gql/graphql";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircle,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { useMe } from "../../hooks/useMe";

const CREATE_CLIENT_ADDRESS_MUTATION = graphql(`
  mutation CreateClientAddress(
    $createClientAddressInput: CreateClientAddressInput!
  ) {
    createClientAddress(input: $createClientAddressInput) {
      ok
      error
      addressId
      address
      lat
      lng
    }
  }
`);

const CLIENT_ADDRESSES_QUERY = graphql(`
  query ClientAddresses {
    clientAddresses {
      ok
      error
      addresses {
        id
        address
        lat
        lng
      }
    }
  }
`);

const CHANGE_SELECTED_CLIENT_ADDRESS_QUERY = graphql(`
  mutation ChangeClientAddress(
    $changeSelectedClientAddressInput: ChangeSelectedClientAddressInput!
  ) {
    changeSelectedClientAddress(input: $changeSelectedClientAddressInput) {
      ok
      error
    }
  }
`);

const DELETE_CLIENT_ADDRESS_QUERY = graphql(`
  mutation DeleteClientAddress(
    $deleteClientAddressInput: DeleteClientAddressInput!
  ) {
    deleteClientAddress(input: $deleteClientAddressInput) {
      ok
      error
    }
  }
`);

interface IClientAddressIconProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ClientAddressIcon = forwardRef<
  HTMLDivElement,
  IClientAddressIconProps
>(({ setIsOpen }, ref) => {
  const [isPostCodeOpen, setIsPostCodeOpen] = useState(false);
  const client = useApolloClient();
  const { data: userData } = useMe();

  const [createClientAddressMutation] = useMutation<
    CreateClientAddressMutation,
    CreateClientAddressMutationVariables
  >(CREATE_CLIENT_ADDRESS_MUTATION, {
    onCompleted: (data: CreateClientAddressMutation) => {
      const {
        createClientAddress: { ok, addressId, address, lat, lng },
      } = data;
      const queryResult = client.readQuery({
        query: CLIENT_ADDRESSES_QUERY,
      });
      if (
        ok &&
        lat &&
        lng &&
        address &&
        addressId &&
        userData?.me &&
        queryResult?.clientAddresses.addresses
      ) {
        client.writeQuery({
          query: CLIENT_ADDRESSES_QUERY,
          data: {
            clientAddresses: {
              ...queryResult?.clientAddresses,
              addresses: [
                ...queryResult?.clientAddresses.addresses,
                {
                  id: +addressId,
                  lat: +lat,
                  lng: +lng,
                  address: address,
                  __typename: "Address",
                },
              ],
            },
          },
        });
        client.writeFragment({
          id: `User:${userData.me.id}`,
          fragment: gql`
            fragment SelectedUser on User {
              selectedAddress {
                id
              }
            }
          `,
          data: {
            selectedAddress: {
              __typename: "Address",
              id: addressId,
            },
          },
        });
      }
    },
  });

  const { data: clientAddressesQueryResults, loading } = useQuery<
    ClientAddressesQuery,
    ClientAddressesQueryVariables
  >(CLIENT_ADDRESSES_QUERY);

  const [changeSelectedClientAddressMutation] = useMutation<
    ChangeClientAddressMutation,
    ChangeClientAddressMutationVariables
  >(CHANGE_SELECTED_CLIENT_ADDRESS_QUERY);

  const [deleteClientAddressMutation] = useMutation<
    DeleteClientAddressMutation,
    DeleteClientAddressMutationVariables
  >(DELETE_CLIENT_ADDRESS_QUERY);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });
  const handleComplete = (data: Address) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        address: data.roadAddressEnglish,
      },
      (results) => {
        if (results) {
          const { lat, lng } = results[0].geometry.location;
          createClientAddressMutation({
            variables: {
              createClientAddressInput: {
                lat: lat(),
                lng: lng(),
                address: data.roadAddressEnglish,
              },
            },
          });
        }
      }
    );

    setIsPostCodeOpen(false);
    setIsOpen(false);
  };

  const onDeleteClick = (addressId: number) => {
    deleteClientAddressMutation({
      variables: {
        deleteClientAddressInput: {
          addressId,
        },
      },
    });
    client.cache.evict({
      id: client.cache.identify({ __typename: "Address", id: addressId }),
    });
    client.cache.gc();
  };

  const onChangeClick = (addressId: number) => {
    changeSelectedClientAddressMutation({
      variables: {
        changeSelectedClientAddressInput: {
          addressId,
        },
      },
      onCompleted: (data: ChangeClientAddressMutation) => {
        const {
          changeSelectedClientAddress: { ok },
        } = data;
        if (ok && userData?.me.id) {
          client.writeFragment({
            id: `User:${userData.me.id}`,
            fragment: gql`
              fragment SelectedUser on User {
                selectedAddress {
                  id
                }
              }
            `,
            data: {
              selectedAddress: {
                __typename: "Address",
                id: addressId,
              },
            },
          });
        }
      },
    });
  };

  return (
    <div
      ref={ref}
      className="fixed left-1/12 mt-2 w-82 bg-gray-100 p-4 rounded shadow-xl z-50 origin-top-right transform scale-95 opacity-0 animate-dropdown"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col">
        {!loading &&
          !isPostCodeOpen &&
          clientAddressesQueryResults?.clientAddresses.addresses?.map(
            (address) => {
              const isSelected =
                address.id === userData?.me.selectedAddress?.id;
              return (
                <div
                  key={address.id}
                  className="flex justify-between w-full items-center mb-3"
                >
                  <ToggleGroup
                    type="single"
                    value={address.address}
                    onValueChange={() => onChangeClick(address.id)}
                  >
                    <ToggleGroupItem
                      value={String(userData?.me.selectedAddress?.address)}
                      aria-label={address.address}
                      className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
                    >
                      <FontAwesomeIcon
                        className={`${
                          isSelected
                            ? "text-lime-600"
                            : "text-white border border-gray-400 rounded-full"
                        }`}
                        icon={isSelected ? faCheckCircle : faCircle}
                      />
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <div className="w-2/3 truncate">{address.address}</div>
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    onClick={() => onDeleteClick(address.id)}
                    icon={faTrashCan}
                  />
                </div>
              );
            }
          )}
        {!isPostCodeOpen && (
          <button
            className="bg-lime-600 hover:bg-lime-700 p-2 mt-2 rounded-lg cursor-pointer"
            onClick={() => {
              setIsPostCodeOpen(true);
            }}
          >
            Add address
          </button>
        )}
        {isLoaded && isPostCodeOpen && (
          <div>
            <DaumPostcodeEmbed onComplete={handleComplete} />
          </div>
        )}
      </div>
    </div>
  );
});
