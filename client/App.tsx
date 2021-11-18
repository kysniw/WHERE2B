import React, { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";

import useCachedResources from "./hooks/useCachedResources";
import LoginScreen from "./src/screens/login/LoginScreen";
import UserStorage from "./src/storage/UserStorage";

export default function App() {
	const isLoadingComplete = useCachedResources();

	useEffect(() => {
		async function loadUserDataFromStorage() {
			await UserStorage.loadSavedData();
		}

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		loadUserDataFromStorage();
	}, []);

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
