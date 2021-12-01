import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	useColorScheme,
	RefreshControl,
	ScrollView,
} from "react-native";
import {
	Appbar,
	IconButton,
	Paragraph,
	Colors,
	Card,
	Title,
	Portal,
	Dialog,
} from "react-native-paper";

import { RootStackScreenProps } from "../../../types";
import Api from "../../network/Api";
import {
	RestaurantModel,
	RestaurantCategoryModel,
} from "../../network/generated";
import UserStorage from "../../storage/UserStorage";

export default function MainRestaurantScreen({
	navigation,
}: RootStackScreenProps<"MainRestaurantScreen">) {
	const colorScheme = useColorScheme();
	const [restaurantsArray, setRestaurantsArray] = useState<RestaurantModel[]>(
		[]
	);
	const [category, setCategories] = useState<RestaurantCategoryModel[]>([]);

	const [refreshing, setRefreshing] = useState(true);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [restaurantObject, setRestaurantObject] = useState<RestaurantModel>();

	const getRestaurantCategories = async () => {
		await Api.restaurantsApi
			.restaurantCategoriesList()
			.then((response) => {
				setCategories(response.data.results);
			})
			.catch((error) => {
				console.log(error.message);
				console.log(error.response.data);
			});
	};

	const deleteRestuarant = async (id: number) => {
		await Api.restaurantsApi
			.restaurantDelete(id)
			.then(async () => {
				await getRestaurantList();
			})
			.catch((error) => {
				console.log(error.message);
				console.log(error.response.data);
			});
	};

	console.log(category);

	const getRestaurantList = async () => {
		setRefreshing(true);

		await Api.restaurantsApi
			.restaurantList()
			.then((response) => {
				console.log(response.data.results);
				setRestaurantsArray(response.data.results);
			})
			.catch((error) => {
				console.error(error.response.message);
			})
			.finally(() => setRefreshing(false));
	};

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		getRestaurantList();
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		getRestaurantCategories();
	}, []);

	const restaurantList = restaurantsArray.map((item) => {
		return (
			<Card key={item.id} style={styles.card}>
				<Card.Content>
					<Title>{item.name}</Title>
					<Paragraph>Szerokość: {item.latitude}</Paragraph>
					<Paragraph>Wysokość: {item.longitude}</Paragraph>
				</Card.Content>
				<Card.Actions style={{ flexDirection: "row-reverse" }}>
					<IconButton
						icon="arrow-expand"
						onPress={() => {
							setRestaurantObject(item);
							setDialogVisible(true);
						}}
					/>
				</Card.Actions>
			</Card>
		);
	});

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
			<Portal>
				{restaurantObject ? (
					<Dialog
						visible={dialogVisible}
						onDismiss={() => setDialogVisible(false)}
					>
						<Dialog.Title onPressIn onPressOut>
							{restaurantObject.name}
						</Dialog.Title>
						<Dialog.Content>
							<Paragraph>
								Szerokość: {restaurantObject.latitude}
							</Paragraph>
							<Paragraph>
								Wysokość: {restaurantObject.longitude}
							</Paragraph>
							<Paragraph>
								{restaurantObject.is_making_reservations ===
								true
									? "Obsługuje rezerwacje"
									: "Nie obsługuje rezerwacji"}
							</Paragraph>
							<Paragraph>
								Maksymalna liczba klientów:{" "}
								{restaurantObject.max_number_of_people}
							</Paragraph>
							<Paragraph>Kategorie: </Paragraph>
							{category.map(({ name }, id) => {
								return (
									<View key={id}>
										{restaurantObject.categories.map(
											(index) => {
												if (index === id + 1) {
													return (
														<Paragraph key={index}>
															{name}
														</Paragraph>
													);
												}
											}
										)}
									</View>
								);
							})}
						</Dialog.Content>
						<Dialog.Actions>
							<IconButton icon="pencil" />
							<IconButton
								icon="delete"
								onPress={async () => {
									if (typeof restaurantObject.id === "number")
										await deleteRestuarant(
											restaurantObject.id
										);
									setDialogVisible(false);
								}}
							/>
						</Dialog.Actions>
					</Dialog>
				) : (
					<Dialog
						visible={dialogVisible}
						onDismiss={() => setDialogVisible(false)}
					>
						Nothing to show
					</Dialog>
				)}
			</Portal>
			<ScrollView
				style={styles.scrollview}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={getRestaurantList}
					/>
				}
			>
				{restaurantsArray.length !== 0 ? (
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
					colorScheme === "dark"
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
		flex: 1,
	},
	scrollview: {
		paddingTop: 5,
		alignSelf: "center",
		width: "100%",
		flex: 1,
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

	modalcontainer: {
		backgroundColor: Colors.white,
		margin: 20,
	},
});

const sytlesDark = StyleSheet.create({
	iconbutton: {
		position: "absolute",
		left: 20,
		bottom: 20,
		backgroundColor: Colors.deepPurple900,
	},

	modalcontainer: {
		backgroundColor: Colors.grey900,
		margin: 20,
	},
});
