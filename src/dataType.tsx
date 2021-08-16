export type typeVaccine = {
  id: number;
  user_id: any;
  name: string;
  amount: number;
  email: string;
  tel: string;
  lat: number;
  long: number;
  description: string;
  createAt: Date;
};

export type typeNewVaccine = {
  user_id: any;
  name: string;
  amount: number;
  email: string;
  tel: string;
  lat: number;
  long: number;
  description: string;
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        resolve([position.coords.latitude, position.coords.longitude]);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  });
};
