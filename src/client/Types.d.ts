import * as Rounds from "shared/RoundsCount";
import * as Prices from "shared/GunsPrices";

export type countclient = typeof Rounds;
export type buyweaponfn = (gun: string, kills: number) => void;
export type Prices = typeof Prices;
