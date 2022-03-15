const Frame = game
	.GetService("Players")
	.LocalPlayer.WaitForChild("PlayerGui")
	.WaitForChild("ToolGui")
	.WaitForChild("ScrollingFrame") as ScrollingFrame;
import { buyweaponfn, Prices, countclient } from "./Types";

const event = game.GetService("ReplicatedStorage").WaitForChild("BuyEvent") as RemoteEvent;
const kills = game.GetService("Players").LocalPlayer.WaitForChild("leaderstats").WaitForChild("Kills") as IntValue;

const pricesmodule = require(game
	.GetService("ReplicatedStorage")
	.WaitForChild("TS")
	.WaitForChild("GunsPrices") as ModuleScript) as Prices;

const roundsmodule = require(game
	.GetService("ReplicatedStorage")
	.WaitForChild("TS")
	.WaitForChild("RoundsCount") as ModuleScript) as countclient;

const sendbuy: buyweaponfn = (gun: string, price: number) => {
	if (roundsmodule.count.get() > 0) {
		const tool = game.GetService("ServerStorage").FindFirstChild(gun);
		if (tool) {
			if (pricesmodule.prices.find(tool.Name) !== undefined) {
				const toolprice = pricesmodule.prices.find(tool.Name);
				if (toolprice !== undefined && kills.Value >= toolprice) {
					event.FireServer(price, tool.Name);
					kills.Value -= toolprice;
				}
			}
		}
	}
};
const AKTButton = Frame.WaitForChild("AK-T") as TextButton;
AKTButton.MouseButton1Click.Connect(() => sendbuy("AKT-T", 2));

export {};
