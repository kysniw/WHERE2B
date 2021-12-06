import React from "react";
import { StyleSheet } from "react-native";
import { Card, IconButton, Paragraph, Title } from "react-native-paper";

import { RestaurantModel } from "../network/generated";

interface Props {
	restaurant: RestaurantModel;
	dialogDetailsAction: (item: RestaurantModel) => void;
}

export default function RestaurantListItemView(props: Props) {
	return (
		<Card style={styles.card}>
			<Card.Content>
				<Title>{props.restaurant.name}</Title>
				<Paragraph>Szerokość: {props.restaurant.latitude}</Paragraph>
				<Paragraph>Wysokość: {props.restaurant.longitude}</Paragraph>
			</Card.Content>
			<Card.Actions style={{ flexDirection: "row-reverse" }}>
				<IconButton
					icon="arrow-expand"
					onPress={() => props.dialogDetailsAction(props.restaurant)}
				/>
			</Card.Actions>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		marginTop: 5,
		marginBottom: 5,
		width: "80%",
		alignSelf: "center",
		flexDirection: "row",
	},
});
