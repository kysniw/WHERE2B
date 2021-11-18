import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function LoginScreen() {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<View style={styles.container}>
			<View style={styles.form}>
				{isLogin ? <LoginForm /> : <RegisterForm />}
			</View>
			<Button
				style={styles.changeFormButton}
				onPress={() => setIsLogin(!isLogin)}
			>
				{isLogin ? "Register" : "Login"}
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
