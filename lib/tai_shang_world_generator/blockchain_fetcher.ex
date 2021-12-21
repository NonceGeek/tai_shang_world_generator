defmodule TaiShangWorldGenerator.BlockchainFetcher do
  @moduledoc """
    Fetch Data from Ethereum Type Blockchain.
  """

  alias Utils.TypeTranslator
  alias Ethereumex.HttpClient

  @doc """
    get_blocks -> abstract_block_by_block_number -> get_block_by_number
  """
  @spec get_blocks(integer, integer, :hash | :txs) :: list()
  def get_blocks(begin_number, last_number, txs_or_hash) do
    begin_number..last_number
    |> Enum.reduce([], fn num_int, acc ->
      {:ok, res} =
      num_int
      |> abstract_block_by_block_number()
      res
      |> Map.get(txs_or_hash)
      |> combine_res(acc)
    end)
  end

  @doc """
    int
    |> get_block_by_number()
    |> abstract_txs_&_block_hash()
  """
  @spec abstract_block_by_block_number(integer) :: {:ok, map()} | {:error, String.t()}
  def abstract_block_by_block_number(num_int) do
    case get_block_by_number(num_int) do
      {:ok,
      %{
        "hash" => hash,
        "transactions" => txs
      }} ->
        {:ok, %{txs: txs, hash: hash}}
      {:error, msg} ->
        {:error, inspect(msg)}
    end
  end

  def combine_res(res, acc) when is_list(res), do: acc ++ res
  def combine_res(res, acc), do: acc ++ [res]

  @spec get_block_by_number(integer) ::
          {:error, atom | binary | map} | {:ok, map()}
  def get_block_by_number(num_int) do
    num_int
    |> TypeTranslator.int_to_hex()
    |> HttpClient.eth_get_block_by_number(false)
  end

  @spec get_block_number :: integer
  def get_block_number() do
    {:ok, hex} = HttpClient.eth_block_number()
    TypeTranslator.hex_to_int(hex)
  end



end
