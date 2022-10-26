import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform, Alert } from "react-native";
import gql from "graphql-tag";
import { API, graphqlOperation } from "aws-amplify";

const addExpoToken = gql`
    mutation addExpoToken($token: String!) {
        addExpoToken(token: $token) {
            playerUsername
            token
        }
    }
`;

const initNotifications = async (): Promise<void> => {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            return;
        }
        const tokenRes = await Notifications.getExpoPushTokenAsync();
        try {
            await API.graphql(
                graphqlOperation(addExpoToken, {
                    token: tokenRes.data
                })
            );
        } catch (error: any) {
            const defaultError = "An error has ocurred!";
            if (error.errors && error.errors.length > 0) {
                Alert.alert("Error!", error.errors[0].message || defaultError);
            } else if (error.message) {
                Alert.alert("Error!", error.message);
            } else {
                Alert.alert("Error!", defaultError);
            }
        }

        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX
            });
        }
    }
};

export default initNotifications;
