# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     TaiShangWorldGenerator.Repo.insert!(%TaiShangWorldGenerator.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

# +---------------------------------------------+
# | Generate 100 rand Coupon and save it to csv |
# +---------------------------------------------+

alias TaiShangWorldGenerator.Coupon
alias TaiShangWorldGenerator.GameEvent

coupond_list =
Enum.map(0..100, fn _whatever ->
  {:ok, %{coupon_id: coupon_id}} =
    Coupon.generate()
  [coupon_id]
end)

file = File.open!("coupon.csv", [:write, :utf8])
coupond_list
|> CSV.encode
|> Enum.each(&IO.write(file, &1))

GameEvent.create(
  %{
    type: "npc",
    x: 4,
    y: 2,
    block_height: 24028170,
    payload: %{
        first: %{
          text: "May I help U?",
          btn: %{yes: "need_help", no: "not_need_help"}
        }
    }
  }
)

Code.require_file("priv/repo/seeds_gen_chain.exs")
