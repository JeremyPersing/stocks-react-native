import {
  SafeAreaView,
  View,
  Pressable,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useContext, useState } from "react";
import { LineChart } from "react-native-gifted-charts";

import { selectStock, selectStockPrices } from "@/utils/searchStocks";
import { formatCurrency } from "@/utils/formatCurrency";
import { BarChart } from "@/components/BarChart";
import { StoreContext } from "./_layout";

export default function TickerScreen() {
  const options = ["Description", "Historical Metrics"];
  const { ticker } = useLocalSearchParams();
  const stock = selectStock(ticker as string);
  const stockPrices = selectStockPrices(ticker as string);
  const { width } = useWindowDimensions();
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const { likedStocks, updateLikedStocks } = useContext(StoreContext);

  const positiveOverallPriceChange =
    stockPrices &&
    stockPrices[0].value < stockPrices[stockPrices.length - 1].value;

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 20, marginBottom: 10 }}>
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 25,
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="chevron-left"
            color={"white"}
            size={40}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            if (likedStocks.includes(ticker as string))
              return updateLikedStocks(ticker as string, "del");
            updateLikedStocks(ticker as string, "add");
          }}
        >
          <MaterialCommunityIcons
            name={
              likedStocks.includes(ticker as string) ? "star" : "star-outline"
            }
            color={"white"}
            size={40}
          />
        </Pressable>
      </View>

      {stock ? (
        <FlatList
          data={[1]}
          renderItem={() => (
            <View>
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={stock.image}
                  style={{ height: 50, width: 50 }}
                  contentFit="contain"
                />
                <View style={{ paddingLeft: 20 }}>
                  <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                    {stock.ticker}
                  </Text>
                  <Text variant="labelMedium">{stock.companyName}</Text>
                </View>
              </View>
              <View style={{ paddingTop: 20 }}>
                <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
                  {formatCurrency(stock.price)}
                </Text>
                <Text
                  variant="labelLarge"
                  style={{
                    color:
                      stock.priceChange < 0
                        ? "red"
                        : stock.priceChange > 0
                        ? "lightgreen"
                        : "auto",
                  }}
                >
                  {formatCurrency(stock.priceChange)}{" "}
                  {stock.priceChangePercentage.toFixed(2)}%
                </Text>
              </View>
              <View style={{ paddingTop: 20 }}>
                <LineChart
                  areaChart
                  data={stockPrices}
                  rotateLabel
                  labelsExtraHeight={20}
                  hideDataPoints
                  spacing={width / stockPrices.length - 2}
                  color={positiveOverallPriceChange ? "green" : "red"}
                  thickness={2}
                  startFillColor={positiveOverallPriceChange ? "green" : "red"}
                  endFillColor={positiveOverallPriceChange ? "green" : "red"}
                  startOpacity={0.9}
                  endOpacity={0.2}
                  initialSpacing={0}
                  hideYAxisText={true}
                  rulesType="solid"
                  rulesColor="black"
                  xAxisColor="lightgray"
                  pointerConfig={{
                    pointerStripHeight: 140,
                    pointerStripColor: "lightgray",
                    pointerStripWidth: 2,
                    pointerColor: "lightgray",
                    radius: 6,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 90,
                    activatePointersOnLongPress: true,
                    autoAdjustPointerLabelPosition: false,
                    pointerLabelComponent: (items: any) => {
                      return (
                        <View
                          style={{
                            height: 90,
                            width: 100,
                            justifyContent: "center",
                            marginTop: -30,
                            marginLeft: -40,
                            borderRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 14,
                              marginBottom: 6,
                              textAlign: "center",
                            }}
                          >
                            {items[0].date}
                          </Text>

                          <View
                            style={{
                              paddingHorizontal: 14,
                              paddingVertical: 6,
                              borderRadius: 16,
                              backgroundColor: "white",
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: "bold",
                                textAlign: "center",
                                color: "black",
                              }}
                            >
                              {"$" + items[0].value.toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      );
                    },
                  }}
                />
              </View>

              <FlatList
                data={options}
                keyExtractor={(item) => item}
                horizontal
                style={{ marginTop: 80 }}
                renderItem={({ item }) => (
                  <Button
                    onPress={() => setSelectedOption(item)}
                    mode={item === selectedOption ? "contained" : "outlined"}
                    style={{ marginRight: 10 }}
                  >
                    {item}
                  </Button>
                )}
              />

              {selectedOption === "Historical Metrics" ? (
                <View style={{ marginTop: 20 }}>
                  <BarChart
                    color="lightblue"
                    data={stock.returnOnEquity}
                    label="ROE"
                  />

                  <BarChart
                    color="lightgreen"
                    data={stock.returnOnCapitalEmployed}
                    label="ROCE"
                  />

                  <BarChart
                    color="dodgerblue"
                    data={stock.revenue}
                    label="Revenue"
                  />

                  <BarChart
                    color="darkgreen"
                    data={stock.earnings}
                    label="Earnings"
                  />

                  <BarChart
                    color="maroon"
                    data={stock.freeCashFlow}
                    label="FCF"
                  />

                  <BarChart color="green" data={stock.cash} label="Cash" />
                  <BarChart color="purple" data={stock.debt} label="Debt" />

                  <BarChart
                    color="orange"
                    data={stock.grossProfitMargin}
                    label="Gross Profit Margin"
                  />

                  <BarChart
                    color="cornsilk"
                    data={stock.netProfitMargin}
                    label="Net Profit Margin"
                  />
                </View>
              ) : (
                <View style={{ marginTop: 20 }}>
                  <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                    CEO
                  </Text>
                  <Text>{stock.ceo}</Text>

                  <Text
                    variant="titleMedium"
                    style={{ fontWeight: "bold", marginTop: 5 }}
                  >
                    Exchange
                  </Text>
                  <Text>{stock.exchange}</Text>

                  <Text
                    variant="titleMedium"
                    style={{ fontWeight: "bold", marginTop: 5 }}
                  >
                    Sector
                  </Text>
                  <Text>{stock.sector}</Text>

                  <Text
                    variant="titleMedium"
                    style={{ fontWeight: "bold", marginTop: 5 }}
                  >
                    Industry
                  </Text>
                  <Text>{stock.industry}</Text>

                  <Text
                    variant="titleMedium"
                    style={{ fontWeight: "bold", marginTop: 5 }}
                  >
                    Location
                  </Text>
                  <Text>
                    {stock.city}, {stock.state}
                  </Text>

                  <Text
                    variant="titleMedium"
                    style={{ fontWeight: "bold", marginTop: 5 }}
                  >
                    IPO
                  </Text>
                  <Text>{stock.ipoDate}</Text>

                  <Text
                    variant="titleMedium"
                    style={{ fontWeight: "bold", marginTop: 5 }}
                  >
                    Description
                  </Text>
                  <Text>{stock.description}</Text>
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <Text>Stock Not Available</Text>
      )}
    </SafeAreaView>
  );
}
