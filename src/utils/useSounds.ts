import { useRef, useEffect } from "react";
import { Alert } from "react-native";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { useSettings } from "@contexts/settings-context";

type SoundType = "pop1" | "pop2" | "win" | "loss" | "draw";

const useSounds = (): ((sound: SoundType) => void) => {
    const { settings } = useSettings();
    const popSoundRef = useRef<Audio.Sound | null>(null);
    const pop2SoundRef = useRef<Audio.Sound | null>(null);
    const winSoundRef = useRef<Audio.Sound | null>(null);
    const lossSoundRef = useRef<Audio.Sound | null>(null);
    const drawSoundRef = useRef<Audio.Sound | null>(null);

    const playSound = async (sound: SoundType): Promise<void> => {
        const soundsMap = {
            pop1: popSoundRef,
            pop2: pop2SoundRef,
            win: winSoundRef,
            loss: lossSoundRef,
            draw: drawSoundRef
        };
        try {
            const status = await soundsMap[sound].current?.getStatusAsync();
            status &&
                status.isLoaded &&
                settings?.sounds &&
                soundsMap[sound].current?.replayAsync();
            if (settings?.haptics) {
                switch (sound) {
                    case "pop1":
                    case "pop2":
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        break;
                    case "win":
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        break;
                    case "loss":
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                        break;
                    case "draw":
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        break;
                    default:
                        break;
                }
            }
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
    };

    useEffect(() => {
        //load sounds
        const popSoundObjects = new Audio.Sound();
        const pop2SoundObjects = new Audio.Sound();
        const winSoundObjects = new Audio.Sound();
        const lossSoundObjects = new Audio.Sound();
        const drawSoundObjects = new Audio.Sound();

        const loadSounds = async () => {
            /* eslint-disable @typescript-eslint/no-var-requires */
            await popSoundObjects.loadAsync(require("@assets/pop_1.wav"));
            popSoundRef.current = popSoundObjects;

            await pop2SoundObjects.loadAsync(require("@assets/pop_1.wav"));
            pop2SoundRef.current = pop2SoundObjects;

            await winSoundObjects.loadAsync(require("@assets/win.mp3"));
            winSoundRef.current = winSoundObjects;

            await lossSoundObjects.loadAsync(require("@assets/loss.mp3"));
            lossSoundRef.current = lossSoundObjects;

            await drawSoundObjects.loadAsync(require("@assets/draw.mp3"));
            drawSoundRef.current = drawSoundObjects;
        };
        loadSounds();
        return () => {
            //unload sounds
            popSoundObjects && popSoundObjects.unloadAsync();
            pop2SoundObjects && pop2SoundObjects.unloadAsync();
            winSoundObjects && winSoundObjects.unloadAsync();
            lossSoundObjects && lossSoundObjects.unloadAsync();
            drawSoundObjects && drawSoundObjects.unloadAsync();
        };
    }, []);

    return playSound;
};

export default useSounds;
