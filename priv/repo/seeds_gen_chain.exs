alias TaiShangWorldGenerator.Chain

{:ok, %{id: id}} =
  Chain.create(%{
    name: "Moonbeam",
    endpoint: "https://rpc.api.moonbeam.network",
    info: %{
      contract: "https://moonbeam.moonscan.io/address/",
      api_explorer: "https://api-moonbeam.moonscan.io/",
    }
  })
