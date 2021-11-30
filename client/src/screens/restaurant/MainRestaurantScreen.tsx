import React, { useEffect, useState, useRef } from "react";
import { ScrollView, createNativeWrapper } from "react-native-gesture-handler";
import {
	Appbar,
	IconButton,
	Paragraph,
	Colors,
	Card,
	Title,
} from "react-native-paper";
import {
	View,
	StyleSheet,
	useColorScheme,
	RefreshControl as RNRefreshControl,
} from "react-native";
import { RestaurantModel } from "../../network/generated";
import Api from "../../network/Api";
import UserStorage from "../../storage/UserStorage";
import { RootStackScreenProps } from "../../../types";

const wait = (timeout: any) => {
	return new Promise((resolve) => setTimeout(resolve, timeout));
};

const RefreshControl = createNativeWrapper(RNRefreshControl, {
	disallowInterruption: true,
	shouldCancelWhenOutside: false,
});

export default function MainRestaurantScreen({
	navigation,
}: RootStackScreenProps<"MainRestaurantScreen">) {
	const colorScheme = useColorScheme();
	const [restaurantsArray, setRestaurantsArray] = useState<RestaurantModel[]>(
		[]
	);
	const refreshRef = useRef(null);

	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		getRestaurantList();
	}, []);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);

		wait(2000).then(() => setRefreshing(false));
	}, []);

	const getRestaurantList = async () => {
		await Api.restaurantsApi
			.userRestaurantsList()
			.then((response) => {
				setRefreshing(false);
				console.log(response.data.results);
				setRestaurantsArray(response.data.results);
			})
			.catch((error) => {
				console.error(error.response.message);
			});
	};

	const restaurantList = restaurantsArray.map(
		({ name, longitude, latitude }, id) => {
			return (
				<Card key={id} style={styles.card}>
					<Card.Content>
						<Title>{name}</Title>
						<Paragraph>{latitude}</Paragraph>
						<Paragraph>{longitude}</Paragraph>
					</Card.Content>
					<Card.Actions>
						<IconButton icon="delete" />
					</Card.Actions>
				</Card>
			);
		}
	);
	console.log(restaurantsArray);
	return (
		<View style={styles.view}>
			<Appbar.Header>
				<Appbar.Content
					title="Restaurant Panel"
					subtitle="Your restaurants"
				/>
				<Appbar.Action
					icon="logout"
					onPress={() =>
						UserStorage.deleteData().then((response) => {
							console.log(response);
							navigation.navigate("UserLogin");
						})
					}
				/>
			</Appbar.Header>
			<ScrollView
				waitFor={refreshRef}
				style={styles.scrollview}
				refreshControl={
					<RefreshControl
						ref={refreshRef}
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			>
				{restaurantsArray.length != 0 ? (
					restaurantList
				) : (
					<Paragraph
						style={{
							alignSelf: "center",
							justifyContent: "center",
							marginTop: 20,
						}}
					>
						There is no restaurant to show
					</Paragraph>
				)}
			</ScrollView>
			<IconButton
				style={
					colorScheme == "dark"
						? sytlesDark.iconbutton
						: styles.iconbutton
				}
				icon="plus"
				size={40}
				onPress={() => navigation.navigate("AddRestaurant")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		height: "100%",
	},
	scrollview: {
		paddingTop: 10,
		alignSelf: "center",
		width: "100%",
	},

	iconbutton: {
		position: "absolute",
		left: 20,
		bottom: 20,
		backgroundColor: Colors.blue700,
	},

	card: {
		marginTop: 5,
		marginBottom: 5,
		width: "80%",
		alignSelf: "center",
		flexDirection: "row",
	},
});

const sytlesDark = StyleSheet.create({
	iconbutton: {
		position: "absolute",
		left: 20,
		bottom: 20,
		backgroundColor: Colors.deepPurple900,
	},
});
