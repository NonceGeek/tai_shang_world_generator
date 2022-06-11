defmodule TaiShangWorldGeneratorWeb.GeneratorController do
  alias TaiShangWorldGenerator.{BlockchainFetcher, MapTranslator}
  alias TaiShangWorldGenerator.NftInteractor
  alias TaiShangWorldGeneratorWeb.ResponseMod
  alias Utils.{Constants, TypeTranslator}

  use TaiShangWorldGeneratorWeb, :controller


  @default_rule "RuleA"

  def gen(conn, params) do
    params_atom =  ExStructTranslator.to_atom_struct(params)
    do_gen(conn, params_atom)
  end

  # def get_map(conn, params) do
  #   params_atom =  ExStructTranslator.to_atom_struct(params)
  #   do_get(conn, params_atom)
  # end

  def do_gen(conn, %{
    source: "a_block",
    block_number: block_num,
    rule: rule_name
  }) do
    payload = MapTranslator.get_map_by_block_num_and_rule_name(block_num, rule_name)
    json(conn, ResponseMod.get_res(payload, :ok))
  end

  def do_gen(conn, %{
    source: "a_block",
    block_number: block_num,
    type: type
  }) do
    payload =
      case type do
        "gallery" ->
          MapTranslator.get_map_by_block_num_and_rule_name(block_num, "RuleDefaultGallery")
        "event" ->
          MapTranslator.get_map_by_block_num_and_rule_name(block_num, "RuleDefaultEvent")
      end
    json(conn, ResponseMod.get_res(payload, :ok))
  end

  def do_gen(conn, %{
    contract_id: contract_id,
    token_id: token_id
  }) do
    block_height =
      NftInteractor.get_block_height_for_token(
        Constants.get_env(:default_contract_addr),
        token_id
      )
    abstract_map =
      block_height
      |> MapTranslator.get_map_by_block_num_and_rule_name(@default_rule)
      |> Map.put(:block_height, block_height)
    json(conn, ResponseMod.get_res(abstract_map, :ok))
  end
end
