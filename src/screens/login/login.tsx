import { ScrollView, TextInput as NativeTextInput, Alert, TouchableOpacity } from "react-native";
import React, { ReactElement, useRef, useState } from "react";
import { GradientBackground, TextInput, Button, Text } from "@components";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorParams } from "@config/navigator";
import { RouteProp } from "@react-navigation/native";
import { Auth } from "aws-amplify";
import { getErrorMessage } from "@utils";
import styles from "./login.styles";

type LoginProps = {
    navigation: NativeStackNavigationProp<StackNavigatorParams, "Login">;
    route: RouteProp<StackNavigatorParams, "Login">;
};

const Login = ({ navigation, route }: LoginProps): ReactElement => {
    const redirect = route.params?.redirect;
    const passwordRef = useRef<NativeTextInput>(null);
    const [form, setForm] = useState({
        username: "test",
        password: "12345678"
    });
    const [loading, setLoading] = useState(false);
    const setFormInput = (key: keyof typeof form, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const login = async () => {
        setLoading(true);
        const { username, password } = form;
        try {
            await Auth.signIn(username, password);
            redirect ? navigation.replace(redirect) : navigation.navigate("Home");
        } catch (error: any) {
            if (error.code === "UserNotConfirmedException") {
                navigation.navigate("Register", { username });
                // username.length > 0
                //     ? navigation.navigate("Register", { username })
                //     : navigation.navigate("Register");
            } else {
                Alert.alert("Error!", getErrorMessage(error));
            }
        }

        setLoading(false);
    };
    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    returnKeyType="next"
                    placeholder="Username"
                    onChangeText={value => setFormInput("username", value)}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    value={form.username}
                    style={{ marginBottom: 20 }}
                />
                <TextInput
                    ref={passwordRef}
                    onChangeText={value => setFormInput("password", value)}
                    returnKeyType="done"
                    secureTextEntry
                    placeholder="Password"
                    value={form.password}
                    style={{ marginBottom: 30 }}
                />
                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                    <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
                </TouchableOpacity>
                <Button loading={loading} title="Login" onPress={login} />
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("Register");
                    }}
                >
                    <Text style={styles.registerLink}>Don&apos;t have an account? </Text>
                </TouchableOpacity>
            </ScrollView>
        </GradientBackground>
    );
};

export default Login;
