defmodule TaiShangWorldGeneratorWeb.GeneratorController do
  alias TaiShangWorldGenerator.{BlockchainFetcher, MapTranslator}
  alias TaiShangWorldGeneratorWeb.ResponseMod
  alias Utils.TypeTranslator

  use TaiShangWorldGeneratorWeb, :controller

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
end
