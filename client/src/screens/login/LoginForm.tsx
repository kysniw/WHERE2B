import React, { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function LoginForm() {
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(true);

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
			<TextInput
				style={{ marginTop: 10 }}
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
			<Button style={{ marginTop: 10 }} mode="contained">
				Login
			</Button>
		</View>
	);
}
