import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
	Appbar,
	IconButton,
	Paragraph,
	Colors,
	Card,
	Title,
} from "react-native-paper";
import { View, StyleSheet, useColorScheme, RefreshControl } from "react-native";
import { RestaurantModel } from "../../network/generated";
import Api from "../../network/Api";
import UserStorage from "../../storage/UserStorage";
import { RootStackScreenProps } from "../../../types";

export default function MainRestaurantScreen({
	navigation,
}: RootStackScreenProps<"MainRestaurantScreen">) {
	const colorScheme = useColorScheme();
	const [restaurantsArray, setRestaurantsArray] = useState<RestaurantModel[]>(
		[]
	);
	const [refreshing, setRefreshing] = useState(true);

	useEffect(() => {
		getRestaurantList();
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
					<Card.Title
						title={name}
						subtitle={
							"Szerokość: " + latitude + " Wysokość: " + longitude
						}
						subtitleNumberOfLines={2}
						right={(props) => (
							<IconButton {...props} icon="delete" />
						)}
					/>
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
				style={styles.scrollview}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={getRestaurantList}
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
