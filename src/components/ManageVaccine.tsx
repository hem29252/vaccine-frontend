import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal } from "antd";
import { DeleteTwoTone, ExclamationCircleOutlined } from "@ant-design/icons";
import EditVaccineForm from "./EditVaccineForm";
import { map, longdo, LongdoMapEdit } from "./LongdoMapEdit";
const ManageVaccine = () => {
  const mapKey: string = "f065b431c7c8afab7264d32ca7a8a11e";
  const [vaccine, setVaccine] = useState<object[]>([]);
  const columns = [
    {
      title: <h4 style={{ textAlign: "center" }}>Name</h4>,
      dataIndex: "name",
      align: "center" as "center",
      width: 100,
      key: 1,
    },
    {
      title: <h4 style={{ textAlign: "center" }}>Amount</h4>,
      dataIndex: "amount",
      align: "center" as "center",
      width: 100,
      key: 2,
    },
    {
      title: <h4 style={{ textAlign: "center" }}>Create At</h4>,
      dataIndex: "createAt",
      align: "center" as "center",
      width: 100,
      key: 3,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 100,
      align: "center" as "center",
    },
  ];

  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: "Continue Remove",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to remove this item?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: async () => {
        let res = await axios.delete(
          `http://localhost:4000/api/vaccine/${id}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        (window as any).location.reload();
      },
    });
  };

  const infoVaccine = async (item: any) => {
    let res = await axios(
      `https://api.longdo.com/map/services/address?lon=${item.long}&lat=${item.lat}&key=${mapKey}`
    );
    let address = res.data;
    Modal.info({
      title: <h4>{item.name}</h4>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            <span>Vaccine Name: {item.name} </span>
            <br />
            <span>Amount: {item.amount}</span>
            <br />
            <span>Description: {item.description}</span>
            <br />
            <span>Email: {item.email}</span>
            <br />
            <span>Tel: {item.tel}</span>
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>ที่อยู่</span>
            <br />
            <span>
              {address.road} {address.subdistrict} {address.district}{" "}
              {address.province} {address.country}{" "}
            </span>
            <br />
          </p>
        </div>
      ),
      okText: "Ok",
      cancelText: "Cancel",
    });
  };

  const editVaccine = async (body: any, id: any) => {
    let res = await axios.put(`http://localhost:4000/api/vaccine/${id}`, body, {
      headers: { "Content-Type": "application/json" },
    });
    (window as any).location.reload();
  };

  const getVaccine = async () => {
    let testUserId = "79803a03-c848-449f-a6a8-ce326c7d0669";
    let res = await axios(`http://localhost:4000/api/vaccine/${testUserId}`);
    let vaccineList: object[] = [];
    res.data.forEach((item: any, index: any) => {
      // init map
      const initMap = () => {
        map.Overlays.clear();
        map.Layers.setBase(longdo.Layers.GRAY);
        map.zoom(10);
        map.Overlays.add(new longdo.Marker({ lon: item.long, lat: item.lat }));
        map.location({ lon: item.long, lat: item.lat }, true);
      };

      let itemVaccine: object = {
        key: index,
        id: item.id,
        name: item.name,
        amount: item.amount,
        email: item.email,
        tel: item.tel,
        lat: item.lat,
        long: item.long,
        createAt: item.createAt,
        action: (
          <div>
            {/* button info */}
            <Button
              onClick={() => {
                infoVaccine(item);
              }}
              type="link"
              icon={
                <ExclamationCircleOutlined
                  twoToneColor="#FF0000"
                  style={{ fontSize: "30px" }}
                />
              }
            />

            {/*  button edit */}
            <EditVaccineForm editVaccineHandle={editVaccine} vaccine={item}>
              <LongdoMapEdit
                id={"longdo-map" + index}
                mapKey={mapKey}
                callback={initMap}
              />
            </EditVaccineForm>

            {/*  button delete */}
            <Button
              onClick={() => {
                confirmDelete(item.id);
              }}
              type="link"
              icon={
                <DeleteTwoTone
                  twoToneColor="#FF0000"
                  style={{ fontSize: "30px" }}
                />
              }
            />
          </div>
        ),
      };
      vaccineList = [...vaccineList, itemVaccine];
    });
    setVaccine(vaccineList);
  };

  useEffect(() => {
    getVaccine();
  }, [vaccine.length]);

  return (
    <div>
      <Table
        columns={columns}
        bordered={true}
        dataSource={vaccine}
        size="middle"
      />
    </div>
  );
};

export default ManageVaccine;
