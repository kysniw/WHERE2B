import AsyncStorage from "@react-native-async-storage/async-storage";

import { ResponseTokensModel } from "../network/generated";

enum Keys {
	REFRESH_TOKEN = "REFRESH_TOKEN",
	USER_ID = "USER_ID",
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

	// load after opening the app and check if login screen should be shown
	static async loadSavedData() {
		try {
			const readValues = await AsyncStorage.multiGet([
				Keys.USER_ID,
				Keys.REFRESH_TOKEN,
			]);
			const userIdValues = readValues.find((x) => x[0] === Keys.USER_ID);
			const refreshTokenValues = readValues.find(
				(x) => x[0] === Keys.REFRESH_TOKEN
			);

			if (!!userIdValues?.[1] && !!refreshTokenValues?.[1]) {
				this._loginResponse = {
					refresh: refreshTokenValues[1],
					user_id: Number(userIdValues[1]),
					access: "", // new access token should be received in interceptor or sth
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
			]);

			return true;
		} catch {
			return false;
		}
	}

	static saveAccessToken(token: string) {
		if (this._loginResponse) {
			this._loginResponse.access = token;
			return true;
		}

		return false;
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
