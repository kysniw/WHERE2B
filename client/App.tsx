import * as React from "react";
import { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";

import UserStorage from "./src/storage/UserStorage";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./src/navigation";

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
					<Navigation />
				</SafeAreaProvider>
			</PaperProvider>
		);
	}
}
