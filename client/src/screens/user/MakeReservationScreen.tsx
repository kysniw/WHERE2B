import moment from "moment";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";
import { DateData } from "react-native-calendars/src/types";
import { FlatList } from "react-native-gesture-handler";
import { Appbar, Button, IconButton } from "react-native-paper";

import { RootStackScreenProps } from "../../../types";
import Api from "../../network/Api";
import {
	AvailableTablesModel,
	CreateBookingModel,
} from "../../network/generated";
import UserStorage from "../../storage/UserStorage";

export default function MakeReservationScreen({
	route,
	navigation,
}: RootStackScreenProps<"MakeReservationScreen">) {
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [markedDates, setMarkedDates] = useState<{
		[key: string]: MarkingProps;
	}>({});
	const [peopleCount, setPeopleCount] = useState(1);
	const [availableTables, setAvailableTables] = useState<
		AvailableTablesModel[]
	>([]);
	const [selectedTables, setSelectedTables] =
		useState<AvailableTablesModel | null>(null);

	const handleDayClicked = async (clickedDay: DateData) => {
		setSelectedTables(null);
		setAvailableTables([]);
		await fetchAvailableSeats(clickedDay.dateString);

		const newDates = { ...markedDates };
		if (selectedDate !== null) {
			delete newDates[selectedDate];
		}
		newDates[clickedDay.dateString] = { selected: true };

		setSelectedDate(clickedDay.dateString);
		setMarkedDates(newDates);
	};

	const fetchAvailableSeats = async (date: string) => {
		const now = moment().utc().add(1, "minute");
		const isCurrentDate = now.toISOString().slice(0, 10) === date;
		const dateQuery = isCurrentDate
			? now.toISOString().slice(0, 16)
			: `${date}T00:00`;

		await Api.bookingsApi
			.listAvailableSeatsRead(
				dateQuery,
				peopleCount.toString(),
				(route.params?.restaurant?.id ?? 1).toString()
			)
			.then((response) => {
				console.log(response.config.url);
				const data = response.data as unknown as AvailableTablesModel[]; // swagger document not properly defined
				setAvailableTables(data);
			})
			.catch((error) => {
				console.log(error.message);
				console.log(error.response.data);
			});
	};

	useEffect(() => {
		setSelectedTables(null);

		if (selectedDate) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			fetchAvailableSeats(selectedDate);
		}
	}, [peopleCount]);

	const makeReservation = async () => {
		const request: CreateBookingModel = {
			date: selectedTables!.date,
			table: selectedTables!.tables.find(
				(x) => x.number_of_seats >= peopleCount
			)!.id!,
		};
		await Api.bookingsApi
			.bookingCreate(request)
			.then(() => {
				Alert.alert("Dodano rezerwację");
				navigation.goBack();
			})
			.catch((error) => {
				console.log(error.message);
				console.log(error.response.data);
			});
	};

	const isEnoughPlaces = (availableTables: AvailableTablesModel) => {
		return availableTables.tables.some(
			(table) => peopleCount <= table.number_of_seats
		);
	};

	return (
		<View style={styles.view}>
			<Appbar.Header>
				<Appbar.Content
					title="Make reservation"
					subtitle={
						route.params?.restaurant?.name ??
						"Dummy restaurant name"
					}
				/>
				<Appbar.Action
					icon="logout"
					onPress={async () =>
						await UserStorage.deleteData().then((response) => {
							console.log(response);
							navigation.navigate("UserLogin");
						})
					}
				/>
			</Appbar.Header>

			<Calendar
				minDate={new Date()}
				firstDay={1}
				onDayPress={handleDayClicked}
				markedDates={markedDates}
			/>

			<FlatList
				style={styles.hoursList}
				horizontal
				data={availableTables}
				keyExtractor={(_, index) => index.toString()}
				renderItem={({ item }) => {
					const typedItem = item as AvailableTablesModel;
					return (
						<Button
							mode="outlined"
							onPress={() => setSelectedTables(typedItem)}
							disabled={!isEnoughPlaces(typedItem)}
							style={
								!isEnoughPlaces(typedItem)
									? styles.hoursNotAvailable
									: typedItem === selectedTables
									? styles.hourSelected
									: styles.hours
							}
						>
							{moment(item.date as string).format("HH:mm")}
						</Button>
					);
				}}
			/>

			<Text style={{ alignSelf: "center" }}>Number of people</Text>
			<View style={styles.peopleContainer}>
				<IconButton
					disabled={peopleCount <= 1}
					icon="minus"
					onPress={() => setPeopleCount(peopleCount - 1)}
				/>
				<Text style={styles.peopleText}>{peopleCount}</Text>
				<IconButton
					icon="plus"
					onPress={() => setPeopleCount(peopleCount + 1)}
				/>
			</View>

			<View style={styles.bottomContainer}>
				<Button
					mode="contained"
					onPress={makeReservation}
					style={styles.bottomButton}
					disabled={selectedTables === null}
				>
					Make reservation
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
	},
	peopleContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	peopleText: {
		fontSize: 16,
		borderWidth: 1,
		borderRadius: 4,
		marginHorizontal: 10,
		paddingHorizontal: 10,
		paddingVertical: 4,
		textAlign: "center",
	},
	bottomContainer: {
		flex: 1,
		justifyContent: "flex-end",
	},
	bottomButton: {
		margin: 16,
	},
	hoursList: {
		maxHeight: 40,
		marginVertical: 10,
		paddingHorizontal: 10,
	},
	hours: {
		marginHorizontal: 5,
	},
	hourSelected: {
		backgroundColor: "#f0f4c3",
		marginHorizontal: 5,
	},
	hoursNotAvailable: {
		backgroundColor: "#ffccbc",
		marginHorizontal: 5,
	},
});
