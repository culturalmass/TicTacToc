import React, { ReactElement } from "react";
import { AppBootstrap } from "@components";
import Navigator from "@config/navigator";
import { SettingsProvider } from "@contexts/settings-context";
import { AuthProvider } from "@contexts/auth-context";
import Amplify from "aws-amplify";
import config from "../aws-exports";

Amplify.configure(config);

const App = (): ReactElement => {
    return (
        <AuthProvider>
            <AppBootstrap>
                <SettingsProvider>
                    <Navigator />
                </SettingsProvider>
            </AppBootstrap>
        </AuthProvider>
    );
};

export default App;
