import AsyncStorage from "@react-native-async-storage/async-storage";

import { ResponseTokensModel } from "../network/generated";

enum Keys {
	REFRESH_TOKEN = "REFRESH_TOKEN",
	USER_ID = "USER_ID",
	ACCESS_TOKEN = "ACCESS_TOKEN",
	IS_RESTAURANT_PROFILE = "IS_RESTAURANT_PROFILE",
}

export default abstract class UserStorage {
	private static _loginResponse: ResponseTokensModel | null = null;

	public static get isLoggedIn(): boolean {
		return this._loginResponse === null;
	}
	public static get accessToken(): string {
		return this._loginResponse?.access ?? "";
	}
	public static get refreshToken(): string {
		return this._loginResponse?.refresh ?? "";
	}
	public static get userId(): number {
		return this._loginResponse?.user_id ?? 0;
	}
	public static get isRestaurantProfile(): boolean {
		return !!this._loginResponse?.is_restaurant_profile;
	}

	// load after opening the app and check if login screen should be shown
	static async loadSavedData() {
		try {
			const readValues = await AsyncStorage.multiGet([
				Keys.USER_ID,
				Keys.REFRESH_TOKEN,
				Keys.ACCESS_TOKEN,
				Keys.IS_RESTAURANT_PROFILE,
			]);
			const userIdValues = readValues.find((x) => x[0] === Keys.USER_ID);
			const refreshTokenValues = readValues.find(
				(x) => x[0] === Keys.REFRESH_TOKEN
			);
			const accessTokenValues = readValues.find(
				(x) => x[0] === Keys.ACCESS_TOKEN
			);
			const isRestaurantProfileValues = readValues.find(
				(x) => x[0] === Keys.IS_RESTAURANT_PROFILE
			);

			if (
				!!userIdValues?.[1] &&
				!!refreshTokenValues?.[1] &&
				!!accessTokenValues?.[1] &&
				!!isRestaurantProfileValues?.[1]
			) {
				this._loginResponse = {
					refresh: refreshTokenValues[1],
					user_id: Number(userIdValues[1]),
					access: accessTokenValues[1],
					is_restaurant_profile:
						isRestaurantProfileValues[1] === "true",
				};
			}

			return true;
		} catch {
			return false;
		}
	}

	static async saveData(loginResponse: ResponseTokensModel) {
		this._loginResponse = loginResponse;

		try {
			await AsyncStorage.multiSet([
				[Keys.REFRESH_TOKEN, loginResponse.refresh],
				[Keys.USER_ID, loginResponse.user_id.toString()],
				[
					Keys.IS_RESTAURANT_PROFILE,
					loginResponse.is_restaurant_profile!.toString(),
				],
			]);

			return true;
		} catch {
			return false;
		}
	}

	static async saveAccessToken(token: string) {
		if (this._loginResponse === null) return false;

		try {
			this._loginResponse.access = token;
			await AsyncStorage.setItem(Keys.ACCESS_TOKEN, token);

			return true;
		} catch {
			return false;
		}
	}

	static async deleteData() {
		try {
			await AsyncStorage.multiRemove([Keys.USER_ID, Keys.REFRESH_TOKEN]);
			this._loginResponse = null;

			return true;
		} catch {
			return false;
		}
	}
}
