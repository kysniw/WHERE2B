import React, { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function RegisterForm() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(true);

	return (
		<View style={{ width: "100%" }}>
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
				Register
			</Button>
		</View>
	);
}
