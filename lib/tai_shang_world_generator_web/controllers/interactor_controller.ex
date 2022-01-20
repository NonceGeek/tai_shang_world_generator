defmodule TaiShangWorldGeneratorWeb.InteractorController do
  alias TaiShangWorldGeneratorWeb.ResponseMod

  use TaiShangWorldGeneratorWeb, :controller

  def interact_first_time(conn, %{"block_height" => block_height, "x" => x, "y" => y} = params) do
    json(conn, ResponseMod.get_res(%{}, :ok))
  end
  def interact_first_time(conn, params) do
    json(conn, ResponseMod.get_res("params name not correct or missed: got " <> inspect(params), :error))
  end

  def interact_second_time(conn,  %{"block_height" => block_height, "x" => x, "y" => y, "signature" => signature, "payload" => payload} = params) do
    json(conn, ResponseMod.get_res(%{}, :ok))
  end
  def interact_second_time(conn, params) do
    json(conn, ResponseMod.get_res("params name not correct or missed: got " <> inspect(params), :error))
  end
end
