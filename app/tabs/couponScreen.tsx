import React, { useState } from "react";
import { Dimensions } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import CouponScreen from "../components/CouponScreen";
import myCoupons from "../components/myCoupons"; // Sağ sayfa

const CouponsPager = () => {
  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "coupon", title: "Kupon" },
    { key: "other", title: "Bekleyen Kuponlarım" },
  ]);

  const renderScene = SceneMap({
    coupon: CouponScreen,
    other: myCoupons,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};

export default CouponsPager;
