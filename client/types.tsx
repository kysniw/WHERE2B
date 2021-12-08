/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RestaurantModel } from "./src/network/generated";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace ReactNavigation {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface RootParamList extends RootStackParamList {}
	}
}

export type RootStackParamList = {
	UserLogin: undefined;
	UserRegister: undefined;
	RestauratorRegister: undefined;
	AddRestaurant: undefined;
	EditRestaurant: { restaurant: RestaurantModel };
	MainUserScreen: undefined;
	MainRestaurantScreen: undefined;
	MakeReservationScreen: { restaurant: RestaurantModel };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, Screen>;
