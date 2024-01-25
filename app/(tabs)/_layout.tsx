import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, Tabs, router } from "expo-router";
import { Pressable } from "react-native";
import { TextInput } from "react-native-paper";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  color: string;
}) {
  return <MaterialIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          header: () => (
            <Pressable
              style={{ width: "100%", paddingHorizontal: 20, paddingTop: 50 }}
              onPress={() => router.push("/search")}
            >
              <TextInput
                placeholder="Search Stocks..."
                disabled
                mode="outlined"
                left={<TextInput.Icon icon={"magnify"} />}
                onPressIn={() => router.push("/search")}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: "Watchlist",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="star-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
