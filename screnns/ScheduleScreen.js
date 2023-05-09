import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Schedule = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const [attractions, setAttractions] = useState([
    { id: 1, name: "Default Attraction", day: "Sunday", start: 2, end: 4 },
  ]);

  const addAttraction = () => {
    const newAttraction = {
      id: Date.now(),
      name: "New Attraction",
      day: "Sunday",
      start: 0,
      end: 1,
    };
    setAttractions([...attractions, newAttraction]);
  };

  const updateAttraction = (id, field, value) => {
    setAttractions(
      attractions.map((attr) => {
        if (attr.id === id) {
          if (field === "start" || field === "end") {
            const newStart = field === "start" ? value : parseInt(attr.start);
            const newEnd = field === "end" ? value : parseInt(attr.end);

            if (newStart < newEnd) {
              // Check if the updated attraction overlaps with any existing attractions
              const overlap = attractions.some(
                (otherAttraction) =>
                  otherAttraction.day === attr.day &&
                  otherAttraction.id !== attr.id &&
                  ((newStart >= otherAttraction.start &&
                    newStart < otherAttraction.end) ||
                    (newEnd > otherAttraction.start &&
                      newEnd <= otherAttraction.end))
              );

              if (!overlap) {
                return { ...attr, [field]: value };
              }
            }
          } else {
            return { ...attr, [field]: value };
          }
        }
        return attr;
      })
    );
  };
  const deleteAttraction = (id) => {
    setAttractions(attractions.filter((attr) => attr.id !== id));
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View style={styles.times}>
          <Text></Text>
          {hours.map((hour) => (
            <Text key={hour}>{`${hour}:00`}</Text>
          ))}
        </View>
        <View style={styles.days}>
          {days.map((day) => (
            <View key={day} style={styles.dayColumn}>
              <Text style={styles.day}>{day}</Text>
              {hours.map((hour) => (
                <View key={hour} style={[styles.hour, styles.hourRow]}>
                  {attractions.map((attraction) => {
                    if (
                      attraction.day === day &&
                      parseInt(attraction.start) === hour
                    ) {
                      return (
                        <View key={attraction.id} style={styles.attraction}>
                          <TextInput
                            value={attraction.name}
                            onChangeText={(text) =>
                              updateAttraction(attraction.id, "name", text)
                            }
                            style={styles.nameInput}
                          />
                          <TextInput
                            value={`${attraction.start}`}
                            onChangeText={(text) =>
                              updateAttraction(
                                attraction.id,
                                "start",
                                parseInt(text)
                              )
                            }
                            style={styles.hourInput}
                            keyboardType="numeric"
                          />
                          <TextInput
                            value={`${attraction.end}`}
                            onChangeText={(text) =>
                              updateAttraction(
                                attraction.id,
                                "end",
                                parseInt(text)
                              )
                            }
                            style={styles.hourInput}
                            keyboardType="numeric"
                          />
                          <Button
                            title="Delete"
                            onPress={() => deleteAttraction(attraction.id)}
                          />
                        </View>
                      );
                    }
                    return null;
                  })}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.addButtonContainer}>
        <Button title="Add Attraction" onPress={addAttraction} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  times: {
    marginRight: 10,
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  days: {
    flex: 1,
    flexDirection: "row",
  },
  dayColumn: {
    width: 200,
    borderRightColor: "#ccc",
    borderRightWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
  },
  day: {
    fontWeight: "bold",
    paddingBottom: 10,
  },
  hour: {
    paddingBottom: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  hourLine: {
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    marginHorizontal: -10,
  },
  attraction: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  nameInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 10,
  },
  hourInput: {
    width: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  addButtonContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default Schedule;
