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
import { View, StyleSheet, useColorScheme } from "react-native";
import { RestaurantModel } from "../../network/generated";
import Api from "../../network/Api";
import UserStorage from "../../storage/UserStorage";

export default function MainRestaurantScreen({ navigation }) {
	const colorScheme = useColorScheme();

	const [restaurantsArray, setRestaurantsArray] = useState<RestaurantModel[]>(
		[]
	);

	const getRestaurantList = async () => {
		await Api.restaurantsApi
			.restaurantList()
			.then((response) => {
				console.log(response.data.results);
				setRestaurantsArray(response.data.results);
			})
			.catch((error) => {
				console.error(error.response.message);
			});
	};

	useEffect(() => {
		getRestaurantList();
	}, []);

	const restaurantList = restaurantsArray.map(
		({ name, longitude, latitude, owner }, id) => {
			if (parseInt(owner) == UserStorage.userId) {
				return (
					<Card key={id} style={styles.card}>
						<Card.Content>
							<Title>{name}</Title>
							<Paragraph>Szerogkość: {latitude}</Paragraph>
							<Paragraph>Wysokość: {longitude}</Paragraph>
						</Card.Content>
					</Card>
				);
			}
		}
	);

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
			<ScrollView style={styles.scrollview}>
				{restaurantsArray != null ? (
					restaurantList
				) : (
					<Paragraph
						style={{
							alignSelf: "center",
							justifyContent: "center",
							marginTop: 20,
						}}
					>
						There will be showed your restaurants
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
		width: "100%",
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
