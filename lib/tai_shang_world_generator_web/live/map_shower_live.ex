defmodule TaiShangWorldGeneratorWeb.MapShowerLive do
  use TaiShangWorldGeneratorWeb, :live_view

  alias TaiShangWorldGenerator.NftInteractor
  alias TaiShangWorldGenerator.MapTranslator

  @default_contract_addr "0x9c0C846705E95632512Cc8D09e24248AbFd6D679"
  @default_rule "RuleA"
  @impl true
  def mount(%{
    "contract_id" => _contract_id,
    "token_id" => token_id
  }, _session, socket) do

    abstract_map =
      @default_contract_addr
      |> NftInteractor.get_block_height_for_token(
        String.to_integer(token_id)
      )
      |> MapTranslator.get_map_by_block_num_and_rule_name(
        @default_rule
        )
    {
      :ok,
      socket
      |> assign(
        map_2d: abstract_map
      )
  }
  end

end
