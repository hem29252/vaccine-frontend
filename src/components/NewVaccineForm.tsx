import React, { useState, useRef } from "react";
import axios from "axios";
import { map, longdo, LondogMapNewVaccine } from "./LondogMapNewVaccine";
import { Button, Row, Col, Input, InputNumber } from "antd";
import ListSearch from "./ListSearch";
import { typeNewVaccine } from "../dataType";
import { useHistory } from "react-router-dom";

const NewVaccineForm = () => {
  const mapKey: string = "f065b431c7c8afab7264d32ca7a8a11e";
  const { TextArea } = Input;
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  const vaccineNameRef = useRef<any>();
  const amountDosageRef = useRef<any>();
  const descriptionRef = useRef<any>();
  const addressRef = useRef<any>();
  const history = useHistory();

  // initial map
  const initMap = () => {
    map.Layers.setBase(longdo.Layers.GRAY);
    map.zoom(5);
  };

  // search address keyup
  const onKeyUpSeach = async (e: any) => {
    let res = await axios.get(
      `https://search.longdo.com/mapsearch/json/search?keyword=${e.target.value}&t=100&key=${mapKey}`
    );
    setSuggestions(res.data.data);
  };

  // select item address
  const selectSearchItem = (item: any) => {
    setLat(item.lat);
    setLon(item.lon);
    map.Overlays.clear();
    map.Overlays.add(new longdo.Marker({ lon: item.lon, lat: item.lat }));
    map.zoom(12);
    map.location(
      { lon: item.lon, lat: item.lat },
      {
        title: "I am here",
      }
    );
    addressRef.current.state.value = "";
    setSuggestions([]);
  };

  // add new vaccine handler
  const addNewVaccineHandler = async () => {
    const newVaccine: typeNewVaccine = {
      user_id: 1,
      name: vaccineNameRef.current.state.value,
      amount: Number(amountDosageRef.current.value),
      email: "one@example.com",
      tel: "00000000",
      lat: lat,
      long: lon,
      description: descriptionRef.current.resizableTextArea.props.value,
    };

    await axios.post(
      "http://localhost:3030/back-end/vaccine",
      JSON.stringify(newVaccine),
      { headers: { "Content-Type": "application/json" } }
    );
    history.push("/");
  };

  return (
    <div>
      <Row>
        <Col span={12} offset={6}>
          <Row>
            <Col span={24}>
              <h4 style={{ textAlign: "left" }}>Valccine name</h4>
              <Input ref={vaccineNameRef} />
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Col span={24}>
              <h4 style={{ textAlign: "left" }}>Amount dosage</h4>
              <InputNumber
                ref={amountDosageRef}
                min={1}
                max={10000000}
                defaultValue={1}
                style={{ float: "left", width: "100%" }}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Col span={24}>
              <h4 style={{ textAlign: "left" }}>Description</h4>
              <TextArea ref={descriptionRef} />
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Col span={24}>
              <h4 style={{ textAlign: "left" }}>Address</h4>
              <div style={{ height: "200px" }}>
                <LondogMapNewVaccine
                  id="longdo-map"
                  mapKey={mapKey}
                  callback={initMap}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                <Input
                  onKeyUp={onKeyUpSeach.bind(this)}
                  placeholder="search address"
                  ref={addressRef}
                />
                <ListSearch selectItem={selectSearchItem} data={suggestions} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Button type="primary" onClick={addNewVaccineHandler}>
                Add Vaccine
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <div style={{ height: "600px" }}></div>
    </div>
  );
};

export default NewVaccineForm;
