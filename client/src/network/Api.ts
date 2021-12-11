import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import UserStorage from "../storage/UserStorage";
import { RestaurantsApi, TokenRefreshModel, UsersApi } from "./generated";
import { BookingsApi } from "./generated/apis/bookings-api";
import { RatingsApi } from "./generated/apis/ratings-api";

interface AxiosRequestConfigRetry extends AxiosRequestConfig {
	_retry: boolean | undefined;
}

export default abstract class Api {
	public static readonly axiosInstance: AxiosInstance =
		Api.createAxiosInstance();
	public static readonly serverApiUrl = `http://192.168.0.93:8000/api`;

	private static _usersApi = new UsersApi(
		undefined,
		Api.serverApiUrl,
		this.axiosInstance
	);
	private static _restaurantsApi = new RestaurantsApi(
		undefined,
		Api.serverApiUrl,
		this.axiosInstance
	);
	private static _bookingsApi = new BookingsApi(
		undefined,
		Api.serverApiUrl,
		this.axiosInstance
	);
	private static _ratingsApi = new RatingsApi(
		undefined,
		Api.serverApiUrl,
		this.axiosInstance
	);

	public static get usersApi() {
		return this._usersApi;
	}
	public static get restaurantsApi() {
		return this._restaurantsApi;
	}
	public static get bookingsApi() {
		return this._bookingsApi;
	}
	public static get ratingsApi() {
		return this._ratingsApi;
	}

	private static createAxiosInstance(): AxiosInstance {
		const instance = axios.create();

		instance.interceptors.request.use((request) => {
			console.log(Api.serverApiUrl);
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

		// TODO - missing expired refresh token handle - check if it has expiration date firstly :)
		instance.interceptors.response.use(
			(response) => {
				return response;
			},
			async (error) => {
				if (axios.isAxiosError(error)) {
					const originalRequest =
						error.config as AxiosRequestConfigRetry;

					if (
						error.response?.status === 401 &&
						error.response.data?.code === "token_not_valid" &&
						!originalRequest._retry
					) {
						const refreshTokenRequest: TokenRefreshModel = {
							refresh: UserStorage.refreshToken,
						};

						const refreshTokenResponse =
							await Api.usersApi.loginRefreshCreate(
								refreshTokenRequest
							);

						if (refreshTokenResponse.status === 200) {
							await UserStorage.saveAccessToken(
								refreshTokenResponse.data.access
							);

							originalRequest._retry = true;
							originalRequest.headers = {
								Authorization: `Bearer ${refreshTokenResponse.data.access}`,
								Accept: "application/json, text/plain, */*",
								"Content-Type": "application/json",
							};
							return instance(originalRequest);
						}
						// probably other code will be for expired refresh token and should be handled here?
					}
				}

				return Promise.reject(error);
			}
		);

		return instance;
	}
}
