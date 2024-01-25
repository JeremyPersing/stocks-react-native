import { StyleSheet, View, FlatList, Animated, Pressable } from "react-native";
import { useContext } from "react";
import { Text } from "react-native-paper";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { StoreContext } from "../_layout";
import { stocks } from "@/data";
import { StockCard } from "@/components/StockCard";

function RightActions({
  progress,
  dragX,
  onPress,
}: {
  progress: Animated.AnimatedInterpolation<string | number>;
  dragX: Animated.AnimatedInterpolation<string | number>;
  onPress: () => void;
}) {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [0.7, 0],
  });

  return (
    <Pressable
      style={{
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 90,
      }}
      onPress={onPress}
    >
      <Animated.Text
        style={{
          fontWeight: "bold",
          fontSize: 22,
          color: "white",
          transform: [{ scale }],
        }}
      >
        Delete
      </Animated.Text>
    </Pressable>
  );
}

export default function WatchlistScreen() {
  const { likedStocks, updateLikedStocks } = useContext(StoreContext);

  if (likedStocks.length > 0)
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item) => item.ticker}
          data={stocks.filter((i) => likedStocks.includes(i.ticker))}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={(progress, dragX) => (
                <RightActions
                  progress={progress}
                  dragX={dragX}
                  onPress={() => updateLikedStocks(item.ticker, "del")}
                />
              )}
            >
              <StockCard {...item} />
            </Swipeable>
          )}
        />
      </View>
    );
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
        No Stocks On Watchlist
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
