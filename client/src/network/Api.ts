import axios, { AxiosInstance } from "axios";

import UserStorage from "../storage/UserStorage";
import { RestaurantsApi, UsersApi } from "./generated";
import { BASE_PATH } from "./generated/base";

export default abstract class Api {
	private static _axiosInstance: AxiosInstance = Api.createAxiosInstance();

	private static _usersApi = new UsersApi(
		undefined,
		BASE_PATH,
		this._axiosInstance
	);
	private static _restaurantsApi = new RestaurantsApi(
		undefined,
		BASE_PATH,
		this._axiosInstance
	);

	public static get usersApi() {
		return this._usersApi;
	}
	public static get restaurantsApi() {
		return this._restaurantsApi;
	}

	private static createAxiosInstance(): AxiosInstance {
		const instance = axios.create();

		instance.interceptors.request.use((request) => {
			const token = UserStorage.accessToken;
			if (token) {
				request.headers = {
					Authorization: `Bearer ${UserStorage.accessToken}`,
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/json",
				};
			}
			return request;
		});

		return instance;
	}
}
