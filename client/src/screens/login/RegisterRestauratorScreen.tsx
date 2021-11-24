import axios from "axios";
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import Api from "../../network/Api";

import { UsersApi, UserModel, UserProfileModel } from "../../network/generated";

export default function RegisterRestauratorScreen({ navigation }) {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const onRegisterClicked = async () => {
		if (isLoading) return;
		setIsLoading(true);

		const user: UserModel = { username, email, password };
		const request: UserProfileModel = {
			user,
		};

		await Api.usersApi
			.restaurantProfileCreate(request)
			.then((response) => {
				console.log(response.data);
				Alert.alert("Zostałeś poprawnie zarejestrowany! Zaloguj się");
				navigation.navigate("UserLogin");
			})
			.catch((error: Error) => {
				if (
					axios.isAxiosError(error) &&
					error.response?.status === 400
				) {
					const serverResponse = error.response
						.data as UserProfileModel;

					// set errors from api response - not optimized way of input validation
					setEmailError(serverResponse.user.email);
					setPasswordError(serverResponse.user.password);
				} else {
					console.log("Error: " + error.message);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<View style={styles.container}>
			<View style={styles.form}>
				<TextInput
					dense
					mode="outlined"
					label="Username"
					value={username}
					onChangeText={setUsername}
					left={<TextInput.Icon name="account" />}
				/>
				<TextInput
					style={{ marginTop: 10 }}
					dense
					mode="outlined"
					label="Email"
					value={email}
					onChangeText={setEmail}
					error={!!emailError}
					onChange={() => setEmailError("")}
					left={<TextInput.Icon name="email" />}
				/>
				{!!emailError && (
					<HelperText type="error">{emailError}</HelperText>
				)}
				<TextInput
					style={{ marginTop: emailError ? 0 : 10 }}
					dense
					mode="outlined"
					label="Password"
					secureTextEntry={showPassword}
					value={password}
					onChangeText={setPassword}
					error={!!passwordError}
					onChange={() => setPasswordError("")}
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
					style={{ marginTop: 10 }}
					mode="contained"
					onPress={onRegisterClicked}
					loading={isLoading}
				>
					Register
				</Button>
			</View>
			<Button
				style={styles.changeFormButton}
				onPress={() => navigation.navigate("UserLogin")}
			>
				Login
			</Button>
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
	form: { flex: 1, justifyContent: "center" },
	changeFormButton: { marginBottom: 10 },
});
