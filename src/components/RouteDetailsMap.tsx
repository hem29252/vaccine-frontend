import React, { useState } from "react";
import { Modal, Button, Result } from "antd";
import { getCurrentLocation } from "../dataType";
import { CloseCircleOutlined } from '@ant-design/icons';

type Props = {
    map: any;
    longdo: any;
    latDest: number;
    lonDest: number;
}

const RouteDetailsMap = ({map, longdo, latDest, lonDest}:Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const  [inValidRoute, setInvalidRoute] = useState<boolean>(false)

  const showModal = async () => {
    let location:any = await getCurrentLocation();
    setIsModalVisible(true);
    console.log(latDest)
    if(latDest != null){
        setInvalidRoute(true)
        map.Route.placeholder(document.getElementById('manage-route'));
        map.Route.clear()
        map.Route.add(
            new longdo.Marker(
              { lon: location[1], lat: location[0] },
              {
                title: "Victory monument",
                detail: "I'm here",
              }
            )
          );
        map.Route.add({ lon: lonDest, lat: latDest });
        map.Route.search();
    }else{
        setInvalidRoute(false)
    }

  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const styles = {
      overflow: "auto",
      width: '100%',
      height: '280px',
  }

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        route details
      </Button>
      <Modal
        title="Route Detail"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
          
          { inValidRoute? (
              <div style={styles} id='manage-route'></div>
          ): (
            <Result
            icon={<CloseCircleOutlined />}
            title="Not found destination"
          />
          ) }
      </Modal>
    </div>
  );
};

export default RouteDetailsMap;
