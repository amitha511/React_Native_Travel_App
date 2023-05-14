import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";

function Row(props) {
  //props - image, title , phone, website

  const handlePress = () => {
    if (props.website) {
      Linking.openURL(props.website);
    }
  };

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
            {props.phone ? (
              props.phone
            ) : (
              <Text style={{ color: "red" }}>No Phone Available</Text>
            )}
          </Text>
          <View>
            <TouchableOpacity onPress={handlePress}>
              {props.website ? (
                <Text style={{ color: "blue" }}>click here to the website</Text>
              ) : (
                <Text style={{ color: "red" }}>No Website Available</Text>
              )}
            </TouchableOpacity>
          </View>
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
