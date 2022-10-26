import {
    ScrollView,
    TextInput as NativeTextInput,
    Alert,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { GradientBackground, TextInput, Button } from "@components";
import React, { ReactElement, useRef, useState } from "react";
import { Auth } from "aws-amplify";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { StackNavigatorParams } from "@config/navigator";
import styles from "./forgot-password.styles";

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
    StackNavigatorParams,
    "ForgotPassword"
>;
type ForgotPasswordProps = {
    navigation: ForgotPasswordScreenNavigationProp;
};

const ForgotPassword = ({ navigation }: ForgotPasswordProps): ReactElement => {
    const headerHeight = useHeaderHeight();
    const passswordRef = useRef<NativeTextInput | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"1" | "2">("1");
    const [form, setForm] = useState({
        username: "",
        password: "",
        code: ""
    });
    const setFormInput = (key: keyof typeof form, value: string) => {
        setForm({ ...form, [key]: value });
    };
    const forgotPassword = async () => {
        const { username } = form;
        setLoading(true);
        try {
            await Auth.forgotPassword(username);
            setStep("2");
        } catch (error: any) {
            Alert.alert("Error", error.message || "An error has ocurred!");
        }
        setLoading(false);
    };
    const forgotPasswordSubmit = async () => {
        const { username, code, password } = form;
        setLoading(true);
        try {
            await Auth.forgotPasswordSubmit(username, code, password);
            Alert.alert("Success!", "Password Changed Sucessfully");
            navigation.navigate("Login");
        } catch (error: any) {
            Alert.alert("Error", error.message || "An error has ocurred");
        }
        setLoading(false);
    };
    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={headerHeight}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    {step === "1" && (
                        <TextInput
                            returnKeyType="next"
                            style={{ marginBottom: 20 }}
                            placeholder="Username"
                            value={form.username}
                            onChangeText={value => setFormInput("username", value)}
                        />
                    )}
                    {step === "2" && (
                        <>
                            <TextInput
                                returnKeyType="next"
                                keyboardType="numeric"
                                style={{ marginBottom: 20 }}
                                placeholder="Verification Code"
                                value={form.code}
                                onChangeText={value => setFormInput("code", value)}
                                onSubmitEditing={() => passswordRef.current?.focus()}
                            />
                            <TextInput
                                secureTextEntry
                                returnKeyType="done"
                                style={{ marginBottom: 20 }}
                                ref={passswordRef}
                                placeholder="New Password"
                                value={form.password}
                                onChangeText={value => setFormInput("password", value)}
                            />
                        </>
                    )}
                    <Button
                        style={{ marginTop: 10 }}
                        loading={loading}
                        onPress={() => {
                            if (step === "1") {
                                forgotPassword();
                            }
                            if (step === "2") {
                                forgotPasswordSubmit();
                            }
                        }}
                        title="Submit"
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};
export default ForgotPassword;
