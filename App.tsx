import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import fonts from "./config/fonts";
import Navigation from "./navigation";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://10.162.163.46:3000/graphql',
  cache: new InMemoryCache()
});

export default function App() {
  const [fontsLoaded] = useFonts(fonts);

  return !fontsLoaded ? null : (
    <ApolloProvider client={client}>
      <Navigation />
      <StatusBar />
    </ApolloProvider>
  );
}
