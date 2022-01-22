defmodule TaiShangWorldGenerator.Repo.Migrations.AddGameEvent do
  use Ecto.Migration

  def change do
    create table :game_event do
      add :type, :string, default: "conversaction"
      add :unique_id, :string
      add :triggered, :integer, default: 0
      add :trigger_line, :integer, default: nil
      add :verify_data, :map
      add :payload, :map
      add :x, :integer
      add :y, :integer
      add :block_height, :integer
      timestamps()
    end
  end
end
