import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { createContext, useState } from "react";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { PaperProvider, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { theme } from "@/theme";
import { SearchableStock } from "@/data";
import { searchStocks } from "@/utils/searchStocks";
import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

export const StoreContext = createContext<{
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  searchedStocks: SearchableStock[];
  setSearchedStocks: (stocks: SearchableStock[]) => void;
  likedStocks: string[];
  updateLikedStocks: (ticker: string, op: "add" | "del") => void;
}>({
  searchQuery: "",
  setSearchQuery: () => {},
  searchedStocks: [],
  setSearchedStocks: () => {},
  likedStocks: [],
  updateLikedStocks: () => {},
});

function RootLayoutNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedStocks, setSearchedStocks] = useState<SearchableStock[]>([]);
  const [likedStocks, setLikedStocks] = useState<string[]>([]);

  const updateLikedStocks = async (ticker: string, op: "add" | "del") => {
    const prevStocks = [...likedStocks];
    const newStocks =
      op === "del"
        ? prevStocks.filter((symbol) => symbol !== ticker)
        : [ticker, ...prevStocks];

    try {
      await AsyncStorage.setItem("watchlist", JSON.stringify(newStocks));
      setLikedStocks(newStocks);
    } catch (error) {
      setLikedStocks(prevStocks);
    }
  };

  useEffect(() => {
    async function getLikedStocks() {
      const stocks = await AsyncStorage.getItem("watchlist");
      if (stocks) setLikedStocks(JSON.parse(stocks));
    }

    getLikedStocks();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={DarkTheme}>
        <StoreContext.Provider
          value={{
            searchQuery,
            setSearchQuery,
            searchedStocks,
            setSearchedStocks,
            likedStocks,
            updateLikedStocks,
          }}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="search"
                options={{
                  headerBackTitleVisible: false,
                  headerTitle: () => (
                    <TextInput
                      mode="outlined"
                      placeholder="Search Stocks..."
                      autoFocus
                      dense
                      style={{ width: "88%" }}
                      onChangeText={(text: string) => {
                        setSearchQuery(text);
                        const stocks = searchStocks(text);
                        setSearchedStocks(stocks);
                      }}
                    />
                  ),
                }}
              />
              <Stack.Screen name="[ticker]" options={{ headerShown: false }} />
            </Stack>
          </GestureHandlerRootView>
        </StoreContext.Provider>
      </ThemeProvider>
    </PaperProvider>
  );
}
