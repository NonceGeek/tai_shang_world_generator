defmodule TaiShangWorldGenerator.GameEventHandler do
  alias TaiShangWorldGenerator.GameEvent

  @spec triggered_event(integer(), integer(), integer(), map()) :: {:ok, any()} | {:error, any()}
  def triggered_event(block_height, x, y, _verify_data \\ %{}) do
    event = GameEvent.get_by_pos(block_height, x, y)
    with false <- is_nil(event),
      true <- is_legal?(event),
      {:ok, event} <- update_game_event(event) do # TODO: add verfiy logic
      {:ok, ExStructTranslator.struct_to_map(event)}
    else
      _others ->
        {:error, "event is not available"}
    end
  end

  defp is_legal?(%{triggered_line: nil}), do: true
  defp is_legal?(%{
    triggered: triggered,
    trigger_line: trigger_line
    }) when triggered <= trigger_line do
    true
  end
  defp is_legal?(_any), do: false


  def update_game_event(%{triggered_line: nil} = event), do: {:ok, event}
  def update_game_event(
    %{
      triggered: triggered
    } = event) do
      GameEvent.update(event, %{triggered: triggered + 1})
  end
end
