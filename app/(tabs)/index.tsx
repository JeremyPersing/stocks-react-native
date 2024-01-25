import { View, FlatList, useWindowDimensions } from "react-native";
import { Text } from "react-native-paper";

import { stocks } from "@/data";
import { StockCard } from "@/components/StockCard";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, paddingTop: 30 }}>
      <Text
        variant="titleLarge"
        style={{ fontWeight: "bold", marginLeft: 5, marginBottom: 5 }}
      >
        Available Stocks
      </Text>
      <FlatList
        keyExtractor={(item) => item.ticker}
        data={stocks}
        renderItem={({ item }) => (
          <StockCard
            companyName={item.companyName}
            image={item.image}
            price={item.price}
            priceChange={item.priceChange}
            priceChangePercentage={item.priceChangePercentage}
            ticker={item.ticker}
          />
        )}
      />
    </View>
  );
}
