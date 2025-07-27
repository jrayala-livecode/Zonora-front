 const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 600000,
    });
  });
};

async function getLocationFromIP() {
  try {
    // Method 1: Using a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if(!data || !data.latitude || !data.longitude) {
        throw new Error("Invalid location data from IP");
    }

    const position: GeolocationPosition = {
        coords: {
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: 0,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
            toJSON: function () {
                throw new Error("Function not implemented.");
            }
        },
        timestamp: Date.now(),
        toJSON: function () {
            throw new Error("Function not implemented.");
        }
    };

    return position;
  } catch (error) {
    return getDefaultLocation();    
  }  
}


function getDefaultLocation() {
    return {
        coords: {
            latitude: -33.4489, // Default to Santiago, Chile
            longitude: -70.6693 // Default to Santiago, Chile
        }
    }
}


export {
    getUserLocation,
    getLocationFromIP
}