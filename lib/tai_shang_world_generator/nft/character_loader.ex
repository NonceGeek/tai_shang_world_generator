defmodule TaiShangWorldGenerator.Nft.CharacterLoader do
  alias TaiShangWorldGenerator.NftInteractor
  alias TaiShangWorldGenerator.Chain
  @keys [
    :first,
    :second,
    :third,
    :fourth,
    :fifth,
    :sixth
  ]

  def load_character(%Chain{endpoint: endpoint}, contract_addr, token_id) do
    # TODO, just Mock it
    # See Parser in:
    # https://github.com/WeLightProject/tai_shang_nft_gallery/blob/main/lib/tai_shang_nft_gallery/nft/parser.ex
    token_uri(contract_addr, token_id, [url: endpoint])
  end

  def token_uri(contract_addr, token_id, endpoint \\ []) do
    %{img_parsed: img_parsed} = NftInteractor.token_uri(contract_addr, token_id, endpoint)
    IO.inspect(img_parsed)
    %{ elements: get_nums_in_svg(img_parsed),
       badges: get_badges_list(img_parsed)
    }
  end

  def get_badges_list(img_parsed) do
    value =
      img_parsed
      |> String.split("Badges:")
      |> Enum.drop(1)
      |> Enum.map(&(String.split(&1, "class=\"base\">") |> Enum.at(1)))
      |> Enum.map(&(String.split(&1, "</text") |> Enum.at(0)))
      |> Enum.at(0)
      |> String.trim
      cond do
        value == "" ->
           []
        true ->
         Jason.decode!(value)
    end
  end

  def get_nums_in_svg(img_parsed) do
    value =
      img_parsed
      |> String.split("class=\"base\">")
      |> Enum.drop(1)
      |> Enum.map(&String.at(&1, 0))
      |> Enum.reject(&(Integer.parse(&1) == :error))
      |> Enum.map(&String.to_integer(&1))

    # value
    @keys
    |> Enum.zip(value)
    |> Enum.into(%{})
  end
end
