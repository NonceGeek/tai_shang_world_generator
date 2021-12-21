defmodule TaiShangWorldGenerator.Rule.RuleA do
  alias TaiShangWorldGenerator.MapTranslator.Behaviour, as: MapTranslatorBehaviour

  @behaviour MapTranslatorBehaviour # necessary for behaviour

  @impl MapTranslatorBehaviour
  def handle_ele(ele) when ele in 1..200 do
    0
  end

  def handle_ele(_ele) do
    1
  end
end
