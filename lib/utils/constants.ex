defmodule Utils.Constants do
  def get_env(key) do
    Application.fetch_env!(:tai_shang_world_generator, key)
  end
end
