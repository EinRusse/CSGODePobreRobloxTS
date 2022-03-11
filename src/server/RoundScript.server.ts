import { Players, ReplicatedStorage, Teams } from "./ServicesExport";
import { rounds } from "shared/Rounds";

const event: RemoteEvent = new Instance("RemoteEvent");
event.Name = "RoundEvent";
event.Parent = ReplicatedStorage;

const defaultGun = ReplicatedStorage.WaitForChild("Conc45");

const ADM = Teams.WaitForChild("ADM") as Team;
const red: Team = Teams.WaitForChild("Vermelho") as Team;
const blue: Team = Teams.WaitForChild("Azul") as Team;

export let count = 0;

const randomizer = (array: Player[]) => {
	let currentIndex = array.size(),
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = math.floor(math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
};

const ContinueRound = (bluelist: Player[], redlist: Player[]): void => {
	bluelist.forEach((player) => {
		player.Team = blue;
		player.LoadCharacter();
		defaultGun.Clone().Parent = player;
	});
	redlist.forEach((player) => {
		player.Team = red;
		player.LoadCharacter();
		defaultGun.Clone().Parent = player;
	});
};

event.OnServerEvent.Connect((player: Player, roundSetted: unknown) => {
	switch (player.Team) {
		case ADM:
			if (typeOf(roundSetted) === "number") {
				if (count === 0) {
					count = roundSetted as number;

					const redteam: Player[] = [];
					const blueteam: Player[] = [];

					const playerlist = Players.GetPlayers();
					randomizer(playerlist);

					for (let i = 0; i < playerlist.size(); i++) {
						if (i / 2 === 0) {
							playerlist[i].Team === red;
							playerlist[i].LoadCharacter();
							defaultGun.Clone().Parent = playerlist[i];
							redteam.push(playerlist[i]);
						} else {
							playerlist[i].Team === blue;
							playerlist[i].LoadCharacter();
							defaultGun.Clone().Parent = playerlist[i];
							blueteam.push(playerlist[i]);
						}
					}
					Players.PlayerAdded.Connect((playerDied) => {
						playerDied.CharacterAdded.Connect(() => {
							if (
								blueteam.find(() => player.Name === player.Name) !== undefined &&
								blue.GetPlayers() === undefined
							) {
								ContinueRound(blueteam, redteam);
							} else if (redteam.find(playerDied) === playerDied && red.GetPlayers() === undefined) {
								ContinueRound(blueteam, redteam);
							}
						});
					});
				}
			} else {
				player.Kick("argumento 'rounds' invalida.");
			}
			break;
		default:
			player.Kick("Sem hackermangos mlk");
	}
});
