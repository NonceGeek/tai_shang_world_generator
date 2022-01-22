defmodule TaiShangWorldGenerator.GameEvent do
  use Ecto.Schema
  import Ecto.{Changeset, Query}
  alias TaiShangWorldGenerator.GameEvent, as: Ele
  alias TaiShangWorldGenerator.Repo
  alias Utils.RandGen

  schema "game_event" do
    field :type, :string
    field :unique_id, :string
    field :triggered, :integer, default: 0
    field :trigger_line, :integer, default: nil
    field :verify_data, :map
    field :payload, :map
    field :x, :integer
    field :y, :integer
    field :block_height, :integer
    timestamps()
  end

  def get_by_pos(block_height, x, y) do
    Ele
    |> where([e], e.x == ^x and e.y == ^y and e.block_height == ^block_height)
    |> Repo.one()
  end
  def get_by_id(id) do
    Repo.get_by(Ele, id: id)
  end

  def get_by_unique_id(id) do
    Repo.get_by(Ele, unique_id: id)
  end

  def get_by_block_height(block_height) do
    Repo.get_by(Ele, block_height: block_height)
  end

  def create(attrs \\ %{}) do
    unique_id = RandGen.gen_hex(16)
    %Ele{}
    |> Ele.changeset(Map.put(attrs, :unique_id, unique_id))
    |> Repo.insert()
  end

  def update(%Ele{} = ele, attrs) do
    ele
    |> changeset(attrs)
    |> Repo.update()
  end

  def changeset(%Ele{} = ele) do
    Ele.changeset(ele, %{})
  end

  @doc false
  def changeset(%Ele{} = ele, attrs) do
    ele
    |> cast(attrs, [:type, :triggered, :verify_data,
      :payload, :x, :y, :block_height,
      :trigger_line, :unique_id])
  end
end
