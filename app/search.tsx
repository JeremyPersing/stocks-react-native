import { FlatList, StyleSheet, View } from "react-native";
import { useContext } from "react";
import { Text } from "react-native-paper";

import { StoreContext } from "./_layout";
import { StockCard } from "@/components/StockCard";

export default function SearchScreen() {
  const { searchQuery, searchedStocks } = useContext(StoreContext);

  if (!searchQuery && searchedStocks.length === 0)
    return (
      <View style={styles.container}>
        <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
          Search Stocks
        </Text>
      </View>
    );

  if (searchQuery && searchedStocks.length === 0)
    return (
      <View style={styles.container}>
        <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
          No Stocks Found :(
        </Text>
      </View>
    );

  return (
    <FlatList
      data={searchedStocks}
      keyExtractor={(item) => item.ticker}
      renderItem={({ item }) => <StockCard {...item} />}
    />
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
