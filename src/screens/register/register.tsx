import {
    ScrollView,
    TextInput as NativeTextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import React, { ReactElement, useRef, useState, useEffect } from "react";
import { RouteProp } from "@react-navigation/native";
import { GradientBackground, TextInput, Button, Text } from "@components";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { StackNavigatorParams } from "@config/navigator";
import { Auth } from "aws-amplify";
import styles from "./register.styles";
import OTPInput from "@twotalltotems/react-native-otp-input";
import { colors } from "@utils";

type RegisterProps = {
    navigation: NativeStackNavigationProp<StackNavigatorParams, "Register">;
    route: RouteProp<StackNavigatorParams, "Register">;
};

const Register = ({ navigation, route }: RegisterProps): ReactElement => {
    const unconfirmedUsername = route.params?.username;
    const headerHeight = useHeaderHeight();
    const passwordRef = useRef<NativeTextInput>(null);
    const emailRef = useRef<NativeTextInput>(null);
    const nameRef = useRef<NativeTextInput>(null);
    const [form, setForm] = useState({
        username: "test",
        email: "aristaeus@tstartedpj.com",
        name: "Test Name",
        password: "12345678"
    });
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"signUp" | "otp">(unconfirmedUsername ? "otp" : "signUp");
    const [confirming, setConfirming] = useState(false);
    const [resending, setResending] = useState(false);
    const setFormInput = (key: keyof typeof form, value: string) => {
        setForm({ ...form, [key]: value });
    };
    const signUp = async () => {
        setLoading(true);
        const { username, password, email, name } = form;
        try {
            await Auth.signUp({ username, password, attributes: { email, name } });
            setStep("otp");
            // navigation.navigate("Home");
        } catch (error: any) {
            Alert.alert("Error!", error.message || "An error has occurred!");
        }

        setLoading(false);
    };
    const confirmCode = async (code: string) => {
        setConfirming(true);
        try {
            await Auth.confirmSignUp(form.username || unconfirmedUsername || "", code);
            navigation.navigate("Login");
            Alert.alert("Succes", "You can now login with your account.");
        } catch (error: any) {
            Alert.alert("Error!", error.message || "An error has occurred!");
        }
        setConfirming(false);
    };
    const resendCode = async (username: string) => {
        setResending(true);
        try {
            await Auth.resendSignUp(username);
        } catch (error: any) {
            Alert.alert("Error!", error.message || "An error has occurred!");
        }
        setResending(false);
    };

    //Doubt of the usefulness of this useEffect for this case
    useEffect(() => {
        if (unconfirmedUsername) {
            resendCode(unconfirmedUsername);
        }
    }, []);

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                keyboardVerticalOffset={headerHeight}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    {step === "otp" && (
                        <>
                            <Text style={styles.otpText}>
                                Enter the code that you received via email
                            </Text>
                            {confirming ? (
                                <ActivityIndicator color={colors.lightGreen} />
                            ) : (
                                <>
                                    <OTPInput
                                        // style={{ width: "80%", height: 200 }}
                                        placeholderCharacter="0"
                                        placeholderTextColor="#5d5379"
                                        pinCount={6}
                                        codeInputFieldStyle={styles.otpInputBox}
                                        codeInputHighlightStyle={styles.otpActiveInputBox}
                                        onCodeFilled={code => confirmCode(code)}
                                    />
                                    {resending ? (
                                        <ActivityIndicator color={colors.lightGreen} />
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (form.username) {
                                                    resendCode(form.username);
                                                }
                                                if (unconfirmedUsername) {
                                                    resendCode(unconfirmedUsername);
                                                }
                                            }}
                                        >
                                            <Text style={styles.resendLink}>Resend Code</Text>
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    {step === "signUp" && (
                        <>
                            <TextInput
                                returnKeyType="next"
                                placeholder="Username"
                                onChangeText={value => setFormInput("username", value)}
                                onSubmitEditing={() => nameRef.current?.focus()}
                                value={form.username}
                                style={{ marginBottom: 20 }}
                            />
                            <TextInput
                                ref={nameRef}
                                returnKeyType="next"
                                placeholder="Name"
                                onChangeText={value => setFormInput("name", value)}
                                onSubmitEditing={() => emailRef.current?.focus()}
                                value={form.name}
                                style={{ marginBottom: 20 }}
                            />
                            <TextInput
                                keyboardType="email-address"
                                ref={emailRef}
                                returnKeyType="next"
                                placeholder="Email"
                                onChangeText={value => setFormInput("email", value)}
                                onSubmitEditing={() => passwordRef.current?.focus()}
                                value={form.email}
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
                            <Button loading={loading} title="Sign Up" onPress={signUp} />
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};

export default Register;
