import axios from "axios";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

import { SignInModel, UsersApi } from "../../generated";
import UserStorage from "../../storage/UserStorage";

export default function LoginForm() {
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [loginError, setLoginError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const onLoginClicked = async () => {
		if (isLoading) return;
		setIsLoading(true);

		const api = new UsersApi(); // api should be injected
		const request: SignInModel = { login, password };

		await api
			.loginTokensCreate(request)
			.then(async (response) => {
				await UserStorage.saveData(response.data);

				// move to main screen
				console.log(response.data);
			})
			.catch((error: Error) => {
				// this type checking and casting may be not necessary if errors documented in swagger document
				if (
					axios.isAxiosError(error) &&
					error.response?.status === 400
				) {
					const serverResponse = error.response.data as SignInModel;

					// set errors from api response - not optimized way of input validation
					setLoginError(serverResponse.login);
					setPasswordError(serverResponse.password);
				} else {
					console.log("Error: " + error.message);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<View style={{ width: "100%" }}>
			<Button
				icon="facebook"
				style={{
					borderRadius: 20,
					width: "80%",
					alignSelf: "center",
				}}
				contentStyle={{ flexDirection: "row-reverse" }}
				mode="outlined"
			>
				Login with Facebook
			</Button>
			<Button
				icon="google"
				style={{
					borderRadius: 20,
					width: "80%",
					marginTop: 10,
					alignSelf: "center",
				}}
				contentStyle={{ flexDirection: "row-reverse" }}
				mode="outlined"
			>
				Login with Google
			</Button>
			<TextInput
				style={{ marginTop: 30 }}
				dense
				mode="outlined"
				label="Email"
				value={login}
				onChangeText={setLogin}
				left={<TextInput.Icon name="email" />}
			/>
			{!!loginError && <HelperText type="error">{loginError}</HelperText>}
			<TextInput
				style={{ marginTop: loginError ? 0 : 10 }}
				dense
				mode="outlined"
				label="Password"
				secureTextEntry={showPassword}
				value={password}
				onChangeText={setPassword}
				left={<TextInput.Icon name="lock" />}
				right={
					<TextInput.Icon
						onPress={() => setShowPassword(!showPassword)}
						name="eye"
					/>
				}
			/>
			{!!passwordError && (
				<HelperText type="error">{passwordError}</HelperText>
			)}
			<Button
				style={{ marginTop: passwordError ? 0 : 10 }}
				onPress={onLoginClicked}
				mode="contained"
				loading={isLoading}
			>
				Login
			</Button>
		</View>
	);
}
