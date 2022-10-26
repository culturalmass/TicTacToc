import {
    ScrollView,
    TextInput as NativeTextInput,
    Alert,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { GradientBackground, TextInput, Button, Text } from "@components";
import React, { ReactElement, useRef, useState } from "react";
import { Auth } from "aws-amplify";
import { useHeaderHeight } from "@react-navigation/elements";
import styles from "./change-password.styles";
import { useAuth } from "@contexts/auth-context";

const ChangePassword = (): ReactElement => {
    const headerHeight = useHeaderHeight();
    const { user } = useAuth();
    const newPassswordRef = useRef<NativeTextInput | null>(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        oldpassword: "",
        newpassword: ""
    });
    const setFormInput = (key: keyof typeof form, value: string) => {
        setForm({ ...form, [key]: value });
    };
    const changePassword = async () => {
        const { oldpassword, newpassword } = form;
        setLoading(true);
        try {
            await Auth.changePassword(user, oldpassword, newpassword);
            setForm({
                oldpassword: "",
                newpassword: ""
            });
            Alert.alert("Success", "Password Changed Sucessfully");
        } catch (error: any) {
            Alert.alert("Error", error.message || "An error has ocurred!");
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
                    {!user ? (
                        <Text style={styles.text}>You are not logged in!</Text>
                    ) : (
                        <>
                            <Text weight="400" style={styles.text}>
                                Change Password For Username: {""}
                                <Text weight="700">{user.username}</Text>
                            </Text>
                            <TextInput
                                secureTextEntry
                                returnKeyType="next"
                                style={{ marginBottom: 20 }}
                                placeholder="Old Password"
                                onSubmitEditing={() => newPassswordRef.current?.focus()}
                                value={form.oldpassword}
                                onChangeText={value => setFormInput("oldpassword", value)}
                            />
                            <TextInput
                                secureTextEntry
                                returnKeyType="done"
                                style={{ marginBottom: 30 }}
                                ref={newPassswordRef}
                                placeholder="New Password"
                                onSubmitEditing={() => newPassswordRef.current?.focus()}
                                value={form.newpassword}
                                onChangeText={value => setFormInput("newpassword", value)}
                            />
                            <Button
                                loading={loading}
                                onPress={changePassword}
                                title="Change password"
                            />
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};
export default ChangePassword;
