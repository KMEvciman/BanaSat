import { useState, useEffect } from "react";
import { View, Keyboard, Platform } from "react-native";

/** Klavye yüksekliğini canlı izleyen hook (0 = kapalı). */
export function useKeyboardHeight(): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (e) => setKeyboardHeight(e.endCoordinates?.height ?? 0));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);
  return keyboardHeight;
}

// SDK 54 + Android edge-to-edge ile adjustResize/KeyboardAvoidingView güvenilir
// çalışmadığından, klavye yüksekliği kadar alt boşluk ekleyip içeriği klavyenin
// üstünde topluyoruz (içerik scroll edilebilir).
export default function KeyboardAware({ children }: { children: React.ReactNode }) {
  const keyboardHeight = useKeyboardHeight();
  return <View style={{ flex: 1, paddingBottom: keyboardHeight }}>{children}</View>;
}
