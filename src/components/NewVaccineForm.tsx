import React, { useState, useRef } from "react";
import axios from "axios";
import { map, longdo, LondogMapNewVaccine } from "./LondogMapNewVaccine";
import { Button, Row, Col, Input, InputNumber, Form, Checkbox } from "antd";
import ListSearch from "./ListSearch";
import { typeNewVaccine } from "../dataType";
import { useHistory } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

const NewVaccineForm = () => {
  const mapKey: string = "f065b431c7c8afab7264d32ca7a8a11e";
  const { TextArea } = Input;
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  const addressRef = useRef<any>();
  const history = useHistory();

  // init map
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

  // sunmit form success
  const onFinish = async (values: any) => {
    const newVaccine: typeNewVaccine = {
      user_id: "1623ec45-6a6a-44c0-a577-e12439035818",
      name: values.vaccine,
      amount: Number(values.amount),
      email: "one@example.com",
      tel: "00000000",
      lat: lat,
      long: lon,
      description: values.description,
    };

    await axios.post(
      "http://localhost:4000/api/vaccine",
      JSON.stringify(newVaccine),
      { headers: { "Content-Type": "application/json" } }
    );
    history.push("/");
  };

  // submit form Faile
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
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

  return (
    <div>
      <div style={{ padding: "10px" }}>
        <Form
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 12 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Vaccine"
            name="vaccine"
            rules={[{ required: true, message: "Please input your vaccine!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please input your amount!" }]}
          >
            <InputNumber style={{ width: "100%"}} min={0} max={100000000} />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item label="Select Address" name="search">
            <div style={{ height: "250px" }}>
              <LondogMapNewVaccine
                id="longdo-map"
                mapKey={mapKey}
                callback={initMap}
              />
            </div>
            <Input
              size="large"
              prefix={<SearchOutlined />}
              onKeyUp={onKeyUpSeach.bind(this)}
              placeholder="search address"
              ref={addressRef}
            />
            <ListSearch selectItem={selectSearchItem} data={suggestions} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div style={{ height: "600px" }}></div>
    </div>
  );
};

export default NewVaccineForm;
