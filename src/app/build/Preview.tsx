"use client";

import React, { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { CameraControls, Environment, useTexture } from "@react-three/drei";
import { asImageSrc } from "@prismicio/client";

import { Skateboard } from "@/slices/Hero/Skateboard";
import { useCustomizerControls } from "@/app/build/context";
import {
  DEFAULT_TRUCK_COLOR,
  DEFAULT_WHEEL_TEXTURE,
  DEFAULT_DECK_TEXTURE,
  DEFAULT_BOLT_COLOR,
  ENVIRONMENT_COLOR,
} from "@/constants";

type Props = {
  wheelTextureURls: string[];
  deckTextureURLs: string[];
};

const Preview = ({ wheelTextureURls, deckTextureURLs }: Props) => {
  const cameraControl = useRef<CameraControls>(null);
  const floorRef = useRef<THREE.Mesh>(null);
  const { selectedWheel, selectedBolt, selectedDeck, selectedTruck } =
    useCustomizerControls();

  const wheelTextureURL =
    asImageSrc(selectedWheel?.texture) ?? DEFAULT_WHEEL_TEXTURE;

  const deckTextureURL =
    asImageSrc(selectedDeck?.texture) ?? DEFAULT_DECK_TEXTURE;

  const truckColor = selectedTruck?.color ?? DEFAULT_TRUCK_COLOR;

  const boltColor = selectedBolt?.color ?? DEFAULT_BOLT_COLOR;

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(1.5, 0.8, 0)
    );
  }, [selectedDeck]);

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.12, 0.29, 0.57),
      new THREE.Vector3(0.1, 0.25, 0.9)
    );
  }, [selectedTruck]);

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.08, 0.54, 0.64),
      new THREE.Vector3(0.09, 1, 0.9)
    );
  }, [selectedWheel]);
  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.25, 0.3, 0.62),
      new THREE.Vector3(-0.5, 0.35, 0.8)
    );
  }, [selectedBolt]);

  function setCameraControls(target: THREE.Vector3, pos: THREE.Vector3) {
    if (!cameraControl.current) return;

    cameraControl.current.setTarget(target.x, target.y, target.x, true);
    cameraControl.current.setPosition(pos.x, pos.y, pos.z, true);
  }

  function onCameraControlStart() {
    if (
      !cameraControl.current ||
      !floorRef.current ||
      cameraControl.current.colliderMeshes.length > 0
    )
      return;

    cameraControl.current.colliderMeshes = [floorRef.current];
  }

  return (
    <Canvas shadows camera={{ position: [2.5, 1, 0], fov: 50 }}>
      <Suspense fallback={null}>
        <Environment
          files={"/hdr/warehouse-512.hdr"}
          environmentIntensity={0.6}
        />
        <directionalLight
          castShadow
          lookAt={[0, 0, 0]}
          position={[1, 1, 1]}
          intensity={1.6}
        />
        <fog attach="fog" args={[ENVIRONMENT_COLOR, 3, 10]} />
        <color attach="background" args={[ENVIRONMENT_COLOR]} />
        <StageFloor />
        <mesh rotation={[-Math.PI / 2, 0, 0]} ref={floorRef}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        <Skateboard
          deckTextureURLs={deckTextureURLs}
          deckTextureURL={deckTextureURL}
          wheelTextureURLs={wheelTextureURls}
          wheelTextureURL={wheelTextureURL}
          truckColor={truckColor}
          boltColor={boltColor}
          pose="side"
        />
        <CameraControls
          ref={cameraControl}
          minDistance={0.2}
          maxDistance={4}
          onStart={onCameraControlStart}
        />
      </Suspense>
    </Canvas>
  );
};

function StageFloor() {
  const normalMap = useTexture("/concrete-normal.avif");
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(30, 30);
  normalMap.anisotropy = 8;

  const material = new THREE.MeshStandardMaterial({
    roughness: 0.75,
    color: ENVIRONMENT_COLOR,
    normalMap: normalMap,
  });

  return (
    <mesh
      castShadow
      receiveShadow
      position={[0, -0.005, 0]}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <circleGeometry args={[20, 32]} />
    </mesh>
  );
}

export default Preview;
