import axios from 'axios';

export const getSearchBoundingBox = async (localisation) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${localisation}.json?&types=place&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
    );
    if (response.status === 200) {
      return response.data.features[0].bbox;
    } else throw new Error('Wrong MapBox response code');
  } catch (e) {
    throw new Error('MapBox request failed');
  }
};
