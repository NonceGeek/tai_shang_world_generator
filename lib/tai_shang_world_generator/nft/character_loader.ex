defmodule TaiShangWorldGenerator.Nft.CharacterLoader do

  def load_character(chain, contract_addr, token_id) do
    # TODO, just Mock it
    # See Parser in:
    # https://github.com/WeLightProject/tai_shang_nft_gallery/blob/main/lib/tai_shang_nft_gallery/nft/parser.ex
    badges_list = ["noncegeeker", "artist"]
    elements = %{
      first: 1,
      second: 1,
      third: 1,
      fourth: 1,
      fifth: 1,
      sixth: 1
    }

    %{
      badges: badges_list,
      elements: elements
    }

  end
end
