defmodule TaiShangWorldGeneratorWeb.Router do
  use TaiShangWorldGeneratorWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {TaiShangWorldGeneratorWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :api_allow_cross do
    plug CORSPlug, origin: [~r/.*/]
    plug :accepts, ["json"]
  end

  scope "/", TaiShangWorldGeneratorWeb do
    pipe_through :browser
    live "/", MapShowerLive, :index
    # get "/", PageController, :index
  end


  # Other scopes may use custom stacks.
  scope "/tai_shang_world_generator/api/v1", TaiShangWorldGeneratorWeb do
    pipe_through :api_allow_cross

    # event
    get "/events", InteractorController, :get_events_by_block_height
    get "/interact", InteractorController, :interact_first_time
    post "/interact", InteractorController, :interact_second_time

    # map
    post "/gen_map", GeneratorController, :gen

    #nft
    post "/mint", NFTMinterController, :mint
    get  "/character/load_character", NFTLoaderController, :load_character
    get  "/character/get_info", NFTLoaderController, :get_info

    # blockchain
    get "/get_last_block_num", ChainController, :get_last_block_num

  end

  scope "/tai_shang_world_generator/api/v1/admin", TaiShangWorldGeneratorWeb do
    # TODO: api about setting game event, create AdminController
    post "/create_game_event", AdminController, :create_game_event
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser
      # live_dashboard "/dashboard", metrics: TaiShangWorldGeneratorWeb.Telemetry
    end
  end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
