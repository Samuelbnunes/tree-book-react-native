import React from "react";
import { TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "../context/AuthContext";

import BookList from "../data/BookList";
import BookDetail from "../data/BookDetail";
import Community from "../pages/Community";
import MyBooks from "../pages/MyBooks";
import CustomHeader from "../components/CustomHeader";
import Cart from "../pages/Cart";
import GradientBackground from "../components/GradientBackground";
import Settings from "../pages/Settings";
import About from './About';
import Genres from './Genres';
import PurchaseSuccess from './PurchaseSuccess';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();
const CommunityStack = createNativeStackNavigator();
const MyBooksStack = createNativeStackNavigator();

function commonHeaderOptions() {
  return {
    headerStyle: {
      backgroundColor: '#313131',
      borderBottomWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: '#fff',
  };
}

function CartStackNavigator() {
  const opts = commonHeaderOptions();
  return (
    <CartStack.Navigator screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
      <CartStack.Screen name="CartList" component={Cart} options={{ ...opts, headerTitle: () => <CustomHeader title="Carrinho" /> }} />
      <CartStack.Screen name="PurchaseSuccess" component={PurchaseSuccess} options={{ headerShown: false }} />
    </CartStack.Navigator>
  );
}

function SettingsStackNavigator() {
  const opts = commonHeaderOptions();
  return (
    <SettingsStack.Navigator screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
      <SettingsStack.Screen name="SettingsList" component={Settings} options={{ ...opts, headerTitle: () => <CustomHeader title="Configurações" /> }} />
      <SettingsStack.Screen name="About" component={About} options={{ ...opts, headerTitle: () => <CustomHeader title="Sobre o App" /> }} />
    </SettingsStack.Navigator>
  );
}

function CommunityStackNavigator() {
  const opts = commonHeaderOptions();
  return (
    <CommunityStack.Navigator screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
      <CommunityStack.Screen name="CommunityList" component={Community} options={{ ...opts, headerTitle: () => <CustomHeader title="Comunidade" /> }} />
    </CommunityStack.Navigator>
  );
}

function MyBooksStackNavigator() {
  const opts = commonHeaderOptions();
  return (
    <MyBooksStack.Navigator screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
      <MyBooksStack.Screen name="MyBooksList" component={MyBooks} options={{ ...opts, headerTitle: () => <CustomHeader title="Meus Livros" /> }} />
    </MyBooksStack.Navigator>
  );
}

function HomeStackNavigator({ onLogout }) {
  const opts = commonHeaderOptions();
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="BookList"
        component={BookList}
        options={{
          ...opts,
          headerTitle: () => <CustomHeader title="Home" />,
          headerRight: () => (
            <TouchableOpacity onPress={onLogout} style={{ marginRight: 15 }}>
              <MaterialIcons name="logout" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <HomeStack.Screen
        name="Genres"
        component={Genres}
        options={{ ...opts, headerTitle: () => <CustomHeader title="Gêneros" /> }}
      />
      <HomeStack.Screen
        name="BookDetail"
        component={BookDetail}
        options={{
          title: "Detalhes do Livro",
          headerStyle: opts.headerStyle,
          headerTintColor: opts.headerTintColor,
        }}
      />
    </HomeStack.Navigator>
  );
}

export default function Home({ onLogout }) {
  const { logout } = useAuth();
  return (
    <GradientBackground>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Comunidade') iconName = 'people';
            else if (route.name === 'Meus Livros') iconName = 'collections-bookmark';
            else if (route.name === 'Carrinho') iconName = 'shopping-cart';
            else if (route.name === 'Configurações') iconName = 'settings';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#1599E4',
          tabBarStyle: {
            backgroundColor: '#122e3fff',
            borderTopWidth: 0,
            elevation: 0,
          },
        })}
      >
        <Tab.Screen name="Home" children={() => <HomeStackNavigator onLogout={logout} />} />
        <Tab.Screen name="Comunidade" component={CommunityStackNavigator} />
        <Tab.Screen name="Meus Livros" component={MyBooksStackNavigator} />
        <Tab.Screen name="Carrinho" component={CartStackNavigator} />
        <Tab.Screen name="Configurações" component={SettingsStackNavigator} />
      </Tab.Navigator>
    </GradientBackground>
  );
}

function HomeWithLogout({ onLogout }) {
  return <HomeStackNavigator onLogout={onLogout} />;
}