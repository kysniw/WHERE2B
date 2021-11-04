import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import LoginScreen from "./src/screens/login/LoginScreen";

export default function App() {
	const isLoadingComplete = useCachedResources();

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<PaperProvider>
				<SafeAreaProvider>
					<LoginScreen />
				</SafeAreaProvider>
			</PaperProvider>
		);
	}
}
