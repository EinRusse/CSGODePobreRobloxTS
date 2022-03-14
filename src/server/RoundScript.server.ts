import { Players, ReplicatedStorage, Teams } from "./ServicesExport";
import { count } from "./Types";

const remotevent = ReplicatedStorage.WaitForChild("RoundEvent") as RemoteEvent;
const resetevent = ReplicatedStorage.WaitForChild("RoundResetEvent") as RemoteEvent;
const event: BindableEvent = ReplicatedStorage.WaitForChild("KillEvent") as BindableEvent;
const defaultGun = game.GetService("ServerStorage").WaitForChild("Conc45") as Tool;
const knife = game.GetService("ServerStorage").WaitForChild("Knife") as Tool;

const ADM = Teams.WaitForChild("Host") as Team;
const red: Team = Teams.WaitForChild("Vermelho") as Team;
const blue: Team = Teams.WaitForChild("Azul") as Team;
const redteam: Player[] = [];
const blueteam: Player[] = [];

Players.PlayerAdded.Connect((player) => {
	const stats = new Instance("Folder");
	stats.Name = "leaderstats";
	stats.Parent = player;

	const kill = new Instance("IntValue");

	kill.Name = "Kills";
	kill.Value = 0;
	kill.Parent = stats;
});

event.Event.Connect((killer) => {
	const module = require(ReplicatedStorage.WaitForChild("TS").WaitForChild("RoundsCount") as ModuleScript) as count;
	if (module.count.get() > 0) {
		const player = Players.FindFirstChild(killer) as Player;
		const kills = player.WaitForChild("leaderstats").WaitForChild("Kills") as IntValue;

		kills.Value += 1;
	}
});

const Randomizer = <T>(array: T[]): T[] => {
	let currentIndex = array.size(),
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = math.floor(math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
};

const EndRound = (blueplayers: Player[], redplayers: Player[]): void => {
	const module = require(ReplicatedStorage.WaitForChild("TS").WaitForChild("RoundsCount") as ModuleScript) as count;
	module.count.set(0);
	blueplayers.forEach((play) => {
		play.Team = Teams.WaitForChild("Espectador") as Team;
		play.LoadCharacter();
		const kills = play.WaitForChild("leaderstats").WaitForChild("Kills") as IntValue;
		kills.Value = 0;
	});
	redplayers.forEach((play) => {
		play.Team = Teams.WaitForChild("Espectador") as Team;
		play.LoadCharacter();
		const kills = play.WaitForChild("leaderstats").WaitForChild("Kills") as IntValue;
		kills.Value = 0;
	});
	blueplayers.clear();
	redplayers.clear();
};

const ContinueRound = (bluelist: Player[], redlist: Player[]): void => {
	const module = require(ReplicatedStorage.WaitForChild("TS").WaitForChild("RoundsCount") as ModuleScript) as count;
	module.count.add(-1);
	if (module.count.get() !== 0) {
		bluelist.forEach((player) => {
			player.Team = blue;
			player.LoadCharacter();
			defaultGun.Clone().Parent = player;
			knife.Clone().Parent = player;
		});
		redlist.forEach((player) => {
			player.Team = red;
			player.LoadCharacter();
			defaultGun.Clone().Parent = player;
			knife.Clone().Parent = player;
		});
	} else {
		EndRound(bluelist, redlist);
	}
};

remotevent.OnServerEvent.Connect((player: Player, roundSetted: unknown) => {
	switch (player.Team) {
		case ADM:
			if (typeIs(roundSetted, "number")) {
				const module = require(ReplicatedStorage.WaitForChild("TS").WaitForChild(
					"RoundsCount",
				) as ModuleScript) as count;
				if (module.count.get() === 0) {
					module.count.set(roundSetted);
					const spec = Teams.WaitForChild("Espectador") as Team;
					const playerlist = spec.GetPlayers();
					Randomizer(playerlist);

					for (let i = 0; i < playerlist.size(); i++) {
						if (i / 2 === 0) {
							playerlist[i].Team === red;
							playerlist[i].LoadCharacter();
							defaultGun.Clone().Parent = playerlist[i];
							knife.Clone().Parent = playerlist[i];
							redteam.push(playerlist[i]);
						} else {
							playerlist[i].Team === blue;
							playerlist[i].LoadCharacter();
							defaultGun.Clone().Parent = playerlist[i];
							knife.Clone().Parent = playerlist[i];
							blueteam.push(playerlist[i]);
						}
					}

					remotevent.FireAllClients(roundSetted);

					Players.PlayerAdded.Connect((playerDied) => {
						playerDied.CharacterAdded.Connect(() => {
							if (blueteam.find((playerDied) => true) !== undefined && blue.GetPlayers() === undefined) {
								ContinueRound(blueteam, redteam);
							} else if (
								redteam.find((playerDied) => true) === playerDied &&
								red.GetPlayers() === undefined
							) {
								ContinueRound(blueteam, redteam);
							}
						});
					});
				}
			} else {
				player.Kick("argumento 'rounds' invalido.");
			}
			break;
		default:
			player.Kick("Sem hackermangos mlk");
	}
});

resetevent.OnServerEvent.Connect((player) => {
	if (player.Team === ADM) EndRound(blueteam, redteam);
	else player.Kick("Sem hackermangos mlk");
});
