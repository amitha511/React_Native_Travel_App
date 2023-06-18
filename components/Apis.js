import axios from "axios";

export default async function NearByAPI(attractions, location) {
  let userRadius = 100;
  selectedOption = "car";
  if (selectedOption !== null) {
    if (selectedOption === "walking") {
      userRadius = 2500;
    } else if (selectedOption === "public") {
      userRadius = 5000;
    } else if (selectedOption === "car") {
      userRadius = 10000;
    }

    try {
      const requests = attractions.map((attraction) => {
        return axios.get(
          "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
          {
            params: {
              location: "32.109333,34.855499",
              radius: 10000,
              type: "bar",
              key: process.env.key,
            },
          }
        );
      });

      const responses = await Promise.all(requests);
      const data = responses.map((response) => response.data.results);
      const allData = data.flat();
      const filteredDataList = allData.filter(
        (item) => item.rating !== undefined
      );
      return allData;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
