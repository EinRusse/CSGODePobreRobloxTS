import { countclient } from "client/Types";

const players = game.GetService("Players");
const player = players.LocalPlayer;
const roundevent = game.GetService("ReplicatedStorage").WaitForChild("RoundEvent") as RemoteEvent;
const roundresetevent = game.GetService("ReplicatedStorage").WaitForChild("RoundResetEvent") as RemoteEvent;

const CountGui = player.WaitForChild("PlayerGui").WaitForChild("CountGUI") as ScreenGui;
const roundcount = CountGui.WaitForChild("RoundCount") as TextLabel;

const roundGuiFrame = player.WaitForChild("PlayerGui").WaitForChild("RoundGUI").WaitForChild("Frame") as Frame;
const start3 = roundGuiFrame.WaitForChild("Start3") as TextButton;
const start5 = roundGuiFrame.WaitForChild("Start5") as TextButton;
const reset = roundGuiFrame.WaitForChild("Reset") as TextButton;

player.CharacterAdded.Connect(() => {
	const module = require(game
		.GetService("ReplicatedStorage")
		.WaitForChild("TS")
		.WaitForChild("RoundsCount") as ModuleScript) as countclient;
	roundcount.Text = tostring(module.get());
});

start3.MouseButton1Click.Connect(() => roundevent.FireServer(3));

start5.MouseButton1Click.Connect(() => roundevent.FireServer(5));

reset.MouseButton1Click.Connect(() => roundresetevent.FireServer());

roundevent.OnClientEvent.Connect((rounds) => {
	roundcount.Text = tostring(rounds);
});

export = {};
