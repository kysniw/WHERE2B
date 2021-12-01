import * as React from "react";
import { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./src/navigation";
import UserStorage from "./src/storage/UserStorage";

export default function App() {
	const isLoadingComplete = useCachedResources();

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		loadUserDataFromStorage();
	}, []);

	async function loadUserDataFromStorage() {
		await UserStorage.loadSavedData();
	}

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<PaperProvider>
				<SafeAreaProvider>
					<Navigation />
				</SafeAreaProvider>
			</PaperProvider>
		);
	}
}
