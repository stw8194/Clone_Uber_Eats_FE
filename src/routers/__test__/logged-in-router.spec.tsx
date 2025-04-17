import { render, screen, waitFor } from "@testing-library/react";
import { LoggedInRouter } from "../logged-in-router";
import { useMe } from "../../hooks/useMe";

jest.mock("../../hooks/useMe", () => ({
  useMe: jest.fn(),
}));
const mockUseMe = useMe as jest.Mock;

jest.mock("../../pages/client/restaurants", () => {
  return {
    Restaurants: () => <span>restaurants-component</span>,
  };
});

jest.mock("../../pages/user/confirm-email", () => {
  return {
    ConfirmEmail: () => <span>confirm-email-component</span>,
  };
});

jest.mock("../../pages/user/edit-profile", () => {
  return {
    EditProfile: () => <span>edit-profile-component</span>,
  };
});

jest.mock("../../pages/client/search", () => {
  return {
    Search: () => <span>search-component</span>,
  };
});

jest.mock("../../pages/client/category", () => {
  return {
    Category: () => <span>category-component</span>,
  };
});

jest.mock("../../pages/client/restaurant", () => {
  return {
    Restaurant: () => <span>restaurant-component</span>,
  };
});

jest.mock("../../pages/404", () => {
  return {
    NotFound: () => <span>404-not-found-component</span>,
  };
});

describe("<LoggedInRouter /> route test", () => {
  beforeEach(() => {
    mockUseMe.mockReturnValue({
      data: {
        me: {
          id: 1,
          email: "test@will.work",
          role: "Client",
          verified: true,
        },
      },
      loading: false,
      error: null,
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("renders Restaurants at '/'", async () => {
    window.history.pushState({}, "", "/");
    render(<LoggedInRouter />);

    await waitFor(() => {
      expect(screen.getByText("restaurants-component")).toBeInTheDocument();
    });
  });

  it("renders ConfirmEmail at '/confirm'", async () => {
    window.history.pushState({}, "", "/confirm?code=test");
    render(<LoggedInRouter />);

    await waitFor(() => {
      expect(screen.getByText("confirm-email-component")).toBeInTheDocument();
    });
  });

  it("renders EditProfile at '/edit-profile'", async () => {
    window.history.pushState({}, "", "/edit-profile");
    render(<LoggedInRouter />);

    await waitFor(() => {
      expect(screen.getByText("edit-profile-component")).toBeInTheDocument();
    });
  });

  it("renders Search at '/search'", async () => {
    window.history.pushState({}, "", "/search");
    render(<LoggedInRouter />);

    await waitFor(() => {
      expect(screen.getByText("search-component")).toBeInTheDocument();
    });
  });

  it("renders Category at '/category/:slug'", async () => {
    window.history.pushState({}, "", "/category/slug");
    render(<LoggedInRouter />);

    await waitFor(() => {
      expect(screen.getByText("category-component")).toBeInTheDocument();
    });
  });

  it("renders Restaurant at '/restaurant/:id'", async () => {
    window.history.pushState({}, "", "/restaurant/id");
    render(<LoggedInRouter />);

    await waitFor(() => {
      expect(screen.getByText("restaurant-component")).toBeInTheDocument();
    });
  });

  it("renders NotFound at invalid route", async () => {
    window.history.pushState({}, "", "/invalid-path");
    render(<LoggedInRouter />);

    await waitFor(() => {
      expect(screen.getByText("404-not-found-component")).toBeInTheDocument();
    });
  });

  it("should render loading state", () => {
    (useMe as jest.Mock).mockReturnValueOnce({
      data: null,
      loading: true,
      error: null,
    });
    render(<LoggedInRouter />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
