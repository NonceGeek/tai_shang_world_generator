defmodule TaiShangWorldGeneratorWeb.GeneratorController do
  alias TaiShangWorldGenerator.{BlockchainFetcher, MapTranslator}
  alias TaiShangWorldGeneratorWeb.ResponseMod
  use TaiShangWorldGeneratorWeb, :controller




  def gen(conn, params) do
    params_atom =  ExStructTranslator.to_atom_struct(params)
    do_gen(conn, params_atom)
  end

  def do_gen(conn, %{
    source: "txs",
    block_number: %{
      first: begin_num,
      last: last_num
    },
    rule: rule_name
  }) do
    map =
      begin_num
      |> BlockchainFetcher.get_blocks(last_num, :txs)
      |> BlockchainFetcher.hex_to_bin_batch()
      |> MapTranslator.bin_list_to_list_2d()
      |> MapTranslator.handle_map_by_rule(rule_name)
    json(conn, ResponseMod.get_res(%{map: map}, :ok))
  end
end
