defmodule TaiShangWorldGeneratorWeb.GeneratorController do
  alias TaiShangWorldGenerator.{BlockchainFetcher, MapTranslator}
  alias TaiShangWorldGenerator.NftInteractor
  alias TaiShangWorldGeneratorWeb.ResponseMod
  alias Utils.TypeTranslator

  use TaiShangWorldGeneratorWeb, :controller

  @default_contract_addr "0x545EDf91e91b96cFA314485F5d2A1757Be11d384"
  @default_rule "RuleA"

  def gen(conn, params) do
    params_atom =  ExStructTranslator.to_atom_struct(params)
    do_gen(conn, params_atom)
  end

  def do_gen(conn, %{
    source: "a_block",
    block_number: block_num,
    rule: rule_name
  }) do
    payload = MapTranslator.get_map_by_block_num_and_rule_name(block_num, rule_name)
    json(conn, ResponseMod.get_res(payload, :ok))
  end

  def do_gen(conn, %{
    contract_id: contract_id,
    token_id: token_id
  }) do
    abstract_map =
      @default_contract_addr
      |> NftInteractor.get_block_height_for_token(
        token_id
      )
      |> MapTranslator.get_map_by_block_num_and_rule_name(
        @default_rule
        )
    json(conn, ResponseMod.get_res(abstract_map, :ok))
  end
end
