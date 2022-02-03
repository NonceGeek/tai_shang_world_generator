defmodule TaiShangWorldGeneratorWeb.NFTLoaderController do
  alias TaiShangWorldGenerator.Chain
  alias TaiShangWorldGeneratorWeb.ResponseMod
  alias TaiShangWorldGenerator.Nft.CharacterLoader

  use TaiShangWorldGeneratorWeb, :controller

  def load(conn, %{
    "chain_name" => chain_name,
    "contract_addr" => contract_addr,
    "token_id" => token_id
  }) do
    chain = Chain.get_by_name(chain_name)
    character =
      CharacterLoader.load_character(chain, contract_addr, token_id)
    json(conn, ResponseMod.get_res(%{
    character_info: character
      }, :ok))
  end
  # def mint(conn, %{"contract_addr" => contract_addr, "token_id" => token_id}) do

  #   with {:ok, _} <- Coupon.use_coupon(coupon_id) do
  #       token_info = do_mint(params)
  #       json(conn, ResponseMod.get_res(%{
  #           token_info: token_info
  #         }, :ok))
  #     else
  #       {:error, msg} ->
  #         json(conn,
  #           ResponseMod.get_res(inspect(msg), :error)
  #         )
  #   end
  # end

  # def do_mint(_params) do
  #   %{
  #     contract_addr: "0x545EDf91e91b96cFA314485F5d2A1757Be11d384",
  #     token_id: 1,
  #     minter_name: "leeduckgo",
  #     tx_id: "0xdeadcc753c6dcb7a08ff70336ba3f181d4034f5afcd34fb6d20f51d35b6ec93c",
  #   }
  # end
end
