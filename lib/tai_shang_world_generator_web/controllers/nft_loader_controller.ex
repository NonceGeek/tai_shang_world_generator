defmodule TaiShangWorldGeneratorWeb.NFTLoaderController do
  alias TaiShangWorldGenerator.Chain
  alias TaiShangWorldGeneratorWeb.ResponseMod
  alias TaiShangWorldGenerator.Nft.CharacterLoader

  use TaiShangWorldGeneratorWeb, :controller

  @contract_addrs ["0xb6FC950C4bC9D1e4652CbEDaB748E8Cdcfe5655F"]
  def get_info(conn, _params) do
    chains =
      Chain.get_all()
      |> Enum.map(fn chain ->
        chain
        |> ExStructTranslator.struct_to_map()
        |> Map.put(:contract_addrs, @contract_addrs)
      end)
    json(conn, %{
      chains: chains
    })
  end
  def load_character(conn, %{
    "chain_name" => chain_name,
    "contract_addr" => contract_addr,
    "token_id" => token_id
  }) do
    chain = Chain.get_by_name(chain_name)
    token_id_int = String.to_integer(token_id)
    character =
      CharacterLoader.load_character(chain, contract_addr, token_id_int)
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
