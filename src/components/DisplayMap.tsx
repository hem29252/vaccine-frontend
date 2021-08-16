import React, { useState } from "react";
import { map, longdo, LongdoMap } from "./LongdoMap";
import { typeVaccine, getCurrentLocation } from "../dataType";
import { Modal, Button } from "antd";
import axios from "axios";
import RouteDetailsMap from "./RouteDetailsMap"; 

const DisplayMap = () => {
  // state
  const [country, setCountry] = useState<string | null>(null);
  const [geocode, setGeocode] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [subdistrict, setSubdistrict] = useState<string | null>(null);
  const [postcode, setPostcode] = useState<string>("");
  const [elevation, setElevation] = useState<number | null>(0);
  const [road, setRoad] = useState<String | null>(null);
  const [description, setDescription] = useState<string | null>();
  const [email, setEmail] = useState<string>("");
  const [vaccineName, setVaccineName] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [tel, setTel] = useState<string>("");
  const [aoi, setAoi] = useState<string | null>(null);
  const [latDestination, setLatDestinnation] = useState<any>(null);
  const [lngDestination, setLngDestinnation] = useState<any>(null);

  // longdo key api
  const mapKey: string = "f065b431c7c8afab7264d32ca7a8a11e";

  // modal visible
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // open modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // ok modal
  const handleOk = () => {
    setIsModalVisible(false);
    setLoading(false);
  };

  // close modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // init map
  const initMap = async () => {
    map.Layers.setBase(longdo.Layers.GRAY);
    map.zoom(12);
    setMarkerUeserCurrentLocation();
    let res = await axios("http://localhost:4000/api/vaccine/");
    console.log(res.data)
    setMarker(res.data);
  };

  // init user current location
  const setMarkerUeserCurrentLocation = async () => {
    let userMarker: any = null;
    let location: any = await getCurrentLocation();

    userMarker = new longdo.Marker(
      { lon: location[1], lat: location[0] },
      {
        title: "My location",
        detail: "I'm here",
      }
    );
    map.Overlays.add(userMarker);
    map.location({ lon: location[1], lat: location[0] }, true);
  };

  // geocode fech address
  const mapLatLonToAddress = async (lat: number, lon: number) => {
    let res = await axios(
      `https://api.longdo.com/map/services/address?lon=${lon}&lat=${lat}&key=${mapKey}`
    );
    setCountry(res.data.country);
    setProvince(res.data.province);
    setGeocode(res.data.geocode);
    setDistrict(res.data.district);
    setSubdistrict(res.data.subdistrict);
    setPostcode(res.data.postcode);
    setElevation(res.data.elevation);
    setRoad(res.data.road);
    setAoi(res.data.aoi);
  };

  // set marker vaccine
  const setMarker = (data: typeVaccine[]) => {
    let vaccineList: any = [];
    data.forEach((item, index) => {
      vaccineList[index] = new longdo.Marker(
        { lon: item.long, lat: item.lat },
        {
          visibleRange: { min: 1, max: 30 },
          icon: {
            url: "https://map.longdo.com/mmmap/images/pin_mark.png",
            offset: { x: 12, y: 45 },
          },
        }
      );
      map.Overlays.add(vaccineList[index]);
      map.Event.bind("overlayClick", function (overlay: any) {
        if (overlay === vaccineList[index]) {
          setEmail(item.email);
          setVaccineName(item.name);
          setAmount(item.amount);
          setTel(item.tel);
          setLngDestinnation(item.long);
          setLatDestinnation(item.lat);
          setDescription(item.description);
          mapLatLonToAddress(item.lat, item.long);
          showModal();
        }
      });
    });
    
  };

  // route handler
  const routeHandler = async () => {
    setLoading(true);
    map.Route.clear();
    let location: any = await getCurrentLocation();
    let lat: number = location[0];
    let lng: number = location[1];
    map.Route.add(
      new longdo.Marker(
        { lon: lng, lat: lat },
        {
          title: "Victory monument",
          detail: "I'm here",
        }
      )
    );

    map.Route.add({ lon: lngDestination, lat: latDestination });
    map.Route.search();
    handleOk();
  };

  return (
    <div>
      <div style={{ height: "400px" }}>
        <LongdoMap id="longdo-map" mapKey={mapKey} callback={initMap} />
      </div>

      <RouteDetailsMap latDest={latDestination} lonDest={ lngDestination } map={map} longdo={longdo} />
       
      <Modal
        visible={isModalVisible}
        title="Vaccine Location"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="route"
            type="primary"
            loading={loading}
            onClick={routeHandler}
          >
            เส้นทาง
          </Button>,
        ]}
      >
        <h4 style={{ fontWeight: "bold" }}>Vaccine {vaccineName}</h4>
        <p>
          <span>
            Have {amount} dosage <br />
          </span>
          <span>
            Description {description} <br />
          </span>
        </p>

        <h4 style={{ fontWeight: "bold" }}>Address</h4>
        <address>
          {country ? (
            <span>
              Country {country} <br />
            </span>
          ) : null}

          {province ? (
            <span>
              Province {province} <br />
            </span>
          ) : null}

          {district ? (
            <span>
              District {district} <br />
            </span>
          ) : null}

          {subdistrict ? (
            <span>
              Subdistrict {subdistrict} <br />
            </span>
          ) : null}

          {road ? (
            <span>
              Road {road} <br />
            </span>
          ) : null}

          {aoi ? (
            <span>
              Aoi {aoi} <br />
            </span>
          ) : null}
        </address>

        <h4 style={{ fontWeight: "bold" }}>Contact</h4>
        <p>
          {email ? (
            <span>
              Email: {email} <br />
            </span>
          ) : null}
          {tel ? (
            <span>
              Tel: {tel} <br />
            </span>
          ) : null}
        </p>
      </Modal>
    </div>
  );
};

export default DisplayMap;
