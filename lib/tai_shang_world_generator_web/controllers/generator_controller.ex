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
    {:ok, %{hash: block_hash}} =
      BlockchainFetcher.abstract_block_by_block_number(block_num)
    type =
      block_hash
      |> TypeTranslator.hex_to_bin()
      |> MapTranslator.get_type(rule_name)
    map =
      block_num
      |> BlockchainFetcher.get_blocks(block_num, :txs)
      |> BlockchainFetcher.hex_to_bin_batch()
      |> MapTranslator.bin_list_to_list_2d()
      |> MapTranslator.handle_map_by_rule(rule_name)
    description =
      MapTranslator.get_ele_description(rule_name)
    json(conn, ResponseMod.get_res(
      %{
        map: map,
        type: type,
        ele_description: description
      }, :ok)
    )
  end
end
