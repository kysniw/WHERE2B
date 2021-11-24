import axios from "axios";
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
	Button,
	HelperText,
	TextInput,
	Text,
	Snackbar,
} from "react-native-paper";
import Api from "../../network/Api";
import { SignInModel } from "../../network/generated";
import UserStorage from "../../storage/UserStorage";

export default function LoginScreen({ navigation }) {
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [loginError, setLoginError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [snackMessage, setSnackMessage] = useState("");
	const [snackVisibility, setSnackVisibility] = useState(false);
	const [isRestaurantProfile, setIsRestaurantProfile] = useState(false);

	const onLoginClicked = async () => {
		if (isLoading) return;
		setIsLoading(true);

		const request: SignInModel = { login, password };

		await Api.usersApi
			.loginTokensCreate(request)
			.then(async (response) => {
				await UserStorage.saveData(response.data);

				// move to main screen
				console.log(response.data);

				if (response.data.is_restaurant_profile == true) {
					setIsRestaurantProfile(true);
					setSnackMessage("Logged as restaurant owner");
					setSnackVisibility(true);
				} else {
					setIsRestaurantProfile(false);
					setSnackMessage("Logged as app user");
					setSnackVisibility(true);
				}
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

	const onSnackDismiss = () => {
		setSnackVisibility(false);
		if (isRestaurantProfile == true)
			navigation.navigate("MainRestaurantScreen");
		else navigation.navigate("MainUserScreen");
	};

	return (
		<View style={styles.container}>
			<View style={styles.form}>
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
				{!!loginError && (
					<HelperText type="error">{loginError}</HelperText>
				)}
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
			<Text style={styles.text}>Not registered yet?</Text>
			<Button
				style={styles.changeFormButton}
				onPress={() => navigation.navigate("UserRegister")}
			>
				Register as user
			</Button>
			<Button
				mode="text"
				style={styles.changeFormButton}
				onPress={() => navigation.navigate("RestauratorRegister")}
			>
				Register as restaurator
			</Button>
			<Snackbar
				visible={snackVisibility}
				onDismiss={onSnackDismiss}
				duration={1500}
			>
				{snackMessage}
			</Snackbar>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "80%",
		maxWidth: 500,
		alignSelf: "center",
	},
	text: {
		alignSelf: "center",
	},
	form: { flex: 1, justifyContent: "center" },
	changeFormButton: { marginBottom: 10 },
});
