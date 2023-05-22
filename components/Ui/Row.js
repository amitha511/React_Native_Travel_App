import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";

function Row(props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image key={"nickname"} style={styles.img} source={props.image} />
        <View style={styles.text}>
          <Text style={styles.text.title}>{props.title}</Text>
          <Text>
            {props.address ? (
              props.address
            ) : (
              <Text style={{ color: "red" }}>No Address Available</Text>
            )}
          </Text>
          <Text>
            Rating:
            {props.rating ? (
              props.rating
            ) : (
              <Text style={{ color: "red" }}>No Rating Available</Text>
            )}
          </Text>
          <Text>
            Business Status:
            {props.businessStatus ? (
              props.businessStatus
                .replace(/_/g, " ")
                .toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
                .join(" ")
            ) : (
              <Text style={{ color: "red" }}>No Business Status Available</Text>
            )}
          </Text>
          {console.log(props.image)}
        </View>
      </View>
    </View>
  );
}
export default Row;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    padding: 10,
    backgroundColor: "#ffffff",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    title: { fontWeight: "bold" },
    fontSize: 20,
    width: 270,
  },
  img: {
    borderWidth: 2,
    borderColor: "#990099",
    margin: 10,
    width: 100,
    height: 100,
    borderRadius: 50 / 2,
  },
});
