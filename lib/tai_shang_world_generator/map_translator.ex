defmodule TaiShangWorldGenerator.MapTranslator do
  alias Utils.TypeTranslator
  @rule_class "Rule"

  @doc """
    ```elixir
    alias TaiShangWorldGenerator.{BlockchainFetcher, MapTranslator}
    begin_num =
      BlockchainFetcher.get_block_number()
    begin_num
    |> BlockchainFetcher.get_blocks(begin_num, :txs)
    |> BlockchainFetcher.hex_to_bin_batch()
    |> MapTranslator.bin_list_to_list_2d()
    |> MapTranslator.handle_map_by_rule("RuleA")
    ```
  """
  @spec bin_list_to_list_2d(list()) :: list()
  def bin_list_to_list_2d(bin_list) do
    Enum.map(bin_list, fn bin ->
      TypeTranslator.bin_to_list(bin)
    end)
  end

  @doc """
    //TODO: async to optimize
  """
  def handle_map_by_rule(list_2d, rule) do
    rule_mod = TypeTranslator.str_to_module(@rule_class, rule)
    Enum.map(list_2d, fn line ->
      handle_line_by_rule(line, rule_mod)
    end)
  end

  @doc """
    //TODO: async to optimize
  """
  def handle_line_by_rule(line, rule_mod) do
    Enum.map(line, fn ele ->
      apply(rule_mod, :handle_ele, [ele])
    end)
  end

  def get_types(hash, rule) do
    rule_mod = TypeTranslator.str_to_module(@rule_class, rule)
    apply(rule_mod, :get_types, [hash])
  end

  # +-----------+
  # | Behaviour |
  # +-----------+
  defmodule Behaviour do
    @moduledoc """
    the behaviour of MapTranslator.
    """
    @callback handle_ele(
      ele :: integer()
      ) :: integer()

    @callback get_type(
      hash :: binary()
      ) :: String.t()
  end
end
