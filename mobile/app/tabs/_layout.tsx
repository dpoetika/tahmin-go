import { Ionicons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import * as React from 'react';
import UserHeader from "../components/userHeader";
export default function TabLayout() {
  return (
      <Tabs
      screenOptions={{headerRight:()=><UserHeader></UserHeader>}}>
        <Tabs.Screen name='homeScreen'
        options={{
          title:"Home Screen",
          tabBarIcon:({color,size})=>(
            <Ionicons name='home' size={size} color={color}/>
          )
        }}
        >
        </Tabs.Screen>

        <Tabs.Screen name='scheduleScreen'
        options={{
          title:"Bülten",
          tabBarIcon:({color,size})=>(
            <Ionicons name='football' size={size} color={color}/>
          )
        }}
        >
        </Tabs.Screen>

        <Tabs.Screen name='couponScreen'
        options={{
          title:"Kuponlarım",
          tabBarIcon:({color,size})=>(
            <Ionicons name='pricetag' size={size} color={color}/>
          )
        }}
        >
        </Tabs.Screen>

        <Tabs.Screen name='tribunScreen'
        options={{
          title:"Tribün",
          tabBarIcon:({color,size})=>(
            <Ionicons name='planet-outline' size={size} color={color}/>
          )
        }}
        >
        </Tabs.Screen>

        <Tabs.Screen name='profileScreen'
        options={{
          title:"Profile",
          tabBarIcon:({color,size})=>(
            <Ionicons name="person-circle-outline" size={size} color={color} />
          )
        }}
        >
        </Tabs.Screen>

      </Tabs>
  );
}
