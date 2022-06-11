defmodule TaiShangWorldGeneratorWeb.MapShowerLive do
  use TaiShangWorldGeneratorWeb, :live_view

  alias TaiShangWorldGenerator.NftInteractor
  alias TaiShangWorldGenerator.MapTranslator
  alias Utils.Constants
  @default_rule "RuleA"
  @impl true
  def mount(%{
    "contract_id" => _contract_id,
    "token_id" => token_id
  }, _session, socket) do

    abstract_map =
      :default_contract_addr
      |> Constants.get_env()
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
