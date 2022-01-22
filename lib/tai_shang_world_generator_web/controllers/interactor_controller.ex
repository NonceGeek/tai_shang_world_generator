defmodule TaiShangWorldGeneratorWeb.InteractorController do
  alias TaiShangWorldGeneratorWeb.ResponseMod
  alias TaiShangWorldGenerator.GameEventHandler
  use TaiShangWorldGeneratorWeb, :controller

  def interact_first_time(conn,
    %{
      "block_height" => block_height,
      "x" => x,
      "y" => y} = _params) do
    result =
      GameEventHandler.triggered_event(block_height, x, y)
    do_interact_first_time(conn, result)
  end

  def do_interact_first_time(conn, {:ok, event_map}) do
    json(conn, ResponseMod.get_res(%{
      event: event_map
    }, :ok))
  end

  def do_interact_first_time(conn, {:error, error_info}) do
    json(conn, ResponseMod.get_res(inspect(error_info), :error))
  end

  def interact_second_time(conn,  %{"block_height" => block_height, "x" => x, "y" => y, "signature" => signature, "payload" => payload} = params) do
    json(conn, ResponseMod.get_res(%{}, :ok))
  end
  def interact_second_time(conn, params) do
    json(conn, ResponseMod.get_res("params name not correct or missed: got " <> inspect(params), :error))
  end
end
