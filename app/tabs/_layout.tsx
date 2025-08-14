import { Ionicons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import * as React from 'react';
export default function TabLayout() {
  return (
      <Tabs>
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


        <Tabs.Screen name='settingsScreen'
        options={{
          title:"Settings",
          tabBarIcon:({color,size})=>(
            <Ionicons name='settings' size={size} color={color}/>
          )
        }}
        >
        </Tabs.Screen>

      </Tabs>
  );
}
