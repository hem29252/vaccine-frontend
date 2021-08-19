import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Input, InputNumber, Form } from "antd";
import ListSearch from "./ListSearch";
import axios from "axios";
import { map, longdo } from "./LongdoMapEdit";
import "./EditVaccineForm.css";
import { EditTwoTone, SearchOutlined } from "@ant-design/icons";

type Props = {
  vaccine: any;
  children: any;
  editVaccineHandle: any;
};

const EditVaccineForm = ({ vaccine, editVaccineHandle, children }: Props) => {
  const mapKey: string = "f065b431c7c8afab7264d32ca7a8a11e";
  const { TextArea } = Input;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lat, setLat] = useState<number>(vaccine.lat);
  const [lon, setLon] = useState<number>(vaccine.long);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const addressRef = useRef<any>();
  const FormRef = useRef<any>();

  const setAddress = async () => {
    let res = await axios(
      `https://api.longdo.com/map/services/address?lon=${vaccine.long}&lat=${vaccine.lat}&key=${mapKey}`
    );
    let address:string = ''
    if(res.data.road) address+=` ${res.data.road}`
    if(res.data.subdistrict) address+=` ${res.data.subdistrict}`
    if(res.data.district) address+=` ${res.data.district}`
    if(res.data.province) address+=` ${res.data.province}`
    addressRef.current.state.value = address;
    setSuggestions([]);
  };
  
  const showModal = () => {
    setIsModalVisible(true);
    setAddress()
  };

  const handleOk = () => {
    setIsModalVisible(false);
    FormRef.current.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values: any) => {
    let newVaccine = {
      user_id: vaccine.user_id,
      name: values.vaccine,
      amount: values.amount,
      email: values.email,
      tel: values.tel,
      lat: lat,
      long: lon,
      description: values.description,
      createAt: vaccine.createAt,
    };
    editVaccineHandle(newVaccine, vaccine.id);
    setIsModalVisible(false);
  };

  // search address keyup
  const onKeyUpSeach = async (e: any) => {
    let res = await axios.get(
      `https://search.longdo.com/mapsearch/json/search?keyword=${e.target.value}&limit=100&key=${mapKey}`
    );
    setSuggestions(res.data.data);
  };

  const selectSearchItem = (item: any) => {
    setLat(item.lat);
    setLon(item.lon);
    map.Overlays.clear();
    map.Overlays.add(new longdo.Marker({ lon: item.lon, lat: item.lat }));
    map.zoom(10);
    map.location(
      { lon: item.lon, lat: item.lat },
      {
        title: "I am here",
      }
    );
    addressRef.current.state.value = item.name;
    setSuggestions([]);
  };

  return (
    <>
      <Button
        onClick={() => {
          showModal();
        }}
        type="link"
        icon={<EditTwoTone style={{ fontSize: "30px" }} />}
      />
      <Modal
        title="Edit Vaccine"
        visible={isModalVisible}
        okText="Save"
        onOk={handleOk}
        width={800}
        onCancel={handleCancel}
      >
        <Form
          ref={FormRef}
          name="EditVaccine"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            vaccine: vaccine.name,
            amount: vaccine.amount,
            description: vaccine.description,
            email: vaccine.email,
            tel: vaccine.tel,
          }}
        >
          <Form.Item
            label="Vaccine"
            name="vaccine"
            rules={[{ required: true, message: "Please input your vaccine!" }]}
          >
            <Input placeholder="Your vaccine name" />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please input your amount!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} max={100000000} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Your email" />
          </Form.Item>

          <Form.Item
            label="Tel"
            name="tel"
            rules={[{ required: true, message: "Please input your tel!" }]}
          >
            <Input placeholder="Your tel" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
          >
            <TextArea
              placeholder="Your description"
              rows={3}
              defaultValue={vaccine.description}
            />
          </Form.Item>

          <Form.Item label="Address" name="search">
            <Input
              prefix={<SearchOutlined />}
              size="large"
              placeholder="search address"
              onKeyUp={onKeyUpSeach}
              ref={addressRef}
            />
            <ListSearch selectItem={selectSearchItem} data={suggestions} />
            <div id="box-map" style={{ height: "15em", marginTop: "2px" }}>
              {children}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditVaccineForm;
