import React, { ReactElement, useEffect, useState, useRef } from "react";
import {
    NavigationContainer,
    NavigationContainerRef,
    StackActions
} from "@react-navigation/native";
import {
    createNativeStackNavigator,
    NativeStackNavigationOptions
} from "@react-navigation/native-stack";
import {
    Home,
    SinglePlayerGame,
    Settings,
    Login,
    Register,
    ChangePassword,
    ForgotPassword,
    MultiplayerHome,
    MultiplayerGame
} from "@screens";
import { useAuth } from "@contexts/auth-context";
import { colors } from "@utils";
import * as Notifications from "expo-notifications";

export type StackNavigatorParams = {
    Home: undefined;
    SinglePlayerGame: undefined;
    MultiplayerHome: undefined;
    MultiplayerGame:
        | { gameID: string; invitee?: undefined }
        | { invitee: string; gameID?: undefined };
    Settings: undefined;
    Login: { redirect: keyof StackNavigatorParams } | undefined;
    Register: { username: string } | undefined;
    ChangePassword: undefined;
    ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<StackNavigatorParams>();

const navigatorOptions: NativeStackNavigationOptions = {
    headerStyle: {
        backgroundColor: colors.purple
    },
    headerTintColor: colors.lightGreen,
    headerTitleStyle: {
        fontFamily: "DeliusUnicase_700Bold",
        fontSize: 24
    },
    headerBackTitleStyle: {
        fontFamily: "DeliusUnicase_400Regular",
        fontSize: 14
    }
};

const Navigator = (): ReactElement => {
    const { user } = useAuth();
    const navigatorRef = useRef<NavigationContainerRef<any> | null>(null);
    const [isNavigatorReady, setIsNavigatorReady] = useState(false);

    useEffect(() => {
        if (user && isNavigatorReady) {
            const subscription = Notifications.addNotificationResponseReceivedListener(response => {
                const gameID = response.notification.request.content.data.gameId;
                if (navigatorRef.current?.getCurrentRoute()?.name === "MultiplayerGame") {
                    navigatorRef.current.dispatch(
                        StackActions.replace("MultiplayerGame", {
                            gameID
                        })
                    );
                } else {
                    navigatorRef.current?.navigate("MultiplayerGame", {
                        gameID
                    });
                }
            });
            return () => {
                subscription.remove();
            };
        }
    }, [user, isNavigatorReady]);

    return (
        <NavigationContainer
            ref={navigatorRef}
            onReady={() => {
                setIsNavigatorReady(true);
            }}
        >
            <Stack.Navigator screenOptions={navigatorOptions}>
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen
                    name="SinglePlayerGame"
                    component={SinglePlayerGame}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MultiplayerHome"
                    component={MultiplayerHome}
                    options={{ title: "Multiplayer" }}
                />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen options={{ title: "Sign Up" }} name="Register" component={Register} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} />
                <Stack.Screen
                    name="MultiplayerGame"
                    component={MultiplayerGame}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigator;
