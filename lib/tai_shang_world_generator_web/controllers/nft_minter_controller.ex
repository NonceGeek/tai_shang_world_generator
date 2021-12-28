defmodule TaiShangWorldGeneratorWeb.NFTMinterController do
  alias TaiShangWorldGenerator.Coupon
  alias TaiShangWorldGeneratorWeb.ResponseMod

  use TaiShangWorldGeneratorWeb, :controller

  def mint(conn, %{"coupon_id" => coupon_id} = params) do
    with {:ok, _} <- Coupon.use_coupon(coupon_id) do
        token_info = do_mint(params)
        json(conn, ResponseMod.get_res(%{
            token_info: token_info
          }, :ok))
      else
        {:error, msg} ->
          json(conn,
            ResponseMod.get_res(inspect(msg), :error)
          )
    end
  end

  def do_mint(_params) do
    %{
      contract_addr: "0x01",
      token_id: 1,
      minter_name: "leeduckgo",
      tx_id: "0x0"
    }
  end
end
