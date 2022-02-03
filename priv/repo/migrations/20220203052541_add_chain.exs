defmodule TaiShangWorldGenerator.Repo.Migrations.AddChain do
  use Ecto.Migration

  def change do
    create table :chain do
      add :name, :string
      add :endpoint, :string
      add :info, :map
      timestamps()
    end

    create unique_index(:chain, [:name])
  end
end
