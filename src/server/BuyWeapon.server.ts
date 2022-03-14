import { Players, ReplicatedStorage } from "./ServicesExport";

const event = ReplicatedStorage.WaitForChild("BuyEvent") as RemoteEvent;

event.OnServerEvent.Connect((player, price, gun) => {
	const kills = player.WaitForChild("leaderstats").WaitForChild("Kills") as IntValue;
	if (typeIs(price, "number") && typeIs(gun, "string")) {
		if (kills.Value >= price) {
			const tool = game.GetService("ServerStorage").FindFirstChild(gun) as Tool;
			if (tool) tool.Clone().Parent = player;
		}
	} else player.Kick("sem hackermangos mlk");
});
