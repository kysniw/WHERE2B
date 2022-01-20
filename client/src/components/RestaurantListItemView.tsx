import React from "react";
import { StyleSheet } from "react-native";
import { Card, IconButton, Paragraph, Title } from "react-native-paper";

import Api from "../network/Api";
import { RestaurantModel } from "../network/generated";

interface Props {
	restaurant: RestaurantModel;
	dialogDetailsAction: (item: RestaurantModel) => void;
}

export default function RestaurantListItemView(props: Props) {
	return (
		<Card style={styles.card}>
			{(props.restaurant.photos?.length ?? 0) > 0 && (
				<Card.Cover
					source={{
						uri: `${Api.serverApiUrl.slice(0, -4)}${
							props.restaurant.photos![0].image_url ?? ""
						}`,
					}}
				/>
			)}
			<Card.Content>
				<Title>{props.restaurant.name}</Title>
				<Paragraph>
					Adres: {props.restaurant.street_name}{" "}
					{props.restaurant.street_number}
					{props.restaurant.flat_number === "" ? null : "/"}
					{props.restaurant.flat_number}
				</Paragraph>
				<Paragraph>Miasto: {props.restaurant.city_name}</Paragraph>
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
