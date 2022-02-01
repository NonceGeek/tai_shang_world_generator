defmodule TaiShangWorldGeneratorWeb.AdminController do
  alias TaiShangWorldGeneratorWeb.ResponseMod
  alias TaiShangWorldGenerator.GameEvent
  use TaiShangWorldGeneratorWeb, :controller

  def create_game_event(conn, %{
    "admin_key" => client_admin_key,
    "payload" => payload } = _params) do
    sys_admin_key = System.fetch_env!("ADMIN_KEY")

    if client_admin_key == sys_admin_key do
      {:ok, event} = GameEvent.create(ExStructTranslator.to_atom_struct(payload))
      json(conn, ResponseMod.get_res(%{ msg: "success" }, :ok))
    else
      json(conn, ResponseMod.get_res(%{ error_msg: "Unauthenticated" }, :error))
    end
  end

end
