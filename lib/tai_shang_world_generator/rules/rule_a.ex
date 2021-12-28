defmodule TaiShangWorldGenerator.Rule.RuleA do
  alias TaiShangWorldGenerator.MapTranslator.Behaviour, as: MapTranslatorBehaviour
  @map_type ["sand", "green", "ice"]

  @behaviour MapTranslatorBehaviour # necessary for behaviour

  @impl MapTranslatorBehaviour
  def handle_ele(ele) when ele in 0..200 do
    0
  end

  def handle_ele(ele) when ele in 201..230 do
    1
  end

  def handle_ele(_ele)  do
    2
  end

  @impl MapTranslatorBehaviour
  def get_type(hash) do
    type_index =
      hash
      |> Binary.at(0)
      |> rem(Enum.count(@map_type))
    Enum.at(@map_type, type_index)
  end
end
