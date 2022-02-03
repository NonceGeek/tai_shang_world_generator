defmodule TaiShangWorldGenerator.Chain do
  use Ecto.Schema
  import Ecto.Changeset
  alias TaiShangWorldGenerator.Chain, as: Ele
  alias TaiShangWorldGenerator.Repo

  schema "chain" do
    field :name, :string
    field :endpoint, :string
    field :info, :map
    timestamps()
  end

  def get_all() do
    Repo.all(Ele)
  end

  def get_by_id(id) do
    Repo.get_by(Ele, id: id)
  end

  def get_by_name(name) do
    Repo.get_by(Ele, name: name)
  end

  def create(attrs \\ %{}) do
    %Ele{}
    |> Ele.changeset(attrs)
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
    |> cast(attrs, [:name, :endpoint, :info])
    |> unique_constraint(:name)
  end
end
