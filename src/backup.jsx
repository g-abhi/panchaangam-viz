// // /// v1 ///

// // // import React, { useRef, useState } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ------------------ DATA ------------------ */

// // // const SHUKLA_TITHIS = [
// // //     "Prathama (ప్రథమ)",
// // //     "Dvitiya (ద్వితీయ)",
// // //     "Tritiya (తృతీయ)",
// // //     "Chaturthi (చతుర్థి)",
// // //     "Panchami (పంచమి)",
// // //     "Shashthi (షష్ఠి)",
// // //     "Saptami (సప్తమి)",
// // //     "Ashtami (అష్టమి)",
// // //     "Navami (నవమి)",
// // //     "Dashami (దశమి)",
// // //     "Ekadashi (ఏకాదశి)",
// // //     "Dwadashi (ద్వాదశి)",
// // //     "Trayodashi (త్రయోదశి)",
// // //     "Chaturdashi (చతుర్దశి)",
// // //     "Pournami (పౌర్ణమి)",
// // // ];

// // // const KRISHNA_TITHIS = [
// // //     "Prathama (ప్రథమ)",
// // //     "Dvitiya (ద్వితీయ)",
// // //     "Tritiya (తృతీయ)",
// // //     "Chaturthi (చతుర్థి)",
// // //     "Panchami (పంచమి)",
// // //     "Shashthi (షష్ఠి)",
// // //     "Saptami (సప్తమి)",
// // //     "Ashtami (అష్టమి)",
// // //     "Navami (నవమి)",
// // //     "Dashami (దశమి)",
// // //     "Ekadashi (ఏకాదశి)",
// // //     "Dwadashi (ద్వాదశి)",
// // //     "Trayodashi (త్రయోదశి)",
// // //     "Chaturdashi (చతుర్దశి)",
// // //     "Amavasya (అమావాస్య)",
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini (అశ్విని)", "Bharani (భరణి)", "Krittika (కృత్తిక)",
// // //     "Rohini (రోహిణి)", "Mrigashira (మృగశిర)", "Ardra (ఆర్ద్ర)",
// // //     "Punarvasu (పునర్వసు)", "Pushya (పుష్య)", "Ashlesha (ఆశ్లేష)",
// // //     "Magha (మఘ)", "Purva Phalguni (పూర్వ ఫల్గుణి)",
// // //     "Uttara Phalguni (ఉత్తర ఫల్గుణి)", "Hasta (హస్త)",
// // //     "Chitra (చిత్ర)", "Swati (స్వాతి)", "Vishakha (విశాఖ)",
// // //     "Anuradha (అనురాధ)", "Jyeshtha (జ్యేష్ఠ)", "Mula (మూల)",
// // //     "Purva Ashadha (పూర్వాషాఢ)", "Uttara Ashadha (ఉత్తరాషాఢ)",
// // //     "Shravana (శ్రవణ)", "Dhanishta (ధనిష్ఠ)",
// // //     "Shatabhisha (శతభిష)", "Purva Bhadrapada (పూర్వాభాద్ర)",
// // //     "Uttara Bhadrapada (ఉత్తరాభాద్ర)", "Revati (రేవతి)",
// // // ];

// // // /* ------------------ SOLAR SYSTEM ------------------ */

// // // function SolarSystem({ onUpdate, speed }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     useFrame(({ clock }) => {
// // //         const t = clock.getElapsedTime() * speed;

// // //         earthOrbit.current.rotation.y = t * 0.15;
// // //         earth.current.rotation.y = t;
// // //         moonOrbit.current.rotation.y = t * 0.6;

// // //         const sunPos = new THREE.Vector3(0, 0, 0);
// // //         const earthPos = new THREE.Vector3();
// // //         const moonPos = new THREE.Vector3();

// // //         earth.current.getWorldPosition(earthPos);
// // //         moon.current.getWorldPosition(moonPos);

// // //         /* ---------- LIGHTING ---------- */

// // //         const sunToMoon = moonPos.clone().sub(sunPos).normalize();
// // //         sunLight.current.position.copy(
// // //             sunPos.clone().sub(sunToMoon.multiplyScalar(20))
// // //         );
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();

// // //         /* ---------- TITHI ANGLE ---------- */

// // //         const sunVec = sunPos.clone().sub(earthPos).normalize();
// // //         const moonVec = moonPos.clone().sub(earthPos).normalize();

// // //         let angleDeg = THREE.MathUtils.radToDeg(
// // //             sunVec.angleTo(moonVec)
// // //         );

// // //         const cross = new THREE.Vector3().crossVectors(sunVec, moonVec);
// // //         if (cross.y < 0) angleDeg = 360 - angleDeg;

// // //         const a = angleDeg % 360;

// // //         const tithiIndex = Math.floor(a / 12);

// // //         let tithi, paksha;

// // //         if (tithiIndex < 15) {
// // //             paksha = "Shukla Paksha (శుక్ల పక్షం)";
// // //             tithi = SHUKLA_TITHIS[tithiIndex];
// // //         } else {
// // //             paksha = "Krishna Paksha (కృష్ణ పక్షం)";
// // //             tithi = KRISHNA_TITHIS[tithiIndex - 15];
// // //         }

// // //         /* ---------- NAKSHATRA (FIXED, ORDER CORRECT) ---------- */

// // //         const moonRel = moonPos.clone().sub(earthPos);

// // //         let moonLongitude = THREE.MathUtils.radToDeg(
// // //             Math.atan2(moonRel.z, moonRel.x)
// // //         );

// // //         // Reverse direction to match Ashwini → Bharani → Krittika
// // //         moonLongitude = (360 - moonLongitude + 360) % 360;

// // //         const nakshatraIndex = Math.floor(
// // //             moonLongitude / (360 / 27)
// // //         );


// // //         onUpdate({
// // //             angle: angleDeg.toFixed(1),
// // //             tithi,
// // //             paksha,
// // //             nakshatra: NAKSHATRAS[nakshatraIndex],
// // //         });
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.05} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#d9d9d9" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>
// // //         </>
// // //     );
// // // }

// // // /* ------------------ MAIN ------------------ */

// // // export default function PanchaangamExplorer() {
// // //     const [data, setData] = useState({});
// // //     const [speed, setSpeed] = useState(1);

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem onUpdate={setData} speed={speed} />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             <div
// // //                 style={{
// // //                     position: "absolute",
// // //                     top: 16,
// // //                     left: 16,
// // //                     color: "white",
// // //                     background: "rgba(0,0,0,0.6)",
// // //                     padding: 14,
// // //                     borderRadius: 8,
// // //                 }}
// // //             >
// // //                 <div><b>Tithi:</b> {data.tithi}</div>
// // //                 <div><b>Paksha:</b> {data.paksha}</div>
// // //                 <div><b>Nakshatra:</b> {data.nakshatra}</div>
// // //                 <div><b>Angle:</b> {data.angle}°</div>

// // //                 <hr />

// // //                 Speed: {speed.toFixed(1)}
// // //                 <input
// // //                     type="range"
// // //                     min="0.2"
// // //                     max="3"
// // //                     step="0.1"
// // //                     value={speed}
// // //                     onChange={(e) => setSpeed(+e.target.value)}
// // //                 />
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // /// v1.1 ///


// // // import React, { useRef, useState, useEffect } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ------------------ DATA ------------------ */

// // // const SHUKLA_TITHIS = [
// // //     "Prathama (ప్రథమ)", "Dvitiya (ద్వితీయ)", "Tritiya (తృతీయ)", "Chaturthi (చతుర్థి)",
// // //     "Panchami (పంచమి)", "Shashthi (షష్ఠి)", "Saptami (సప్తమి)", "Ashtami (అష్టమి)",
// // //     "Navami (నవమి)", "Dashami (దశమి)", "Ekadashi (ఏకాదశి)", "Dwadashi (ద్వాదశి)",
// // //     "Trayodashi (త్రయోదశి)", "Chaturdashi (చతుర్దశి)", "Pournami (పౌర్ణమి)"
// // // ];

// // // const KRISHNA_TITHIS = [
// // //     "Prathama (ప్రథమ)", "Dvitiya (ద్వితీయ)", "Tritiya (తృతీయ)", "Chaturthi (చతుర్థి)",
// // //     "Panchami (పంచమి)", "Shashthi (షష్ఠి)", "Saptami (సప్తమి)", "Ashtami (అష్టమి)",
// // //     "Navami (నవమి)", "Dashami (దశమి)", "Ekadashi (ఏకాదశి)", "Dwadashi (ద్వాదశి)",
// // //     "Trayodashi (త్రయోదశి)", "Chaturdashi (చతుర్దశి)", "Amavasya (అమావాస్య)"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini (అశ్విని)", "Bharani (భరణి)", "Krittika (కృత్తిక)",
// // //     "Rohini (రోహిణి)", "Mrigashira (మృగశిర)", "Ardra (ఆర్ద్ర)",
// // //     "Punarvasu (పునర్వసు)", "Pushya (పుష్య)", "Ashlesha (ఆశ్లేష)",
// // //     "Magha (మఘ)", "Purva Phalguni (పూర్వ ఫల్గుణి)", "Uttara Phalguni (ఉత్తర ఫల్గుణి)",
// // //     "Hasta (హస్త)", "Chitra (చిత్ర)", "Swati (స్వాతి)", "Vishakha (విశాఖ)",
// // //     "Anuradha (అనురాధ)", "Jyeshtha (జ్యేష్ఠ)", "Mula (మూల)",
// // //     "Purva Ashadha (పూర్వాషాఢ)", "Uttara Ashadha (ఉత్తరాషాఢ)", "Shravana (శ్రవణ)",
// // //     "Dhanishta (ధనిష్ఠ)", "Shatabhisha (శతభిష)", "Purva Bhadrapada (పూర్వాభాద్ర)",
// // //     "Uttara Bhadrapada (ఉత్తరాభాద్ర)", "Revati (రేవతి)"
// // // ];

// // // /* ------------------ YOUR ORIGINAL SOLAR SYSTEM + WHEEL ------------------ */

// // // function SolarSystem({ onUpdate, speed }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();
// // //     const nakshatraWheel = useRef();

// // //     const wheelSegments = useRef([]);
// // //     const labels = useRef([]);

// // //     useEffect(() => {
// // //         const wheel = nakshatraWheel.current;
// // //         if (!wheel) return;

// // //         const angleStep = (Math.PI * 2) / 27;
// // //         const R = 11; // Same plane as orbits

// // //         for (let i = 0; i < 27; i++) {
// // //             // Thin ring segments
// // //             const geo = new THREE.RingGeometry(R - 0.3, R + 0.3, 32, 1, i * angleStep, angleStep);
// // //             const mat = new THREE.MeshBasicMaterial({
// // //                 color: 0x2a2a4a,
// // //                 transparent: true,
// // //                 opacity: 0.8,
// // //                 side: THREE.DoubleSide
// // //             });
// // //             const seg = new THREE.Mesh(geo, mat);
// // //             seg.rotation.x = -Math.PI / 2;
// // //             wheel.add(seg);
// // //             wheelSegments.current[i] = seg;

// // //             // Labels
// // //             const canvas = document.createElement('canvas');
// // //             canvas.width = 256;
// // //             canvas.height = 64;
// // //             const ctx = canvas.getContext('2d');
// // //             ctx.fillStyle = '#ffffff';
// // //             ctx.strokeStyle = '#000';
// // //             ctx.lineWidth = 1;
// // //             ctx.font = 'bold 16px Arial';
// // //             ctx.textAlign = 'center';
// // //             ctx.textBaseline = 'middle';
// // //             ctx.strokeText(NAKSHATRAS[i], 128, 32);
// // //             ctx.fillText(NAKSHATRAS[i], 128, 32);

// // //             const texture = new THREE.CanvasTexture(canvas);
// // //             const labelGeo = new THREE.PlaneGeometry(0.9, 0.22);
// // //             const labelMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
// // //             const label = new THREE.Mesh(labelGeo, labelMat);
// // //             const labelAngle = i * angleStep;
// // //             label.position.set(Math.cos(labelAngle) * (R + 1.2), 0.2, Math.sin(labelAngle) * (R + 1.2));
// // //             label.lookAt(0, 0.2, 0);
// // //             wheel.add(label);
// // //             labels.current[i] = label;
// // //         }
// // //     }, []);

// // //     useFrame(({ clock }) => {
// // //         const t = clock.getElapsedTime() * speed;

// // //         // YOUR ORIGINAL ANIMATIONS - EXACTLY
// // //         earthOrbit.current.rotation.y = t * 0.15;
// // //         earth.current.rotation.y = t;
// // //         moonOrbit.current.rotation.y = t * 0.6;

// // //         // Positions
// // //         const sunPos = new THREE.Vector3(0, 0, 0);
// // //         const earthPos = new THREE.Vector3();
// // //         const moonPos = new THREE.Vector3();
// // //         earth.current.getWorldPosition(earthPos);
// // //         moon.current.getWorldPosition(moonPos);

// // //         // YOUR ORIGINAL LIGHTING
// // //         const sunToMoon = moonPos.clone().sub(sunPos).normalize();
// // //         sunLight.current.position.copy(sunPos.clone().sub(sunToMoon.multiplyScalar(20)));
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();

// // //         // YOUR ORIGINAL TITHI - PERFECT
// // //         const sunVec = sunPos.clone().sub(earthPos).normalize();
// // //         const moonVec = moonPos.clone().sub(earthPos).normalize();
// // //         let angleDeg = THREE.MathUtils.radToDeg(sunVec.angleTo(moonVec));
// // //         const cross = new THREE.Vector3().crossVectors(sunVec, moonVec);
// // //         if (cross.y < 0) angleDeg = 360 - angleDeg;
// // //         const a = angleDeg % 360;
// // //         const tithiIndex = Math.floor(a / 12);

// // //         let tithi, paksha;
// // //         if (tithiIndex < 15) {
// // //             paksha = "Shukla Paksha (శుక్ల పక్షం)";
// // //             tithi = SHUKLA_TITHIS[tithiIndex];
// // //         } else {
// // //             paksha = "Krishna Paksha (కృష్ణ పక్షం)";
// // //             tithi = KRISHNA_TITHIS[tithiIndex - 15];
// // //         }

// // //         // YOUR ORIGINAL NAKSHATRA CALC - PERFECT
// // //         const moonRel = moonPos.clone().sub(earthPos);
// // //         let moonLongitude = THREE.MathUtils.radToDeg(Math.atan2(moonRel.z, moonRel.x));
// // //         moonLongitude = (360 - moonLongitude + 360) % 360;
// // //         const nakshatraIndex = Math.floor(moonLongitude / (360 / 27));

// // //         // WHEEL ROTATION = EXACT OPPOSITE OF MOON (counter-clockwise sync)
// // //         if (nakshatraWheel.current) {
// // //             nakshatraWheel.current.rotation.y = -(moonLongitude * Math.PI / 180);
// // //         }

// // //         // HIGHLIGHT
// // //         wheelSegments.current.forEach((seg, i) => {
// // //             if (seg) {
// // //                 seg.material.color.setHex(i === nakshatraIndex ? 0x00ff88 : 0x2a2a4a);
// // //                 seg.material.opacity = i === nakshatraIndex ? 1 : 0.7;
// // //             }
// // //         });
// // //         labels.current.forEach((lbl, i) => {
// // //             if (lbl) lbl.material.color.setHex(i === nakshatraIndex ? 0xffff00 : 0xffffff);
// // //         });

// // //         onUpdate({
// // //             angle: angleDeg.toFixed(1),
// // //             tithi,
// // //             paksha,
// // //             nakshatra: NAKSHATRAS[nakshatraIndex],
// // //         });
// // //     });

// // //     return (
// // //         <>
// // //             {/* SUN */}
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.05} />

// // //             {/* EARTH ORBIT - YOUR ORIGINAL */}
// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 {/* MOON ORBIT - YOUR ORIGINAL */}
// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#d9d9d9" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             {/* NAKSHATRA WHEEL - SAME PLANE */}
// // //             <group ref={nakshatraWheel} position={[0, 0, 0]}>
// // //                 {/* Segments created in useEffect */}
// // //             </group>

// // //             <Grid args={[25, 25]} position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}
// // //                 sectionColor="#222244" cellColor="#444466" fadeDistance={20} />
// // //         </>
// // //     );
// // // }

// // // export default function PanchaangamExplorer() {
// // //     const [data, setData] = useState({});
// // //     const [speed, setSpeed] = useState(1);

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem onUpdate={setData} speed={speed} />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             <div style={{
// // //                 position: "absolute", top: 16, left: 16, color: "white",
// // //                 background: "rgba(0,0,0,0.8)", padding: 16, borderRadius: 12
// // //             }}>
// // //                 <div><b>Tithi:</b> {data.tithi || "Loading..."}</div>
// // //                 <div><b>Paksha:</b> {data.paksha || "Loading..."}</div>
// // //                 <div><b>Nakshatra:</b> <span style={{ color: "#00ff88" }}>{data.nakshatra || "Loading..."}</span></div>
// // //                 <div><b>Angle:</b> {data.angle || 0}°</div>

// // //                 <hr style={{ margin: "12px 0" }} />

// // //                 <div>Speed: {speed.toFixed(1)}x
// // //                     <input type="range" min="0.2" max="3" step="0.1"
// // //                         value={speed} onChange={e => setSpeed(+e.target.value)}
// // //                         style={{ width: "100%", marginTop: 8 }} />
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }


// // // /// v1.2 ///

// // // import React, { useRef, useState, useEffect } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ------------------ DATA ------------------ */

// // // const SHUKLA_TITHIS = [
// // //     "Prathama (ప్రథమ)", "Dvitiya (ద్వితీయ)", "Tritiya (తృతీయ)", "Chaturthi (చతుర్థి)",
// // //     "Panchami (పంచమి)", "Shashthi (షష్ఠి)", "Saptami (సప్తమి)", "Ashtami (అష్టమి)",
// // //     "Navami (నవమి)", "Dashami (దశమి)", "Ekadashi (ఏకాదశి)", "Dwadashi (ద్వాదశి)",
// // //     "Trayodashi (త్రయోదశి)", "Chaturdashi (చతుర్దశి)", "Pournami (పౌర్ణమి)"
// // // ];

// // // const KRISHNA_TITHIS = [
// // //     "Prathama (ప్రథమ)", "Dvitiya (ద్వితీయ)", "Tritiya (తృతీయ)", "Chaturthi (చతుర్థి)",
// // //     "Panchami (పంచమి)", "Shashthi (షష్ఠి)", "Saptami (సప్తమి)", "Ashtami (అష్టమి)",
// // //     "Navami (నవమి)", "Dashami (దశమి)", "Ekadashi (ఏకాదశి)", "Dwadashi (ద్వాదశి)",
// // //     "Trayodashi (త్రయోదశి)", "Chaturdashi (చతుర్దశి)", "Amavasya (అమావాస్య)"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini (అశ్విని)", "Bharani (భరణి)", "Krittika (కృత్తిక)",
// // //     "Rohini (రోహిణి)", "Mrigashira (మృగశిర)", "Ardra (ఆర్ద్ర)",
// // //     "Punarvasu (పునర్వసు)", "Pushya (పుష్య)", "Ashlesha (ఆశ్లేష)",
// // //     "Magha (మఘ)", "Purva Phalguni (పూర్వ ఫల్గుణి)", "Uttara Phalguni (ఉత్తర ఫల్గుణి)",
// // //     "Hasta (హస్త)", "Chitra (చిత్ర)", "Swati (స్వాతి)", "Vishakha (విశాఖ)",
// // //     "Anuradha (అనురాధ)", "Jyeshtha (జ్యేష్ఠ)", "Mula (మూల)",
// // //     "Purva Ashadha (పూర్వాషాఢ)", "Uttara Ashadha (ఉత్తరాషాఢ)", "Shravana (శ్రవణ)",
// // //     "Dhanishta (ధనిష్ఠ)", "Shatabhisha (శతభిష)", "Purva Bhadrapada (పూర్వాభాద్ర)",
// // //     "Uttara Bhadrapada (ఉత్తరాభాద్ర)", "Revati (రేవతి)"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "చైత్రము", "వైశాఖము", "జ్యేష్ఠము", "ఆషాఢము", "శ్రావణము", "భాద్రపదము",
// // //     "ఆశ్వయుజము", "కార్తీకము", "మార్గశిరము", "పుష్యము", "మాఘము", "ఫాల్గుణము"
// // // ];

// // // /* ------------------ SOLAR SYSTEM ------------------ */

// // // function SolarSystem({ onUpdate, speed, isPaused }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();
// // //     const lunarWheel = useRef();
// // //     const timeRef = useRef(0);

// // //     const wheelSegments = useRef([]);
// // //     const labels = useRef([]);

// // //     // Lunar month tracking with precise Amavasya detection
// // //     const maasamIndexRef = useRef({ index: 0, hasAdvanced: false });

// // //     useEffect(() => {
// // //         const wheel = lunarWheel.current;
// // //         if (!wheel) return;

// // //         const N_MONTHS = 12;
// // //         const angleStep = (Math.PI * 2) / N_MONTHS;
// // //         const R = 11;

// // //         for (let i = 0; i < N_MONTHS; i++) {
// // //             const geo = new THREE.RingGeometry(R - 0.4, R + 0.4, 32, 1, i * angleStep, angleStep);
// // //             const mat = new THREE.MeshBasicMaterial({
// // //                 color: 0x2a2a4a,
// // //                 transparent: true,
// // //                 opacity: 0.8,
// // //                 side: THREE.DoubleSide
// // //             });
// // //             const seg = new THREE.Mesh(geo, mat);
// // //             seg.rotation.x = -Math.PI / 2;
// // //             wheel.add(seg);
// // //             wheelSegments.current[i] = seg;

// // //             const canvas = document.createElement('canvas');
// // //             canvas.width = 200;
// // //             canvas.height = 60;
// // //             const ctx = canvas.getContext('2d');
// // //             ctx.fillStyle = '#ffffff';
// // //             ctx.strokeStyle = '#333';
// // //             ctx.lineWidth = 1;
// // //             ctx.font = 'bold 20px Arial Unicode MS, sans-serif';
// // //             ctx.textAlign = 'center';
// // //             ctx.textBaseline = 'middle';
// // //             ctx.strokeText(AMANTA_MAASAMS[i], 100, 30);
// // //             ctx.fillText(AMANTA_MAASAMS[i], 100, 30);

// // //             const texture = new THREE.CanvasTexture(canvas);
// // //             const labelGeo = new THREE.PlaneGeometry(1.0, 0.25);
// // //             const labelMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
// // //             const label = new THREE.Mesh(labelGeo, labelMat);
// // //             const labelAngle = i * angleStep;
// // //             label.position.set(
// // //                 Math.cos(labelAngle) * (R + 1.3),
// // //                 0.2,
// // //                 Math.sin(labelAngle) * (R + 1.3)
// // //             );
// // //             label.lookAt(0, 0.2, 0);
// // //             wheel.add(label);
// // //             labels.current[i] = label;
// // //         }
// // //     }, []);

// // //     useFrame(({ clock }) => {
// // //         if (isPaused) return;

// // //         const elapsed = clock.getElapsedTime() * speed;
// // //         timeRef.current = elapsed;

// // //         earthOrbit.current.rotation.y = elapsed * 0.15;
// // //         earth.current.rotation.y = elapsed;
// // //         moonOrbit.current.rotation.y = elapsed * 0.6;

// // //         const sunPos = new THREE.Vector3(0, 0, 0);
// // //         const earthPos = new THREE.Vector3();
// // //         const moonPos = new THREE.Vector3();
// // //         earth.current.getWorldPosition(earthPos);
// // //         moon.current.getWorldPosition(moonPos);

// // //         const sunToMoon = moonPos.clone().sub(sunPos).normalize();
// // //         sunLight.current.position.copy(sunPos.clone().sub(sunToMoon.multiplyScalar(20)));
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();

// // //         /* --------- TITHI --------- */
// // //         const sunVec = sunPos.clone().sub(earthPos).normalize();
// // //         const moonVec = moonPos.clone().sub(earthPos).normalize();

// // //         let angleDeg = THREE.MathUtils.radToDeg(sunVec.angleTo(moonVec));
// // //         const cross = new THREE.Vector3().crossVectors(sunVec, moonVec);
// // //         if (cross.y < 0) angleDeg = 360 - angleDeg;

// // //         let tithiIndex = Math.floor(angleDeg / 12);
// // //         let paksha, tithi;
// // //         if (angleDeg < 180) {
// // //             paksha = "Shukla Paksha (శుక్ల పక్షం)";
// // //             tithi = SHUKLA_TITHIS[tithiIndex];
// // //         } else {
// // //             paksha = "Krishna Paksha (కృష్ణ పక్షం)";
// // //             tithiIndex -= 15;
// // //             tithi = KRISHNA_TITHIS[tithiIndex];
// // //         }

// // //         /* --------- LUNAR MONTH (AMANTA) --------- */
// // //         const isAmavasya = paksha === "Krishna Paksha (కృష్ణ పక్షం)" && tithiIndex === 14;
// // //         if (isAmavasya && !maasamIndexRef.current.hasAdvanced) {
// // //             maasamIndexRef.current.index = (maasamIndexRef.current.index + 1) % 12;
// // //             maasamIndexRef.current.hasAdvanced = true;
// // //         } else if (!isAmavasya) {
// // //             maasamIndexRef.current.hasAdvanced = false;
// // //         }
// // //         const maasamIndex = maasamIndexRef.current.index;

// // //         /* --------- MOON LONGITUDE & NAKSHATRA --------- */
// // //         const moonRel = moonPos.clone().sub(earthPos);
// // //         let moonLongitude = THREE.MathUtils.radToDeg(Math.atan2(moonRel.z, moonRel.x));
// // //         moonLongitude = (360 - moonLongitude + 360) % 360;
// // //         const nakshatraIndex = Math.floor(moonLongitude / (360 / 27));

// // //         /* --------- LUNAR WHEEL --------- */
// // //         const earthOrbitAngle = (elapsed * 0.15 * 180 / Math.PI + 360) % 360;
// // //         if (lunarWheel.current) lunarWheel.current.rotation.y = -(earthOrbitAngle * Math.PI / 180);

// // //         // Highlight lunar month
// // //         wheelSegments.current.forEach((seg, i) => {
// // //             if (seg) {
// // //                 seg.material.color.setHex(i === maasamIndex ? 0xffaa00 : 0x2a2a4a);
// // //                 seg.material.opacity = i === maasamIndex ? 1 : 0.7;
// // //                 seg.scale.setScalar(i === maasamIndex ? 1.08 : 1);
// // //             }
// // //         });

// // //         // Highlight nakshatra
// // //         labels.current.forEach((lbl, i) => {
// // //             lbl.material.color.setHex(i === nakshatraIndex ? 0xffdd88 : (i === maasamIndex ? 0xffffff : 0xcccccc));
// // //         });

// // //         onUpdate({
// // //             angle: angleDeg.toFixed(1),
// // //             tithi,
// // //             paksha,
// // //             nakshatra: NAKSHATRAS[nakshatraIndex],
// // //             maasam: AMANTA_MAASAMS[maasamIndex],
// // //             sunLong: earthOrbitAngle.toFixed(1),
// // //             isAmavasya: isAmavasya ? "Yes" : "",
// // //         });
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.05} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>
// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#d9d9d9" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <group ref={lunarWheel} position={[0, 0, 0]} />

// // //             <Grid args={[25, 25]} position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}
// // //                 sectionColor="#222244" cellColor="#444466" fadeDistance={20} />
// // //         </>
// // //     );
// // // }

// // // /* ------------------ MAIN COMPONENT ------------------ */

// // // export default function PanchaangamExplorer() {
// // //     const [data, setData] = useState({});
// // //     const [speed, setSpeed] = useState(1);
// // //     const [isPaused, setIsPaused] = useState(false);

// // //     const togglePause = () => setIsPaused(!isPaused);

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem onUpdate={setData} speed={speed} isPaused={isPaused} />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             <div style={{
// // //                 position: "absolute", top: 16, left: 16, color: "white",
// // //                 background: "rgba(0,0,0,0.9)", padding: 24, borderRadius: 16,
// // //                 backdropFilter: "blur(15px)", minWidth: 320, boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
// // //             }}>
// // //                 <div style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 16 }}>
// // //                     <div><b>🌙 Tithi:</b> <span style={{ color: "#ffdd88" }}>{data.tithi || "..."}</span></div>
// // //                     <div><b>📿 Paksha:</b> {data.paksha || "..."}</div>
// // //                     <div><b>⭐ Nakshatra:</b> {data.nakshatra || "..."}</div>
// // //                     <div style={{
// // //                         color: "#ffaa00", fontWeight: "bold",
// // //                         background: "rgba(255,170,0,0.15)", padding: "8px 14px",
// // //                         borderRadius: 8, margin: "8px 0"
// // //                     }}>
// // //                         <b>🌑 Amanta Maasam:</b> <span style={{ fontSize: 16 }}>{data.maasam || "..."}</span>
// // //                     </div>
// // //                     <div style={{ fontSize: 13, color: "#aaa" }}>
// // //                         ☀️ Sun Long: <span style={{ color: "#ffaa00" }}>{data.sunLong || 0}°</span> |
// // //                         Angle: <span style={{ color: "#fff" }}>{data.angle || 0}°</span>
// // //                         {data.isAmavasya && <span style={{ color: "#ff4444", marginLeft: 8 }}>🔴 Amavasya</span>}
// // //                     </div>
// // //                 </div>

// // //                 <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
// // //                     <button
// // //                         onClick={togglePause}
// // //                         style={{
// // //                             flex: 1,
// // //                             padding: "12px 20px",
// // //                             background: isPaused ? "#00ff88" : "#ff4444",
// // //                             color: "white",
// // //                             border: "none",
// // //                             borderRadius: 10,
// // //                             fontWeight: "bold",
// // //                             fontSize: 14,
// // //                             cursor: "pointer",
// // //                             boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
// // //                             transition: "all 0.2s"
// // //                         }}
// // //                         onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
// // //                         onMouseOut={(e) => e.target.style.transform = "scale(1)"}
// // //                     >
// // //                         {isPaused ? "▶️ Resume" : "⏸️ Pause"}
// // //                     </button>

// // //                     <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
// // //                         <span style={{ fontSize: 13, color: "#aaa", minWidth: 40 }}>Speed</span>
// // //                         <input
// // //                             type="range"
// // //                             min="0.1" max="5" step="0.1"
// // //                             value={speed}
// // //                             onChange={e => setSpeed(+e.target.value)}
// // //                             style={{ flex: 1, height: 6, borderRadius: 3, background: "#333" }}
// // //                             disabled={isPaused}
// // //                         />
// // //                         <span style={{ fontSize: 13, color: "#fff", minWidth: 30, textAlign: "right" }}>
// // //                             {speed.toFixed(1)}x
// // //                         </span>
// // //                     </div>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }


// // // ///// v1.3 /////


// // // import React, { useRef, useState } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const baseJD = useRef(toJD(Date.now()));

// // //     useFrame(({ clock }) => {
// // //         if (paused) return;

// // //         const elapsed = clock.getElapsedTime() * speed;
// // //         const simJD = baseJD.current + elapsed / (2 * Math.PI);

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);

// // //         /* 🔑 ELONGATION — SINGLE SOURCE OF TRUTH */
// // //         const elongation = norm(moonL - sun);

// // //         /* ---------- VISUAL GEOMETRY ---------- */

// // //         // Sun direction (Earth orbit)
// // //         earthOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(sun);

// // //         // Earth spin
// // //         earth.current.rotation.y = elapsed;

// // //         // Moon position driven by elongation
// // //         moonOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(elongation);

// // //         /* ---------- LIGHTING ---------- */

// // //         const earthPos = new THREE.Vector3();
// // //         const moonPos = new THREE.Vector3();

// // //         earth.current.getWorldPosition(earthPos);
// // //         moon.current.getWorldPosition(moonPos);

// // //         const lightDir = moonPos.clone().normalize();
// // //         sunLight.current.position.copy(
// // //             lightDir.multiplyScalar(-20)
// // //         );
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();

// // //         /* ---------- TITHI ---------- */

// // //         const tithiIndex = Math.floor(elongation / 12);

// // //         let paksha, tithi;
// // //         if (elongation < 180) {
// // //             paksha = "Shukla Paksha";
// // //             tithi = SHUKLA[tithiIndex];
// // //         } else {
// // //             paksha = "Krishna Paksha";
// // //             tithi = KRISHNA[tithiIndex - 15];
// // //         }

// // //         /* ---------- NAKSHATRA ---------- */

// // //         const nak = NAKSHATRAS[
// // //             Math.floor(moonL / (360 / 27))
// // //         ];

// // //         /* ---------- ENGLISH DATE ---------- */

// // //         const gregorian = new Date(
// // //             (simJD - 2440587.5) * 86400000
// // //         );

// // //         onUpdate({
// // //             tithi,
// // //             paksha,
// // //             nakshatra: nak,
// // //             date: gregorian.toUTCString(),
// // //             elongation: elongation.toFixed(2)
// // //         });
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.05} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <Grid
// // //                 args={[25, 25]}
// // //                 position={[0, -0.01, 0]}
// // //                 rotation={[-Math.PI / 2, 0, 0]}
// // //             />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});
// // //     const [speed, setSpeed] = useState(1);
// // //     const [paused, setPaused] = useState(false);

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem
// // //                     speed={speed}
// // //                     paused={paused}
// // //                     onUpdate={setData}
// // //                 />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             <div style={{
// // //                 position: "absolute",
// // //                 top: 16,
// // //                 left: 16,
// // //                 color: "white",
// // //                 background: "rgba(0,0,0,0.85)",
// // //                 padding: 20,
// // //                 borderRadius: 14,
// // //                 width: 360
// // //             }}>
// // //                 <div><b>📅 Date:</b> {data.date}</div>
// // //                 <div><b>🌙 Tithi:</b> {data.tithi}</div>
// // //                 <div><b>📿 Paksha:</b> {data.paksha}</div>
// // //                 <div><b>⭐ Nakshatra:</b> {data.nakshatra}</div>
// // //                 <div><b>📐 Elongation:</b> {data.elongation}°</div>

// // //                 <button onClick={() => setPaused(!paused)}>
// // //                     {paused ? "▶ Resume" : "⏸ Pause"}
// // //                 </button>

// // //                 <input
// // //                     type="range"
// // //                     min="0.1"
// // //                     max="5"
// // //                     step="0.1"
// // //                     value={speed}
// // //                     onChange={e => setSpeed(+e.target.value)}
// // //                     style={{ width: "100%" }}
// // //                 />
// // //             </div>
// // //         </div>
// // //     );
// // // }



// // // ///// v1.4 /////

// // // import React, { useRef, useState } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const baseJD = useRef(toJD(Date.now()));

// // //     useFrame(({ clock }) => {
// // //         if (paused) return;

// // //         const elapsed = clock.getElapsedTime() * speed;
// // //         const simJD = baseJD.current + elapsed / (2 * Math.PI);

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);

// // //         /* 🔑 ELONGATION */
// // //         const elongation = norm(moonL - sun);

// // //         /* ---------- VISUAL GEOMETRY ---------- */

// // //         earthOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(sun);

// // //         earth.current.rotation.y = elapsed;

// // //         moonOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(elongation);

// // //         /* ---------- LIGHTING ---------- */

// // //         const earthPos = new THREE.Vector3();
// // //         const moonPos = new THREE.Vector3();

// // //         earth.current.getWorldPosition(earthPos);
// // //         moon.current.getWorldPosition(moonPos);

// // //         const lightDir = moonPos.clone().normalize();
// // //         sunLight.current.position.copy(
// // //             lightDir.multiplyScalar(-20)
// // //         );
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();

// // //         /* ---------- TITHI ---------- */

// // //         const tithiIndex = Math.floor(elongation / 12);

// // //         let paksha, tithi;
// // //         if (elongation < 180) {
// // //             paksha = "Shukla Paksha";
// // //             tithi = SHUKLA[tithiIndex];
// // //         } else {
// // //             paksha = "Krishna Paksha";
// // //             tithi = KRISHNA[tithiIndex - 15];
// // //         }

// // //         const isAmavasya =
// // //             paksha === "Krishna Paksha" && tithiIndex === 29;

// // //         /* ---------- NAKSHATRA ---------- */

// // //         const nak = NAKSHATRAS[
// // //             Math.floor(moonL / (360 / 27))
// // //         ];

// // //         /* ---------- AMANTA MAASAM ---------- */

// // //         const sunRasi = Math.floor(sun / 30);
// // //         const maasam =
// // //             AMANTA_MAASAMS[(sunRasi + 1) % 12];

// // //         /* ---------- DATE ---------- */

// // //         const gregorian = new Date(
// // //             (simJD - 2440587.5) * 86400000
// // //         );

// // //         onUpdate({
// // //             date: gregorian.toUTCString(),
// // //             tithi,
// // //             paksha,
// // //             nakshatra: nak,
// // //             maasam,
// // //             isAmavasya: isAmavasya ? "Yes" : ""
// // //         });
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.05} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <Grid
// // //                 args={[25, 25]}
// // //                 position={[0, -0.01, 0]}
// // //                 rotation={[-Math.PI / 2, 0, 0]}
// // //             />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});
// // //     const [speed, setSpeed] = useState(1);
// // //     const [paused, setPaused] = useState(false);

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem
// // //                     speed={speed}
// // //                     paused={paused}
// // //                     onUpdate={setData}
// // //                 />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             <div style={{
// // //                 position: "absolute",
// // //                 top: 16,
// // //                 left: 16,
// // //                 color: "white",
// // //                 background: "rgba(0,0,0,0.85)",
// // //                 padding: 20,
// // //                 borderRadius: 14,
// // //                 width: 380
// // //             }}>
// // //                 <div><b>📅 Date:</b> {data.date}</div>
// // //                 <div><b>🌙 Tithi:</b> {data.tithi}</div>
// // //                 <div><b>📿 Paksha:</b> {data.paksha}</div>
// // //                 <div><b>⭐ Nakshatra:</b> {data.nakshatra}</div>
// // //                 <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// // //                     🌑 Āmānta Māsa: {data.maasam}
// // //                 </div>
// // //                 {data.isAmavasya && (
// // //                     <div style={{ color: "#ff5555" }}>
// // //                         🔴 Amāvāsyā
// // //                     </div>
// // //                 )}

// // //                 <button onClick={() => setPaused(!paused)}>
// // //                     {paused ? "▶ Resume" : "⏸ Pause"}
// // //                 </button>

// // //                 <input
// // //                     type="range"
// // //                     min="0.1"
// // //                     max="5"
// // //                     step="0.1"
// // //                     value={speed}
// // //                     onChange={e => setSpeed(+e.target.value)}
// // //                     style={{ width: "100%" }}
// // //                 />
// // //             </div>
// // //         </div>
// // //     );
// // // }



// // // ///// v1.5 /////

// // // import React, { useRef, useState } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const baseJD = useRef(toJD(Date.now()));

// // //     useFrame(({ clock }) => {
// // //         if (paused) return;

// // //         const elapsed = clock.getElapsedTime() * speed;
// // //         const simJD = baseJD.current + elapsed / (2 * Math.PI);

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);
// // //         const elongation = norm(moonL - sun);

// // //         earthOrbit.current.rotation.y = THREE.MathUtils.degToRad(sun);
// // //         earth.current.rotation.y = elapsed;
// // //         moonOrbit.current.rotation.y = THREE.MathUtils.degToRad(elongation);

// // //         const earthPos = new THREE.Vector3();
// // //         const moonPos = new THREE.Vector3();
// // //         earth.current.getWorldPosition(earthPos);
// // //         moon.current.getWorldPosition(moonPos);

// // //         const lightDir = moonPos.clone().normalize();
// // //         sunLight.current.position.copy(lightDir.multiplyScalar(-20));
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();

// // //         const tithiIndex = Math.floor(elongation / 12);
// // //         let paksha, tithi;
// // //         if (elongation < 180) {
// // //             paksha = "Shukla Paksha";
// // //             tithi = SHUKLA[tithiIndex];
// // //         } else {
// // //             paksha = "Krishna Paksha";
// // //             tithi = KRISHNA[tithiIndex - 15];
// // //         }

// // //         const nakshatra =
// // //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];

// // //         const sunRasi = Math.floor(sun / 30);
// // //         const maasam = AMANTA_MAASAMS[(sunRasi + 1) % 12];

// // //         const gregorian = new Date(
// // //             (simJD - 2440587.5) * 86400000
// // //         );

// // //         onUpdate({
// // //             date: gregorian.toUTCString(),
// // //             tithi,
// // //             paksha,
// // //             nakshatra,
// // //             maasam
// // //         });
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.06} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <Grid
// // //                 args={[25, 25]}
// // //                 position={[0, -0.01, 0]}
// // //                 rotation={[-Math.PI / 2, 0, 0]}
// // //             />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});
// // //     const [speed, setSpeed] = useState(1);
// // //     const [paused, setPaused] = useState(false);

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem
// // //                     speed={speed}
// // //                     paused={paused}
// // //                     onUpdate={setData}
// // //                 />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             {/* 🌌 INFO PANEL — BACK ON THE ANIMATION */}
// // //             <div
// // //                 style={{
// // //                     position: "absolute",
// // //                     top: 20,
// // //                     left: 20,
// // //                     color: "white",
// // //                     background: "rgba(0,0,0,0.75)",
// // //                     padding: 20,
// // //                     borderRadius: 16,
// // //                     width: 360,
// // //                     backdropFilter: "blur(12px)",
// // //                     boxShadow: "0 0 30px rgba(255,170,0,0.15)",
// // //                     pointerEvents: "auto"
// // //                 }}
// // //             >
// // //                 <div style={{ fontSize: 14, lineHeight: 1.6 }}>
// // //                     <div><b>📅 Date:</b> {data.date}</div>
// // //                     <div><b>🌙 Tithi:</b> {data.tithi}</div>
// // //                     <div><b>📿 Paksha:</b> {data.paksha}</div>
// // //                     <div><b>⭐ Nakshatra:</b> {data.nakshatra}</div>
// // //                     <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// // //                         🌑 Āmānta Māsa: {data.maasam}
// // //                     </div>
// // //                 </div>

// // //                 <div style={{ marginTop: 12 }}>
// // //                     <button
// // //                         onClick={() => setPaused(!paused)}
// // //                         style={{
// // //                             width: "100%",
// // //                             padding: "10px 0",
// // //                             borderRadius: 10,
// // //                             border: "none",
// // //                             background: paused ? "#00cc88" : "#ff4444",
// // //                             color: "white",
// // //                             fontWeight: "bold",
// // //                             cursor: "pointer"
// // //                         }}
// // //                     >
// // //                         {paused ? "▶ Resume" : "⏸ Pause"}
// // //                     </button>

// // //                     <input
// // //                         type="range"
// // //                         min="0.1"
// // //                         max="5"
// // //                         step="0.1"
// // //                         value={speed}
// // //                         onChange={e => setSpeed(+e.target.value)}
// // //                         style={{ width: "100%", marginTop: 10 }}
// // //                     />
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }


// // // /// v1.6 ///
// // // import React, { useRef, useState } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const baseJD = useRef(toJD(Date.now()));

// // //     useFrame(({ clock }) => {
// // //         if (paused) return;

// // //         const elapsed = clock.getElapsedTime() * speed;
// // //         const simJD = baseJD.current + elapsed / (2 * Math.PI);

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);

// // //         /* 🔑 LOGICAL ELONGATION (USED FOR TITHI) */
// // //         const elongation = norm(moonL - sun);

// // //         /* ---------- VISUAL MOTION ---------- */

// // //         earthOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(sun);

// // //         earth.current.rotation.y = elapsed;

// // //         // ✅ PHASE-CORRECTED MOON POSITION
// // //         moonOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(elongation + 180);

// // //         /* ---------- LIGHTING ---------- */

// // //         const earthPos = new THREE.Vector3();
// // //         const moonPos = new THREE.Vector3();
// // //         earth.current.getWorldPosition(earthPos);
// // //         moon.current.getWorldPosition(moonPos);

// // //         const lightDir = moonPos.clone().normalize();
// // //         sunLight.current.position.copy(
// // //             lightDir.multiplyScalar(-20)
// // //         );
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();

// // //         /* ---------- TITHI ---------- */

// // //         const tithiIndex = Math.floor(elongation / 12);

// // //         let paksha, tithi;
// // //         if (elongation < 180) {
// // //             paksha = "Shukla Paksha";
// // //             tithi = SHUKLA[tithiIndex];
// // //         } else {
// // //             paksha = "Krishna Paksha";
// // //             tithi = KRISHNA[tithiIndex - 15];
// // //         }

// // //         /* ---------- NAKSHATRA ---------- */

// // //         const nakshatra =
// // //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];

// // //         /* ---------- AMANTA MAASAM ---------- */

// // //         const sunRasi = Math.floor(sun / 30);
// // //         const maasam = AMANTA_MAASAMS[(sunRasi + 1) % 12];

// // //         /* ---------- DATE ---------- */

// // //         const gregorian = new Date(
// // //             (simJD - 2440587.5) * 86400000
// // //         );

// // //         onUpdate({
// // //             date: gregorian.toUTCString(),
// // //             tithi,
// // //             paksha,
// // //             nakshatra,
// // //             maasam
// // //         });
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.06} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <Grid
// // //                 args={[25, 25]}
// // //                 position={[0, -0.01, 0]}
// // //                 rotation={[-Math.PI / 2, 0, 0]}
// // //             />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});
// // //     const [speed, setSpeed] = useState(1);
// // //     const [paused, setPaused] = useState(false);

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem
// // //                     speed={speed}
// // //                     paused={paused}
// // //                     onUpdate={setData}
// // //                 />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             {/* INFO PANEL ON SCENE */}
// // //             <div
// // //                 style={{
// // //                     position: "absolute",
// // //                     top: 20,
// // //                     left: 20,
// // //                     color: "white",
// // //                     background: "rgba(0,0,0,0.75)",
// // //                     padding: 20,
// // //                     borderRadius: 16,
// // //                     width: 360,
// // //                     backdropFilter: "blur(12px)",
// // //                     boxShadow: "0 0 30px rgba(255,170,0,0.15)"
// // //                 }}
// // //             >
// // //                 <div style={{ lineHeight: 1.6 }}>
// // //                     <div><b>📅 Date:</b> {data.date}</div>
// // //                     <div><b>🌙 Tithi:</b> {data.tithi}</div>
// // //                     <div><b>📿 Paksha:</b> {data.paksha}</div>
// // //                     <div><b>⭐ Nakshatra:</b> {data.nakshatra}</div>
// // //                     <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// // //                         🌑 Āmānta Māsa: {data.maasam}
// // //                     </div>
// // //                 </div>

// // //                 <button
// // //                     onClick={() => setPaused(!paused)}
// // //                     style={{
// // //                         width: "100%",
// // //                         marginTop: 12,
// // //                         padding: "10px 0",
// // //                         borderRadius: 10,
// // //                         border: "none",
// // //                         background: paused ? "#00cc88" : "#ff4444",
// // //                         color: "white",
// // //                         fontWeight: "bold",
// // //                         cursor: "pointer"
// // //                     }}
// // //                 >
// // //                     {paused ? "▶ Resume" : "⏸ Pause"}
// // //                 </button>

// // //                 <input
// // //                     type="range"
// // //                     min="0.1"
// // //                     max="5"
// // //                     step="0.1"
// // //                     value={speed}
// // //                     onChange={e => setSpeed(+e.target.value)}
// // //                     style={{ width: "100%", marginTop: 10 }}
// // //                 />
// // //             </div>
// // //         </div>
// // //     );
// // // }



// // ///// v1.6.1 /////

// // // import React, { useRef, useState } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // ];

// // // const RASIS = [
// // //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// // //     "Simha", "Kanya", "Tula", "Vrischika",
// // //     "Dhanu", "Makara", "Kumbha", "Meena"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const baseJD = useRef(toJD(Date.now()));

// // //     // 🔑 Panchanga state
// // //     const prevElong = useRef(null);
// // //     const lastAmavasyaSun = useRef(null);
// // //     const currentMaasam = useRef(null);

// // //     useFrame(({ clock }) => {
// // //         if (paused) return;

// // //         const elapsed = clock.getElapsedTime() * speed;
// // //         const simJD = baseJD.current + elapsed / (2 * Math.PI);

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);
// // //         const elong = norm(moonL - sun);

// // //         /* ---------- AMAVASYA DETECTION ---------- */
// // //         if (
// // //             prevElong.current !== null &&
// // //             prevElong.current > 350 &&
// // //             elong < 10
// // //         ) {
// // //             // 🔑 exact Amāvāsyā crossing
// // //             lastAmavasyaSun.current = sun;
// // //             const rasiIndex = Math.floor(sun / 30);
// // //             currentMaasam.current = AMANTA_MAASAMS[rasiIndex];
// // //         }
// // //         prevElong.current = elong;

// // //         // initialize on first frame
// // //         if (!currentMaasam.current) {
// // //             const rasiIndex = Math.floor(sun / 30);
// // //             currentMaasam.current = AMANTA_MAASAMS[rasiIndex];
// // //             lastAmavasyaSun.current = sun;
// // //         }

// // //         /* ---------- VISUAL MOTION ---------- */

// // //         earthOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(sun);

// // //         earth.current.rotation.y = elapsed;

// // //         moonOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(elong + 180);

// // //         /* ---------- LIGHTING ---------- */

// // //         const earthPos = new THREE.Vector3();
// // //         const moonPos = new THREE.Vector3();
// // //         earth.current.getWorldPosition(earthPos);
// // //         moon.current.getWorldPosition(moonPos);

// // //         const lightDir = moonPos.clone().normalize();
// // //         sunLight.current.position.copy(
// // //             lightDir.multiplyScalar(-20)
// // //         );
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();

// // //         /* ---------- TITHI ---------- */

// // //         const tithiIndex = Math.floor(elong / 12);
// // //         let paksha, tithi;

// // //         if (elong < 180) {
// // //             paksha = "Shukla Paksha";
// // //             tithi = SHUKLA[tithiIndex];
// // //         } else {
// // //             paksha = "Krishna Paksha";
// // //             tithi = KRISHNA[tithiIndex - 15];
// // //         }

// // //         /* ---------- NAKSHATRA ---------- */

// // //         const nakshatra =
// // //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];

// // //         /* ---------- RASI ---------- */

// // //         const rasi = RASIS[Math.floor(sun / 30)];

// // //         /* ---------- DATE ---------- */

// // //         const gregorian = new Date(
// // //             (simJD - 2440587.5) * 86400000
// // //         );

// // //         onUpdate({
// // //             date: gregorian.toUTCString(),
// // //             tithi,
// // //             paksha,
// // //             nakshatra,
// // //             rasi,
// // //             maasam: currentMaasam.current
// // //         });
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.06} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <Grid
// // //                 args={[25, 25]}
// // //                 position={[0, -0.01, 0]}
// // //                 rotation={[-Math.PI / 2, 0, 0]}
// // //             />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});
// // //     const [speed, setSpeed] = useState(1);
// // //     const [paused, setPaused] = useState(false);

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem
// // //                     speed={speed}
// // //                     paused={paused}
// // //                     onUpdate={setData}
// // //                 />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             {/* INFO BOX */}
// // //             <div
// // //                 style={{
// // //                     position: "absolute",
// // //                     top: 20,
// // //                     left: 20,
// // //                     color: "white",
// // //                     background: "rgba(0,0,0,0.75)",
// // //                     padding: 20,
// // //                     borderRadius: 16,
// // //                     width: 360,
// // //                     backdropFilter: "blur(12px)"
// // //                 }}
// // //             >
// // //                 <div style={{ lineHeight: 1.6 }}>
// // //                     <div><b>📅 Date:</b> {data.date}</div>
// // //                     <div><b>🌙 Tithi:</b> {data.tithi}</div>
// // //                     <div><b>📿 Paksha:</b> {data.paksha}</div>
// // //                     <div><b>⭐ Nakshatra:</b> {data.nakshatra}</div>
// // //                     <div><b>☀️ Rāśi:</b> {data.rasi}</div>
// // //                     <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// // //                         🌑 Āmānta Māsa: {data.maasam}
// // //                     </div>
// // //                 </div>

// // //                 <button
// // //                     onClick={() => setPaused(!paused)}
// // //                     style={{
// // //                         width: "100%",
// // //                         marginTop: 12,
// // //                         padding: "10px 0",
// // //                         borderRadius: 10,
// // //                         border: "none",
// // //                         background: paused ? "#00cc88" : "#ff4444",
// // //                         color: "white",
// // //                         fontWeight: "bold"
// // //                     }}
// // //                 >
// // //                     {paused ? "▶ Resume" : "⏸ Pause"}
// // //                 </button>

// // //                 <input
// // //                     type="range"
// // //                     min="0.1"
// // //                     max="5"
// // //                     step="0.1"
// // //                     value={speed}
// // //                     onChange={e => setSpeed(+e.target.value)}
// // //                     style={{ width: "100%", marginTop: 10 }}
// // //                 />
// // //             </div>
// // //         </div>
// // //     );
// // // }


// // // // v1.7.2 // lighting wrong but calculations seem right
// // // import React, { useRef, useState } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // ];

// // // const RASIS = [
// // //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// // //     "Simha", "Kanya", "Tula", "Vrischika",
// // //     "Dhanu", "Makara", "Kumbha", "Meena"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const baseJD = useRef(toJD(Date.now()));

// // //     const prevElong = useRef(null);
// // //     const prevAmavasyaRasi = useRef(null);
// // //     const currentMaasam = useRef(null);
// // //     const isAdhika = useRef(false);
// // //     const initialized = useRef(false);

// // //     /* ---------- INITIALIZE ---------- */
// // //     const initializeMaasa = jdNow => {
// // //         let jd = jdNow;
// // //         let prev = norm(moonLon(jd) - sunLon(jd));

// // //         for (let i = 0; i < 35 * 24; i++) {
// // //             jd -= 1 / 24;
// // //             const e = norm(moonLon(jd) - sunLon(jd));

// // //             if (prev < 10 && e > 350) {
// // //                 const sun = sunLon(jd);
// // //                 const rasi = Math.floor(sun / 30);
// // //                 const masaIndex = (rasi + 1) % 12;

// // //                 prevAmavasyaRasi.current = rasi;
// // //                 isAdhika.current = false;
// // //                 currentMaasam.current = AMANTA_MAASAMS[masaIndex];
// // //                 prevElong.current = 180;
// // //                 return;
// // //             }
// // //             prev = e;
// // //         }
// // //     };

// // //     useFrame(({ clock }) => {
// // //         if (paused) return;

// // //         const elapsed = clock.getElapsedTime() * speed;
// // //         const simJD = baseJD.current + elapsed / (2 * Math.PI);

// // //         if (!initialized.current) {
// // //             initializeMaasa(simJD);
// // //             initialized.current = true;
// // //         }

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);
// // //         const elong = norm(moonL - sun);

// // //         /* ---------- AMAVASYA ---------- */
// // //         if (
// // //             prevElong.current !== null &&
// // //             prevElong.current > 350 &&
// // //             elong < 10
// // //         ) {
// // //             const rasi = Math.floor(sun / 30);
// // //             const masaIndex = (rasi + 1) % 12;

// // //             isAdhika.current = (rasi === prevAmavasyaRasi.current);

// // //             currentMaasam.current =
// // //                 (isAdhika.current ? "Adhika " : "") +
// // //                 AMANTA_MAASAMS[masaIndex];

// // //             prevAmavasyaRasi.current = rasi;
// // //         }

// // //         prevElong.current = elong;

// // //         /* ---------- VISUALS ---------- */

// // //         earthOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(sun);

// // //         moonOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(elong + 180);

// // //         const tithiIndex = Math.floor(elong / 12);
// // //         const paksha = elong < 180 ? "Shukla Paksha" : "Krishna Paksha";
// // //         const tithi =
// // //             elong < 180
// // //                 ? SHUKLA[tithiIndex]
// // //                 : KRISHNA[tithiIndex - 15];

// // //         const nakshatra =
// // //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];
// // //         const rasiName = RASIS[Math.floor(sun / 30)];
// // //         const date = new Date((simJD - 2440587.5) * 86400000);

// // //         onUpdate({
// // //             date: date.toUTCString(),
// // //             tithi,
// // //             paksha,
// // //             nakshatra,
// // //             rasi: rasiName,
// // //             maasam: currentMaasam.current
// // //         });
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>
// // //             <ambientLight intensity={0.1} />
// // //             <directionalLight ref={sunLight} intensity={2} />
// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>
// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>
// // //             <Grid args={[25, 25]} rotation={[-Math.PI / 2, 0, 0]} />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});
// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510" }}>
// // //             <Canvas camera={{ position: [0, 6, 12] }}>
// // //                 <SolarSystem speed={1} paused={false} onUpdate={setData} />
// // //                 <OrbitControls />
// // //             </Canvas>
// // //             <div style={{
// // //                 position: "absolute",
// // //                 top: 20,
// // //                 left: 20,
// // //                 color: "white",
// // //                 background: "rgba(0,0,0,0.75)",
// // //                 padding: 16,
// // //                 borderRadius: 12
// // //             }}>
// // //                 <div>Date: {data.date}</div>
// // //                 <div>Tithi: {data.tithi}</div>
// // //                 <div>Paksha: {data.paksha}</div>
// // //                 <div>Nakshatra: {data.nakshatra}</div>
// // //                 <div>Rasi: {data.rasi}</div>
// // //                 <div><b>Āmānta Māsa:</b> {data.maasam}</div>
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // /// v1.8 ///
// // // import React, { useRef, useState } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // ];

// // // const RASIS = [
// // //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// // //     "Simha", "Kanya", "Tula", "Vrischika",
// // //     "Dhanu", "Makara", "Kumbha", "Meena"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const baseJD = useRef(toJD(Date.now()));

// // //     const prevElong = useRef(null);
// // //     const prevAmavasyaRasi = useRef(null);
// // //     const currentMaasam = useRef(null);
// // //     const isAdhika = useRef(false);
// // //     const initialized = useRef(false);

// // //     /* ---------- INITIALIZE MAASA ---------- */
// // //     const initializeMaasa = jdNow => {
// // //         let jd = jdNow;
// // //         let prev = norm(moonLon(jd) - sunLon(jd));

// // //         for (let i = 0; i < 35 * 24; i++) {
// // //             jd -= 1 / 24;
// // //             const e = norm(moonLon(jd) - sunLon(jd));

// // //             if (prev < 10 && e > 350) {
// // //                 const sun = sunLon(jd);
// // //                 const rasi = Math.floor(sun / 30);
// // //                 const masaIndex = (rasi + 1) % 12;

// // //                 prevAmavasyaRasi.current = rasi;
// // //                 isAdhika.current = false;
// // //                 currentMaasam.current = AMANTA_MAASAMS[masaIndex];
// // //                 prevElong.current = 180;
// // //                 return;
// // //             }
// // //             prev = e;
// // //         }
// // //     };

// // //     useFrame(({ clock }) => {
// // //         if (paused) return;

// // //         const elapsed = clock.getElapsedTime() * speed;
// // //         const simJD = baseJD.current + elapsed / (2 * Math.PI);

// // //         if (!initialized.current) {
// // //             initializeMaasa(simJD);
// // //             initialized.current = true;
// // //         }

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);
// // //         const elong = norm(moonL - sun);

// // //         /* ---------- AMAVASYA ---------- */
// // //         if (
// // //             prevElong.current !== null &&
// // //             prevElong.current > 350 &&
// // //             elong < 10
// // //         ) {
// // //             const rasi = Math.floor(sun / 30);
// // //             const masaIndex = (rasi + 1) % 12;

// // //             isAdhika.current = (rasi === prevAmavasyaRasi.current);

// // //             currentMaasam.current =
// // //                 (isAdhika.current ? "Adhika " : "") +
// // //                 AMANTA_MAASAMS[masaIndex];

// // //             prevAmavasyaRasi.current = rasi;
// // //         }

// // //         prevElong.current = elong;

// // //         /* ---------- VISUAL MOTION ---------- */

// // //         earthOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(sun);

// // //         earth.current.rotation.y = elapsed;

// // //         moonOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(elong + 180);

// // //         /* ---------- RESTORED LIGHTING (CORRECT) ---------- */

// // //         const earthPos = new THREE.Vector3();
// // //         const moonPos = new THREE.Vector3();

// // //         earth.current.getWorldPosition(earthPos);
// // //         moon.current.getWorldPosition(moonPos);

// // //         // Sunlight direction from Sun → Moon
// // //         const lightDir = moonPos.clone().normalize();

// // //         sunLight.current.position.copy(
// // //             lightDir.multiplyScalar(-20)
// // //         );
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();

// // //         /* ---------- PANCHANGA ---------- */

// // //         const tithiIndex = Math.floor(elong / 12);
// // //         const paksha = elong < 180 ? "Shukla Paksha" : "Krishna Paksha";
// // //         const tithi =
// // //             elong < 180
// // //                 ? SHUKLA[tithiIndex]
// // //                 : KRISHNA[tithiIndex - 15];

// // //         const nakshatra =
// // //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];

// // //         const rasiName = RASIS[Math.floor(sun / 30)];

// // //         const date = new Date(
// // //             (simJD - 2440587.5) * 86400000
// // //         );

// // //         onUpdate({
// // //             date: date.toUTCString(),
// // //             tithi,
// // //             paksha,
// // //             nakshatra,
// // //             rasi: rasiName,
// // //             maasam: currentMaasam.current
// // //         });
// // //     });

// // //     return (
// // //         <>
// // //             {/* SUN */}
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.06} />

// // //             {/* EARTH + MOON */}
// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <Grid
// // //                 args={[25, 25]}
// // //                 position={[0, -0.01, 0]}
// // //                 rotation={[-Math.PI / 2, 0, 0]}
// // //             />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem speed={1} paused={false} onUpdate={setData} />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             <div
// // //                 style={{
// // //                     position: "absolute",
// // //                     top: 20,
// // //                     left: 20,
// // //                     color: "white",
// // //                     background: "rgba(0,0,0,0.75)",
// // //                     padding: 18,
// // //                     borderRadius: 14,
// // //                     width: 340
// // //                 }}
// // //             >
// // //                 <div><b>Date:</b> {data.date}</div>
// // //                 <div><b>Tithi:</b> {data.tithi}</div>
// // //                 <div><b>Paksha:</b> {data.paksha}</div>
// // //                 <div><b>Nakshatra:</b> {data.nakshatra}</div>
// // //                 <div><b>Rāśi:</b> {data.rasi}</div>
// // //                 <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// // //                     Āmānta Māsa: {data.maasam}
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }


// // // /// v1.8 ///
// // // import React, { useRef, useState } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // ];

// // // const RASIS = [
// // //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// // //     "Simha", "Kanya", "Tula", "Vrischika",
// // //     "Dhanu", "Makara", "Kumbha", "Meena"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== AMAVASYA SEARCH ===================== */

// // // function findAmavasya(jd, direction) {
// // //     const step = direction === "back" ? -1 / 24 : 1 / 24;
// // //     let prev = norm(moonLon(jd) - sunLon(jd));

// // //     for (let i = 0; i < 45 * 24; i++) {
// // //         jd += step;
// // //         const e = norm(moonLon(jd) - sunLon(jd));

// // //         if (direction === "back") {
// // //             if (prev < 10 && e > 350) return jd;
// // //         } else {
// // //             if (prev > 350 && e < 10) return jd;
// // //         }
// // //         prev = e;
// // //     }
// // //     return null;
// // // }

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const baseJD = useRef(toJD(Date.now()));

// // //     useFrame(({ clock }) => {
// // //         if (paused) return;

// // //         const elapsed = clock.getElapsedTime() * speed;
// // //         const simJD = baseJD.current + elapsed / (2 * Math.PI);

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);
// // //         const elong = norm(moonL - sun);

// // //         /* ---------- AMANTA MAASA (STATeless, SAFE) ---------- */

// // //         const lastAmavasya = findAmavasya(simJD, "back");
// // //         const nextAmavasya = findAmavasya(simJD, "forward");

// // //         let maasam = "—";

// // //         if (lastAmavasya && nextAmavasya) {
// // //             const lastRasi = Math.floor(sunLon(lastAmavasya) / 30);
// // //             const nextRasi = Math.floor(sunLon(nextAmavasya) / 30);
// // //             const masaIndex = (lastRasi + 1) % 12;

// // //             const isAdhika = lastRasi === nextRasi;

// // //             maasam = isAdhika
// // //                 ? "Adhika " + AMANTA_MAASAMS[masaIndex]
// // //                 : AMANTA_MAASAMS[masaIndex];
// // //         }

// // //         /* ---------- VISUAL MOTION ---------- */

// // //         earthOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(sun);

// // //         earth.current.rotation.y = elapsed;

// // //         moonOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(elong + 180);

// // //         /* ---------- LIGHTING (UNCHANGED) ---------- */

// // //         const earthPos = new THREE.Vector3();
// // //         const moonPos = new THREE.Vector3();
// // //         earth.current.getWorldPosition(earthPos);
// // //         moon.current.getWorldPosition(moonPos);

// // //         const lightDir = moonPos.clone().normalize();
// // //         sunLight.current.position.copy(
// // //             lightDir.multiplyScalar(-20)
// // //         );
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();

// // //         /* ---------- PANCHANGA ---------- */

// // //         const tithiIndex = Math.floor(elong / 12);
// // //         const paksha = elong < 180 ? "Shukla Paksha" : "Krishna Paksha";
// // //         const tithi =
// // //             elong < 180
// // //                 ? SHUKLA[tithiIndex]
// // //                 : KRISHNA[tithiIndex - 15];

// // //         const nakshatra =
// // //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];

// // //         const rasiName = RASIS[Math.floor(sun / 30)];

// // //         const date = new Date(
// // //             (simJD - 2440587.5) * 86400000
// // //         );

// // //         onUpdate({
// // //             date: date.toUTCString(),
// // //             tithi,
// // //             paksha,
// // //             nakshatra,
// // //             rasi: rasiName,
// // //             maasam
// // //         });
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.06} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <Grid
// // //                 args={[25, 25]}
// // //                 position={[0, -0.01, 0]}
// // //                 rotation={[-Math.PI / 2, 0, 0]}
// // //             />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});
// // //     const [speed, setSpeed] = useState(1);
// // //     const [paused, setPaused] = useState(false);

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem speed={speed} paused={paused} onUpdate={setData} />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             <div
// // //                 style={{
// // //                     position: "absolute",
// // //                     top: 20,
// // //                     left: 20,
// // //                     color: "white",
// // //                     background: "rgba(0,0,0,0.75)",
// // //                     padding: 18,
// // //                     borderRadius: 14,
// // //                     width: 360
// // //                 }}
// // //             >
// // //                 <div><b>Date:</b> {data.date}</div>
// // //                 <div><b>Tithi:</b> {data.tithi}</div>
// // //                 <div><b>Paksha:</b> {data.paksha}</div>
// // //                 <div><b>Nakshatra:</b> {data.nakshatra}</div>
// // //                 <div><b>Rāśi:</b> {data.rasi}</div>
// // //                 <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// // //                     Āmānta Māsa: {data.maasam}
// // //                 </div>

// // //                 <button
// // //                     onClick={() => setPaused(!paused)}
// // //                     style={{
// // //                         width: "100%",
// // //                         marginTop: 10,
// // //                         padding: "8px 0",
// // //                         borderRadius: 10,
// // //                         border: "none",
// // //                         background: paused ? "#00cc88" : "#ff4444",
// // //                         color: "white",
// // //                         fontWeight: "bold"
// // //                     }}
// // //                 >
// // //                     {paused ? "▶ Resume" : "⏸ Pause"}
// // //                 </button>

// // //                 <input
// // //                     type="range"
// // //                     min="0.1"
// // //                     max="5"
// // //                     step="0.1"
// // //                     value={speed}
// // //                     onChange={e => setSpeed(+e.target.value)}
// // //                     style={{ width: "100%", marginTop: 8 }}
// // //                 />
// // //             </div>
// // //         </div>
// // //     );
// // // }



// // // /// v2.0 ///
// // // import React, { useRef, useState } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // ];

// // // const RASIS = [
// // //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// // //     "Simha", "Kanya", "Tula", "Vrischika",
// // //     "Dhanu", "Makara", "Kumbha", "Meena"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== AMAVASYA SEARCH ===================== */

// // // function findAmavasya(jd, direction) {
// // //     const step = direction === "back" ? -1 / 24 : 1 / 24;
// // //     let prev = norm(moonLon(jd) - sunLon(jd));

// // //     for (let i = 0; i < 45 * 24; i++) {
// // //         jd += step;
// // //         const e = norm(moonLon(jd) - sunLon(jd));

// // //         if (direction === "back") {
// // //             if (prev < 10 && e > 350) return jd;
// // //         } else {
// // //             if (prev > 350 && e < 10) return jd;
// // //         }
// // //         prev = e;
// // //     }
// // //     return null;
// // // }

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const baseJD = useRef(toJD(Date.now()));

// // //     // 🔑 Manual simulation clock
// // //     const simTime = useRef(0);
// // //     const lastFrameTime = useRef(null);

// // //     useFrame(({ clock }) => {
// // //         const now = clock.getElapsedTime();

// // //         if (lastFrameTime.current === null) {
// // //             lastFrameTime.current = now;
// // //             return;
// // //         }

// // //         const delta = now - lastFrameTime.current;
// // //         lastFrameTime.current = now;

// // //         if (!paused) {
// // //             simTime.current += delta * speed;
// // //         }

// // //         const simJD = baseJD.current + simTime.current / (2 * Math.PI);

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);
// // //         const elong = norm(moonL - sun);

// // //         /* ---------- AMANTA MAASA (STATELESS) ---------- */

// // //         const lastAmavasya = findAmavasya(simJD, "back");
// // //         const nextAmavasya = findAmavasya(simJD, "forward");

// // //         let maasam = "—";

// // //         if (lastAmavasya && nextAmavasya) {
// // //             const lastRasi = Math.floor(sunLon(lastAmavasya) / 30);
// // //             const nextRasi = Math.floor(sunLon(nextAmavasya) / 30);
// // //             const masaIndex = (lastRasi + 1) % 12;

// // //             maasam =
// // //                 lastRasi === nextRasi
// // //                     ? "Adhika " + AMANTA_MAASAMS[masaIndex]
// // //                     : AMANTA_MAASAMS[masaIndex];
// // //         }

// // //         /* ---------- VISUAL MOTION ---------- */

// // //         earthOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(sun);

// // //         earth.current.rotation.y = simTime.current;

// // //         moonOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(elong + 180);

// // //         /* ---------- LIGHTING (UNCHANGED) ---------- */

// // //         const earthPos = new THREE.Vector3();
// // //         const moonPos = new THREE.Vector3();
// // //         earth.current.getWorldPosition(earthPos);
// // //         moon.current.getWorldPosition(moonPos);

// // //         const lightDir = moonPos.clone().normalize();
// // //         sunLight.current.position.copy(
// // //             lightDir.multiplyScalar(-20)
// // //         );
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();

// // //         /* ---------- PANCHANGA ---------- */

// // //         const tithiIndex = Math.floor(elong / 12);
// // //         const paksha = elong < 180 ? "Shukla Paksha" : "Krishna Paksha";
// // //         const tithi =
// // //             elong < 180
// // //                 ? SHUKLA[tithiIndex]
// // //                 : KRISHNA[tithiIndex - 15];

// // //         const nakshatra =
// // //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];

// // //         const rasiName = RASIS[Math.floor(sun / 30)];

// // //         const date = new Date(
// // //             (simJD - 2440587.5) * 86400000
// // //         );

// // //         onUpdate({
// // //             date: date.toUTCString(),
// // //             tithi,
// // //             paksha,
// // //             nakshatra,
// // //             rasi: rasiName,
// // //             maasam
// // //         });
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.06} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <Grid
// // //                 args={[25, 25]}
// // //                 position={[0, -0.01, 0]}
// // //                 rotation={[-Math.PI / 2, 0, 0]}
// // //             />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});
// // //     const [speed, setSpeed] = useState(1);
// // //     const [paused, setPaused] = useState(false);

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem speed={speed} paused={paused} onUpdate={setData} />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             <div
// // //                 style={{
// // //                     position: "absolute",
// // //                     top: 20,
// // //                     left: 20,
// // //                     color: "white",
// // //                     background: "rgba(0,0,0,0.75)",
// // //                     padding: 18,
// // //                     borderRadius: 14,
// // //                     width: 360
// // //                 }}
// // //             >
// // //                 <div><b>Date:</b> {data.date}</div>
// // //                 <div><b>Tithi:</b> {data.tithi}</div>
// // //                 <div><b>Paksha:</b> {data.paksha}</div>
// // //                 <div><b>Nakshatra:</b> {data.nakshatra}</div>
// // //                 <div><b>Rāśi:</b> {data.rasi}</div>
// // //                 <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// // //                     Āmānta Māsa: {data.maasam}
// // //                 </div>

// // //                 <button
// // //                     onClick={() => setPaused(!paused)}
// // //                     style={{
// // //                         width: "100%",
// // //                         marginTop: 10,
// // //                         padding: "8px 0",
// // //                         borderRadius: 10,
// // //                         border: "none",
// // //                         background: paused ? "#00cc88" : "#ff4444",
// // //                         color: "white",
// // //                         fontWeight: "bold"
// // //                     }}
// // //                 >
// // //                     {paused ? "▶ Resume" : "⏸ Pause"}
// // //                 </button>

// // //                 <input
// // //                     type="range"
// // //                     min="0.1"
// // //                     max="5"
// // //                     step="0.1"
// // //                     value={speed}
// // //                     onChange={e => setSpeed(+e.target.value)}
// // //                     style={{ width: "100%", marginTop: 8 }}
// // //                 />
// // //             </div>
// // //         </div>
// // //     );
// // // }


// // // /// v2.0.1 ///
// // // import React, { useRef, useState } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // ];

// // // const RASIS = [
// // //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// // //     "Simha", "Kanya", "Tula", "Vrischika",
// // //     "Dhanu", "Makara", "Kumbha", "Meena"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const fromJD = jd => new Date((jd - 2440587.5) * 86400000);
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== AMAVASYA ===================== */

// // // function findAmavasya(jd, dir) {
// // //     const step = dir === "back" ? -1 / 24 : 1 / 24;
// // //     let prev = norm(moonLon(jd) - sunLon(jd));

// // //     for (let i = 0; i < 45 * 24; i++) {
// // //         jd += step;
// // //         const e = norm(moonLon(jd) - sunLon(jd));
// // //         if (dir === "back" && prev < 10 && e > 350) return jd;
// // //         if (dir === "forward" && prev > 350 && e < 10) return jd;
// // //         prev = e;
// // //     }
// // //     return null;
// // // }

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, anchorJD, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const earth = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const elapsedSim = useRef(0);
// // //     const lastFrame = useRef(null);

// // //     useFrame(({ clock }) => {
// // //         const now = clock.getElapsedTime();
// // //         if (lastFrame.current === null) {
// // //             lastFrame.current = now;
// // //             return;
// // //         }

// // //         const delta = now - lastFrame.current;
// // //         lastFrame.current = now;

// // //         if (!paused) elapsedSim.current += delta * speed;

// // //         const simJD = anchorJD + elapsedSim.current / (2 * Math.PI);

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);
// // //         const elong = norm(moonL - sun);

// // //         /* ---------- PANCHANGA ---------- */

// // //         const tithiIndex = Math.floor(elong / 12);
// // //         const paksha = elong < 180 ? "Shukla Paksha" : "Krishna Paksha";
// // //         const tithi =
// // //             elong < 180 ? SHUKLA[tithiIndex] : KRISHNA[tithiIndex - 15];

// // //         const nakshatra =
// // //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];

// // //         const lastAma = findAmavasya(simJD, "back");
// // //         const nextAma = findAmavasya(simJD, "forward");

// // //         let maasam = "—";
// // //         if (lastAma && nextAma) {
// // //             const lastR = Math.floor(sunLon(lastAma) / 30);
// // //             const nextR = Math.floor(sunLon(nextAma) / 30);
// // //             const idx = (lastR + 1) % 12;
// // //             maasam =
// // //                 lastR === nextR
// // //                     ? "Adhika " + AMANTA_MAASAMS[idx]
// // //                     : AMANTA_MAASAMS[idx];
// // //         }

// // //         const rasi = RASIS[Math.floor(sun / 30)];

// // //         onUpdate({
// // //             date: fromJD(simJD).toUTCString(),
// // //             tithi,
// // //             paksha,
// // //             nakshatra,
// // //             maasam,
// // //             rasi
// // //         });

// // //         /* ---------- VISUALS ---------- */

// // //         earthOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(sun);

// // //         moonOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(elong + 180);

// // //         const moonPos = new THREE.Vector3();
// // //         moon.current.getWorldPosition(moonPos);

// // //         sunLight.current.position.copy(
// // //             moonPos.clone().normalize().multiplyScalar(-20)
// // //         );
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.06} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh ref={earth} position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <Grid
// // //                 args={[25, 25]}
// // //                 position={[0, -0.01, 0]}
// // //                 rotation={[-Math.PI / 2, 0, 0]}
// // //             />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});
// // //     const [paused, setPaused] = useState(false);
// // //     const [speed, setSpeed] = useState(1);

// // //     const [anchorJD, setAnchorJD] = useState(
// // //         toJD(Date.now())
// // //     );

// // //     const scrubDays = 365 * 2; // ±2 years

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem
// // //                     speed={speed}
// // //                     paused={paused}
// // //                     anchorJD={anchorJD}
// // //                     onUpdate={setData}
// // //                 />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             <div
// // //                 style={{
// // //                     position: "absolute",
// // //                     top: 20,
// // //                     left: 20,
// // //                     color: "white",
// // //                     background: "rgba(0,0,0,0.75)",
// // //                     padding: 18,
// // //                     borderRadius: 14,
// // //                     width: 380
// // //                 }}
// // //             >
// // //                 <div><b>Date:</b> {data.date}</div>
// // //                 <div><b>Tithi:</b> {data.tithi}</div>
// // //                 <div><b>Paksha:</b> {data.paksha}</div>
// // //                 <div><b>Nakshatra:</b> {data.nakshatra}</div>
// // //                 <div><b>Rāśi:</b> {data.rasi}</div>
// // //                 <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// // //                     Āmānta Māsa: {data.maasam}
// // //                 </div>

// // //                 <button
// // //                     onClick={() => setPaused(!paused)}
// // //                     style={{
// // //                         width: "100%",
// // //                         marginTop: 10,
// // //                         padding: "8px 0",
// // //                         borderRadius: 10,
// // //                         border: "none",
// // //                         background: paused ? "#00cc88" : "#ff4444",
// // //                         color: "white",
// // //                         fontWeight: "bold"
// // //                     }}
// // //                 >
// // //                     {paused ? "▶ Resume" : "⏸ Pause"}
// // //                 </button>

// // //                 {/* TIME SCRUB */}
// // //                 <input
// // //                     type="range"
// // //                     min={-scrubDays}
// // //                     max={scrubDays}
// // //                     step={1}
// // //                     defaultValue={0}
// // //                     onChange={e => {
// // //                         const days = +e.target.value;
// // //                         setAnchorJD(toJD(Date.now()) + days);
// // //                     }}
// // //                     style={{ width: "100%", marginTop: 10 }}
// // //                 />

// // //                 {/* SPEED */}
// // //                 <input
// // //                     type="range"
// // //                     min="0.1"
// // //                     max="5"
// // //                     step="0.1"
// // //                     value={speed}
// // //                     onChange={e => setSpeed(+e.target.value)}
// // //                     style={{ width: "100%", marginTop: 10 }}
// // //                 />
// // //             </div>
// // //         </div>
// // //     );
// // // }


// // // /// v2.0.2 ///
// // // import React, { useRef, useState, useEffect } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // ];

// // // const RASIS = [
// // //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// // //     "Simha", "Kanya", "Tula", "Vrischika",
// // //     "Dhanu", "Makara", "Kumbha", "Meena"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const fromJD = jd => new Date((jd - 2440587.5) * 86400000);
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== AMAVASYA ===================== */

// // // function findAmavasya(jd, dir) {
// // //     const step = dir === "back" ? -1 / 24 : 1 / 24;
// // //     let prev = norm(moonLon(jd) - sunLon(jd));

// // //     for (let i = 0; i < 45 * 24; i++) {
// // //         jd += step;
// // //         const e = norm(moonLon(jd) - sunLon(jd));
// // //         if (dir === "back" && prev < 10 && e > 350) return jd;
// // //         if (dir === "forward" && prev > 350 && e < 10) return jd;
// // //         prev = e;
// // //     }
// // //     return null;
// // // }

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, anchorJD, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const elapsedSim = useRef(0);
// // //     const lastFrame = useRef(null);

// // //     useFrame(({ clock }) => {
// // //         const now = clock.getElapsedTime();
// // //         if (lastFrame.current === null) {
// // //             lastFrame.current = now;
// // //             return;
// // //         }

// // //         const delta = now - lastFrame.current;
// // //         lastFrame.current = now;

// // //         if (!paused) elapsedSim.current += delta * speed;

// // //         const simJD = anchorJD + elapsedSim.current;

// // //         /* ---------- PANCHANGA ---------- */

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);
// // //         const elong = norm(moonL - sun);

// // //         const tithiIndex = Math.floor(elong / 12);
// // //         const paksha = elong < 180 ? "Shukla Paksha" : "Krishna Paksha";
// // //         const tithi =
// // //             elong < 180 ? SHUKLA[tithiIndex] : KRISHNA[tithiIndex - 15];

// // //         const nakshatra =
// // //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];

// // //         const lastAma = findAmavasya(simJD, "back");
// // //         const nextAma = findAmavasya(simJD, "forward");

// // //         let maasam = "—";
// // //         if (lastAma && nextAma) {
// // //             const lastR = Math.floor(sunLon(lastAma) / 30);
// // //             const nextR = Math.floor(sunLon(nextAma) / 30);
// // //             const idx = (lastR + 1) % 12;
// // //             maasam =
// // //                 lastR === nextR
// // //                     ? "Adhika " + AMANTA_MAASAMS[idx]
// // //                     : AMANTA_MAASAMS[idx];
// // //         }

// // //         const rasi = RASIS[Math.floor(sun / 30)];

// // //         onUpdate({
// // //             date: fromJD(simJD).toUTCString(),
// // //             tithi,
// // //             paksha,
// // //             nakshatra,
// // //             maasam,
// // //             rasi
// // //         });

// // //         /* ---------- VISUALS ---------- */

// // //         earthOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(sun);

// // //         moonOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(elong + 180);

// // //         const moonPos = new THREE.Vector3();
// // //         moon.current.getWorldPosition(moonPos);

// // //         sunLight.current.position.copy(
// // //             moonPos.clone().normalize().multiplyScalar(-20)
// // //         );
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.06} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <Grid
// // //                 args={[25, 25]}
// // //                 position={[0, -0.01, 0]}
// // //                 rotation={[-Math.PI / 2, 0, 0]}
// // //             />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});
// // //     const [paused, setPaused] = useState(false);
// // //     const [speed, setSpeed] = useState(1);

// // //     const nowJD = toJD(Date.now());
// // //     const [scrubDays, setScrubDays] = useState(0);
// // //     const [anchorJD, setAnchorJD] = useState(nowJD);

// // //     useEffect(() => {
// // //         setAnchorJD(nowJD + scrubDays);
// // //     }, [scrubDays]);

// // //     const YEARS = 10000;

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem
// // //                     speed={speed}
// // //                     paused={paused}
// // //                     anchorJD={anchorJD}
// // //                     onUpdate={setData}
// // //                 />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             <div
// // //                 style={{
// // //                     position: "absolute",
// // //                     top: 20,
// // //                     left: 20,
// // //                     color: "white",
// // //                     background: "rgba(0,0,0,0.78)",
// // //                     padding: 18,
// // //                     borderRadius: 14,
// // //                     width: 420
// // //                 }}
// // //             >
// // //                 <div><b>Simulation Date (UTC)</b></div>
// // //                 <div style={{ marginBottom: 10 }}>{data.date}</div>

// // //                 <div><b>Tithi:</b> {data.tithi}</div>
// // //                 <div><b>Paksha:</b> {data.paksha}</div>
// // //                 <div><b>Nakshatra:</b> {data.nakshatra}</div>
// // //                 <div><b>Rāśi:</b> {data.rasi}</div>
// // //                 <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// // //                     Āmānta Māsa: {data.maasam}
// // //                 </div>

// // //                 {/* PAUSE */}
// // //                 <button
// // //                     onClick={() => setPaused(!paused)}
// // //                     style={{
// // //                         width: "100%",
// // //                         marginTop: 12,
// // //                         padding: "8px 0",
// // //                         borderRadius: 10,
// // //                         border: "none",
// // //                         background: paused ? "#00cc88" : "#ff4444",
// // //                         color: "white",
// // //                         fontWeight: "bold"
// // //                     }}
// // //                 >
// // //                     {paused ? "▶ Resume Simulation" : "⏸ Pause Simulation"}
// // //                 </button>

// // //                 {/* TIME SCRUB */}
// // //                 <div style={{ marginTop: 14 }}>
// // //                     <div><b>Jump to Date (Scrub)</b></div>
// // //                     <div style={{ fontSize: 12, opacity: 0.8 }}>
// // //                         ±{YEARS.toLocaleString()} years from today
// // //                     </div>
// // //                     <input
// // //                         type="range"
// // //                         min={-YEARS * 365}
// // //                         max={YEARS * 365}
// // //                         step={1}
// // //                         value={scrubDays}
// // //                         onChange={e => setScrubDays(+e.target.value)}
// // //                         style={{ width: "100%" }}
// // //                     />
// // //                     <div style={{ fontSize: 12 }}>
// // //                         Anchor date: {fromJD(anchorJD).toUTCString()}
// // //                     </div>
// // //                 </div>

// // //                 {/* SPEED */}
// // //                 <div style={{ marginTop: 14 }}>
// // //                     <div><b>Simulation Speed</b></div>
// // //                     <div style={{ fontSize: 12, opacity: 0.8 }}>
// // //                         Days per second
// // //                     </div>
// // //                     <input
// // //                         type="range"
// // //                         min="0.05"
// // //                         max="20"
// // //                         step="0.05"
// // //                         value={speed}
// // //                         onChange={e => setSpeed(+e.target.value)}
// // //                         style={{ width: "100%" }}
// // //                     />
// // //                     <div style={{ fontSize: 12 }}>
// // //                         {speed.toFixed(2)} days / second
// // //                     </div>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }


// // /// v2.0.3 ///
// // // import React, { useRef, useState, useEffect } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // ];

// // // const RASIS = [
// // //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// // //     "Simha", "Kanya", "Tula", "Vrischika",
// // //     "Dhanu", "Makara", "Kumbha", "Meena"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const fromJD = jd => new Date((jd - 2440587.5) * 86400000);
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== AMAVASYA ===================== */

// // // function findAmavasya(jd, dir) {
// // //     const step = dir === "back" ? -1 / 24 : 1 / 24;
// // //     let prev = norm(moonLon(jd) - sunLon(jd));

// // //     for (let i = 0; i < 45 * 24; i++) {
// // //         jd += step;
// // //         const e = norm(moonLon(jd) - sunLon(jd));
// // //         if (dir === "back" && prev < 10 && e > 350) return jd;
// // //         if (dir === "forward" && prev > 350 && e < 10) return jd;
// // //         prev = e;
// // //     }
// // //     return null;
// // // }

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, anchorJD, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const elapsedSim = useRef(0);
// // //     const lastFrame = useRef(null);

// // //     // reset elapsed time when anchor date changes
// // //     useEffect(() => {
// // //         elapsedSim.current = 0;
// // //     }, [anchorJD]);

// // //     useFrame(({ clock }) => {
// // //         const now = clock.getElapsedTime();
// // //         if (lastFrame.current === null) {
// // //             lastFrame.current = now;
// // //             return;
// // //         }

// // //         const delta = now - lastFrame.current;
// // //         lastFrame.current = now;

// // //         if (!paused) elapsedSim.current += delta * speed;

// // //         const simJD = anchorJD + elapsedSim.current;

// // //         /* ---------- PANCHANGA ---------- */

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);
// // //         const elong = norm(moonL - sun);

// // //         const tithiIndex = Math.floor(elong / 12);
// // //         const paksha = elong < 180 ? "Shukla Paksha" : "Krishna Paksha";
// // //         const tithi =
// // //             elong < 180 ? SHUKLA[tithiIndex] : KRISHNA[tithiIndex - 15];

// // //         const nakshatra =
// // //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];

// // //         const lastAma = findAmavasya(simJD, "back");
// // //         const nextAma = findAmavasya(simJD, "forward");

// // //         let maasam = "—";
// // //         if (lastAma && nextAma) {
// // //             const lastR = Math.floor(sunLon(lastAma) / 30);
// // //             const nextR = Math.floor(sunLon(nextAma) / 30);
// // //             const idx = (lastR + 1) % 12;
// // //             maasam =
// // //                 lastR === nextR
// // //                     ? "Adhika " + AMANTA_MAASAMS[idx]
// // //                     : AMANTA_MAASAMS[idx];
// // //         }

// // //         const rasi = RASIS[Math.floor(sun / 30)];

// // //         onUpdate({
// // //             date: fromJD(simJD).toUTCString(),
// // //             tithi,
// // //             paksha,
// // //             nakshatra,
// // //             maasam,
// // //             rasi
// // //         });

// // //         /* ---------- VISUALS ---------- */

// // //         earthOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(sun);

// // //         moonOrbit.current.rotation.y =
// // //             THREE.MathUtils.degToRad(elong + 180);

// // //         const moonPos = new THREE.Vector3();
// // //         moon.current.getWorldPosition(moonPos);

// // //         sunLight.current.position.copy(
// // //             moonPos.clone().normalize().multiplyScalar(-20)
// // //         );
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.06} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <Grid
// // //                 args={[25, 25]}
// // //                 position={[0, -0.01, 0]}
// // //                 rotation={[-Math.PI / 2, 0, 0]}
// // //             />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});
// // //     const [paused, setPaused] = useState(false);
// // //     const [speed, setSpeed] = useState(1);

// // //     const nowJD = toJD(Date.now());
// // //     const [anchorJD, setAnchorJD] = useState(nowJD);
// // //     const [scrubDays, setScrubDays] = useState(0);

// // //     // sync scrub slider when anchor changes
// // //     useEffect(() => {
// // //         setScrubDays(Math.round(anchorJD - nowJD));
// // //     }, [anchorJD]);

// // //     const YEARS = 10000;

// // //     const handleDatePick = e => {
// // //         const date = new Date(e.target.value + "T00:00:00Z");
// // //         setAnchorJD(toJD(date.getTime()));
// // //     };

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem
// // //                     speed={speed}
// // //                     paused={paused}
// // //                     anchorJD={anchorJD}
// // //                     onUpdate={setData}
// // //                 />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             <div
// // //                 style={{
// // //                     position: "absolute",
// // //                     top: 20,
// // //                     left: 20,
// // //                     color: "white",
// // //                     background: "rgba(0,0,0,0.78)",
// // //                     padding: 18,
// // //                     borderRadius: 14,
// // //                     width: 440
// // //                 }}
// // //             >
// // //                 <div><b>Simulation Date (UTC)</b></div>
// // //                 <div style={{ marginBottom: 8 }}>{data.date}</div>

// // //                 <div><b>Tithi:</b> {data.tithi}</div>
// // //                 <div><b>Paksha:</b> {data.paksha}</div>
// // //                 <div><b>Nakshatra:</b> {data.nakshatra}</div>
// // //                 <div><b>Rāśi:</b> {data.rasi}</div>
// // //                 <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// // //                     Āmānta Māsa: {data.maasam}
// // //                 </div>

// // //                 {/* DATE PICKER */}
// // //                 <div style={{ marginTop: 14 }}>
// // //                     <div><b>Jump to Calendar Date</b></div>
// // //                     <input
// // //                         type="date"
// // //                         onChange={handleDatePick}
// // //                         style={{ width: "100%", marginTop: 4 }}
// // //                     />
// // //                 </div>

// // //                 {/* PAUSE */}
// // //                 <button
// // //                     onClick={() => setPaused(!paused)}
// // //                     style={{
// // //                         width: "100%",
// // //                         marginTop: 12,
// // //                         padding: "8px 0",
// // //                         borderRadius: 10,
// // //                         border: "none",
// // //                         background: paused ? "#00cc88" : "#ff4444",
// // //                         color: "white",
// // //                         fontWeight: "bold"
// // //                     }}
// // //                 >
// // //                     {paused ? "▶ Resume Simulation" : "⏸ Pause Simulation"}
// // //                 </button>

// // //                 {/* SCRUB */}
// // //                 <div style={{ marginTop: 14 }}>
// // //                     <div><b>Time Scrub (Days from Today)</b></div>
// // //                     <div style={{ fontSize: 12, opacity: 0.8 }}>
// // //                         ±{YEARS.toLocaleString()} years
// // //                     </div>
// // //                     <input
// // //                         type="range"
// // //                         min={-YEARS * 365}
// // //                         max={YEARS * 365}
// // //                         step={1}
// // //                         value={scrubDays}
// // //                         onChange={e => setAnchorJD(nowJD + +e.target.value)}
// // //                         style={{ width: "100%" }}
// // //                     />
// // //                 </div>

// // //                 {/* SPEED */}
// // //                 <div style={{ marginTop: 14 }}>
// // //                     <div><b>Simulation Speed</b></div>
// // //                     <div style={{ fontSize: 12, opacity: 0.8 }}>
// // //                         Days per second
// // //                     </div>
// // //                     <input
// // //                         type="range"
// // //                         min="0.05"
// // //                         max="20"
// // //                         step="0.05"
// // //                         value={speed}
// // //                         onChange={e => setSpeed(+e.target.value)}
// // //                         style={{ width: "100%" }}
// // //                     />
// // //                     <div style={{ fontSize: 12 }}>
// // //                         {speed.toFixed(2)} days / second
// // //                     </div>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }


// // // /// v2.0.4 - bug with adhika maasamulu in the past ///

// // // import React, { useRef, useState, useEffect } from "react";
// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { OrbitControls, Grid } from "@react-three/drei";
// // // import * as THREE from "three";

// // // /* ===================== CONSTANTS ===================== */

// // // const AYANAMSA = 24.0;

// // // const SHUKLA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // ];

// // // const KRISHNA = [
// // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // ];

// // // const NAKSHATRAS = [
// // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // //     "Uttara Bhadrapada", "Revati"
// // // ];

// // // const AMANTA_MAASAMS = [
// // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // ];

// // // const RASIS = [
// // //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// // //     "Simha", "Kanya", "Tula", "Vrischika",
// // //     "Dhanu", "Makara", "Kumbha", "Meena"
// // // ];

// // // /* ===================== ASTRONOMY ===================== */

// // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // const fromJD = jd => new Date((jd - 2440587.5) * 86400000);
// // // const norm = d => (d % 360 + 360) % 360;

// // // const sunLon = jd =>
// // //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // // const moonLon = jd =>
// // //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // // /* ===================== AMAVASYA ===================== */

// // // function findAmavasya(jd, dir) {
// // //     const step = dir === "back" ? -1 / 24 : 1 / 24;
// // //     let prev = norm(moonLon(jd) - sunLon(jd));

// // //     for (let i = 0; i < 45 * 24; i++) {
// // //         jd += step;
// // //         const e = norm(moonLon(jd) - sunLon(jd));
// // //         if (dir === "back" && prev < 10 && e > 350) return jd;
// // //         if (dir === "forward" && prev > 350 && e < 10) return jd;
// // //         prev = e;
// // //     }
// // //     return null;
// // // }

// // // /* ===================== SCENE ===================== */

// // // function SolarSystem({ speed, paused, anchorJD, onUpdate }) {
// // //     const earthOrbit = useRef();
// // //     const moonOrbit = useRef();
// // //     const moon = useRef();
// // //     const sunLight = useRef();

// // //     const elapsedSim = useRef(0);
// // //     const lastFrame = useRef(null);

// // //     useEffect(() => {
// // //         elapsedSim.current = 0;
// // //     }, [anchorJD]);

// // //     useFrame(({ clock }) => {
// // //         const now = clock.getElapsedTime();
// // //         if (lastFrame.current === null) {
// // //             lastFrame.current = now;
// // //             return;
// // //         }

// // //         const delta = now - lastFrame.current;
// // //         lastFrame.current = now;

// // //         if (!paused) elapsedSim.current += delta * speed;
// // //         const simJD = anchorJD + elapsedSim.current;

// // //         const sun = sunLon(simJD);
// // //         const moonL = moonLon(simJD);
// // //         const elong = norm(moonL - sun);

// // //         const tithiIndex = Math.floor(elong / 12);
// // //         const paksha = elong < 180 ? "Shukla Paksha" : "Krishna Paksha";
// // //         const tithi =
// // //             elong < 180 ? SHUKLA[tithiIndex] : KRISHNA[tithiIndex - 15];

// // //         const nakshatra =
// // //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];

// // //         const lastAma = findAmavasya(simJD, "back");
// // //         const nextAma = findAmavasya(simJD, "forward");

// // //         let maasam = "—";
// // //         if (lastAma && nextAma) {
// // //             const lastR = Math.floor(sunLon(lastAma) / 30);
// // //             const nextR = Math.floor(sunLon(nextAma) / 30);
// // //             const idx = (lastR + 1) % 12;
// // //             maasam =
// // //                 lastR === nextR
// // //                     ? "Adhika " + AMANTA_MAASAMS[idx]
// // //                     : AMANTA_MAASAMS[idx];
// // //         }

// // //         const rasi = RASIS[Math.floor(sun / 30)];

// // //         onUpdate({
// // //             date: fromJD(simJD).toUTCString(),
// // //             tithi,
// // //             paksha,
// // //             nakshatra,
// // //             maasam,
// // //             rasi
// // //         });

// // //         earthOrbit.current.rotation.y = THREE.MathUtils.degToRad(sun);
// // //         moonOrbit.current.rotation.y = THREE.MathUtils.degToRad(elong + 180);

// // //         const moonPos = new THREE.Vector3();
// // //         moon.current.getWorldPosition(moonPos);

// // //         sunLight.current.position.copy(
// // //             moonPos.clone().normalize().multiplyScalar(-20)
// // //         );
// // //         sunLight.current.target.position.copy(moonPos);
// // //         sunLight.current.target.updateMatrixWorld();
// // //     });

// // //     return (
// // //         <>
// // //             <mesh>
// // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // //                 <meshBasicMaterial color="orange" />
// // //             </mesh>

// // //             <directionalLight ref={sunLight} intensity={2.5} />
// // //             <ambientLight intensity={0.06} />

// // //             <group ref={earthOrbit}>
// // //                 <mesh position={[6, 0, 0]}>
// // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // //                     <meshStandardMaterial color="#2a6bd4" />
// // //                 </mesh>

// // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // //                         <meshStandardMaterial color="#ddd" />
// // //                     </mesh>
// // //                 </group>
// // //             </group>

// // //             <Grid
// // //                 args={[25, 25]}
// // //                 position={[0, -0.01, 0]}
// // //                 rotation={[-Math.PI / 2, 0, 0]}
// // //             />
// // //         </>
// // //     );
// // // }

// // // /* ===================== APP ===================== */

// // // export default function Panchanga3D() {
// // //     const [data, setData] = useState({});
// // //     const [paused, setPaused] = useState(false);
// // //     const [speed, setSpeed] = useState(1);

// // //     const nowJD = toJD(Date.now());
// // //     const [anchorJD, setAnchorJD] = useState(nowJD);
// // //     const [scrubDays, setScrubDays] = useState(0);

// // //     useEffect(() => {
// // //         setScrubDays(Math.round(anchorJD - nowJD));
// // //     }, [anchorJD]);

// // //     const YEARS = 10000;

// // //     /* 🔑 anchor date string for calendar UI */
// // //     const anchorDateStr = fromJD(anchorJD)
// // //         .toISOString()
// // //         .slice(0, 10);

// // //     const handleDatePick = e => {
// // //         const date = new Date(e.target.value + "T00:00:00Z");
// // //         setAnchorJD(toJD(date.getTime()));
// // //     };

// // //     return (
// // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // //                 <SolarSystem
// // //                     speed={speed}
// // //                     paused={paused}
// // //                     anchorJD={anchorJD}
// // //                     onUpdate={setData}
// // //                 />
// // //                 <OrbitControls />
// // //             </Canvas>

// // //             <div
// // //                 style={{
// // //                     position: "absolute",
// // //                     top: 20,
// // //                     left: 20,
// // //                     color: "white",
// // //                     background: "rgba(0,0,0,0.78)",
// // //                     padding: 18,
// // //                     borderRadius: 14,
// // //                     width: 440
// // //                 }}
// // //             >
// // //                 <div><b>Simulation Date (UTC)</b></div>
// // //                 <div style={{ marginBottom: 8 }}>{data.date}</div>

// // //                 <div><b>Tithi:</b> {data.tithi}</div>
// // //                 <div><b>Paksha:</b> {data.paksha}</div>
// // //                 <div><b>Nakshatra:</b> {data.nakshatra}</div>
// // //                 <div><b>Rāśi:</b> {data.rasi}</div>
// // //                 <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// // //                     Āmānta Māsa: {data.maasam}
// // //                 </div>

// // //                 {/* DATE PICKER */}
// // //                 <div style={{ marginTop: 14 }}>
// // //                     <div><b>Anchor Calendar Date (UTC)</b></div>
// // //                     <input
// // //                         type="date"
// // //                         value={anchorDateStr}
// // //                         onChange={handleDatePick}
// // //                         style={{
// // //                             width: "100%",
// // //                             marginTop: 6,
// // //                             padding: "6px 8px",
// // //                             borderRadius: 8,
// // //                             border: "1px solid #ccc",
// // //                             background: "#ffffff",
// // //                             color: "#000000",
// // //                             colorScheme: "light"
// // //                         }}
// // //                     />
// // //                 </div>

// // //                 <button
// // //                     onClick={() => setPaused(!paused)}
// // //                     style={{
// // //                         width: "100%",
// // //                         marginTop: 12,
// // //                         padding: "8px 0",
// // //                         borderRadius: 10,
// // //                         border: "none",
// // //                         background: paused ? "#00cc88" : "#ff4444",
// // //                         color: "white",
// // //                         fontWeight: "bold"
// // //                     }}
// // //                 >
// // //                     {paused ? "▶ Resume Simulation" : "⏸ Pause Simulation"}
// // //                 </button>

// // //                 <div style={{ marginTop: 14 }}>
// // //                     <div><b>Time Scrub (Days from Today)</b></div>
// // //                     <div style={{ fontSize: 12, opacity: 0.8 }}>
// // //                         ±{YEARS.toLocaleString()} years
// // //                     </div>
// // //                     <input
// // //                         type="range"
// // //                         min={-YEARS * 365}
// // //                         max={YEARS * 365}
// // //                         step={1}
// // //                         value={scrubDays}
// // //                         onChange={e => setAnchorJD(nowJD + +e.target.value)}
// // //                         style={{ width: "100%" }}
// // //                     />
// // //                 </div>

// // //                 <div style={{ marginTop: 14 }}>
// // //                     <div><b>Simulation Speed</b></div>
// // //                     <div style={{ fontSize: 12, opacity: 0.8 }}>
// // //                         Days per second
// // //                     </div>
// // //                     <input
// // //                         type="range"
// // //                         min="0.05"
// // //                         max="20"
// // //                         step="0.05"
// // //                         value={speed}
// // //                         onChange={e => setSpeed(+e.target.value)}
// // //                         style={{ width: "100%" }}
// // //                     />
// // //                     <div style={{ fontSize: 12 }}>
// // //                         {speed.toFixed(2)} days / second
// // //                     </div>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }


// // // // // /// adhika masamulu in the past working but samvatsara not correctly aligned ///
// // // // import React, { useRef, useState, useEffect } from "react";
// // // // import { Canvas, useFrame } from "@react-three/fiber";
// // // // import { OrbitControls, Grid } from "@react-three/drei";
// // // // import * as THREE from "three";

// // // // /* ===================== CONSTANTS ===================== */

// // // // const AYANAMSA = 24.0; // Lahiri approx

// // // // const SHUKLA = [
// // // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // // //     "Trayodashi", "Chaturdashi", "Pournami"
// // // // ];

// // // // const KRISHNA = [
// // // //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// // // //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// // // //     "Trayodashi", "Chaturdashi", "Amavasya"
// // // // ];

// // // // const NAKSHATRAS = [
// // // //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// // // //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// // // //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// // // //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// // // //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// // // //     "Uttara Bhadrapada", "Revati"
// // // // ];

// // // // const AMANTA_MAASAMS = [
// // // //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// // // //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// // // //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // // // ];

// // // // const RASIS = [
// // // //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// // // //     "Simha", "Kanya", "Tula", "Vrischika",
// // // //     "Dhanu", "Makara", "Kumbha", "Meena"
// // // // ];

// // // // const SAMVATSARAS = [
// // // //     "Prabhava", "Vibhava", "Shukla", "Pramodoota", "Prajotpatti", "Angirasa",
// // // //     "Shrimukha", "Bhava", "Yuva", "Dhata", "Ishvara", "Bahudhanya",
// // // //     "Pramathi", "Vikrama", "Vrisha", "Chitrabhanu", "Svabhanu", "Tarana",
// // // //     "Parthiva", "Vyaya", "Sarvajit", "Sarvadhari", "Virodhi", "Vikruti",
// // // //     "Khara", "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukhi",
// // // //     "Hevilambi", "Vilambi", "Vikari", "Sharvari", "Plava", "Shubhakrit",
// // // //     "Shobhakrit", "Krodhi", "Vishvavasu", "Parabhava", "Plavanga",
// // // //     "Kilaka", "Saumya", "Sadharana", "Virodhikrit", "Paridhavi",
// // // //     "Pramadicha", "Ananda", "Rakshasa", "Nala", "Pingala", "Kalayukti",
// // // //     "Siddharthi", "Raudra", "Durmati", "Dundubhi", "Rudhirodgari",
// // // //     "Raktakshi", "Krodhana", "Akshaya"
// // // // ];

// // // // /* ===================== TIME HELPERS ===================== */

// // // // const toJD = ms => ms / 86400000 + 2440587.5;
// // // // const fromJD = jd => new Date((jd - 2440587.5) * 86400000);
// // // // const norm = d => (d % 360 + 360) % 360;

// // // // /* ===================== EPHEMERIS (MEEUS STYLE) ===================== */

// // // // function sunLon(jd) {
// // // //     const T = (jd - 2451545) / 36525;
// // // //     const L0 = 280.46646 + 36000.76983 * T;
// // // //     const M = 357.52911 + 35999.05029 * T;
// // // //     const C =
// // // //         (1.914602 - 0.004817 * T) * Math.sin(THREE.MathUtils.degToRad(M)) +
// // // //         0.019993 * Math.sin(2 * THREE.MathUtils.degToRad(M));
// // // //     return norm(L0 + C - AYANAMSA);
// // // // }

// // // // function moonLon(jd) {
// // // //     const T = (jd - 2451545) / 36525;
// // // //     const L0 = 218.3164477 + 481267.88123421 * T;
// // // //     const D = 297.8501921 + 445267.1114034 * T;
// // // //     const M = 357.5291092 + 35999.0502909 * T;
// // // //     const Mp = 134.9633964 + 477198.8675055 * T;

// // // //     const lon =
// // // //         L0 +
// // // //         6.289 * Math.sin(THREE.MathUtils.degToRad(Mp)) +
// // // //         1.274 * Math.sin(THREE.MathUtils.degToRad(2 * D - Mp)) +
// // // //         0.658 * Math.sin(THREE.MathUtils.degToRad(2 * D)) +
// // // //         0.214 * Math.sin(THREE.MathUtils.degToRad(2 * Mp)) -
// // // //         0.186 * Math.sin(THREE.MathUtils.degToRad(M));

// // // //     return norm(lon - AYANAMSA);
// // // // }

// // // // /* ===================== AMAVASYA SEARCH ===================== */

// // // // function findAmavasya(jd, dir) {
// // // //     const step = dir === "back" ? -1 / 24 : 1 / 24;
// // // //     let prev = norm(moonLon(jd) - sunLon(jd));

// // // //     for (let i = 0; i < 45 * 24; i++) {
// // // //         jd += step;
// // // //         const e = norm(moonLon(jd) - sunLon(jd));
// // // //         if (dir === "back" && prev < 10 && e > 350) return jd;
// // // //         if (dir === "forward" && prev > 350 && e < 10) return jd;
// // // //         prev = e;
// // // //     }
// // // //     return null;
// // // // }

// // // // /* ===================== SAMVATSARA ===================== */

// // // // function samvatsaraName(jd, maasam) {
// // // //     const y = fromJD(jd).getUTCFullYear();
// // // //     const base = 1987; // Prabhava year reference
// // // //     const offset = (y - base) % 60;
// // // //     return SAMVATSARAS[(offset + 60) % 60];
// // // // }

// // // // /* ===================== SCENE ===================== */

// // // // function SolarSystem({ speed, paused, anchorJD, onUpdate }) {
// // // //     const earthOrbit = useRef();
// // // //     const moonOrbit = useRef();
// // // //     const moon = useRef();
// // // //     const sunLight = useRef();

// // // //     const elapsedSim = useRef(0);
// // // //     const lastFrame = useRef(null);

// // // //     useEffect(() => {
// // // //         elapsedSim.current = 0;
// // // //     }, [anchorJD]);

// // // //     useFrame(({ clock }) => {
// // // //         const now = clock.getElapsedTime();
// // // //         if (lastFrame.current === null) {
// // // //             lastFrame.current = now;
// // // //             return;
// // // //         }

// // // //         const delta = now - lastFrame.current;
// // // //         lastFrame.current = now;

// // // //         if (!paused) elapsedSim.current += delta * speed;
// // // //         const simJD = anchorJD + elapsedSim.current;

// // // //         const sun = sunLon(simJD);
// // // //         const moonL = moonLon(simJD);
// // // //         const elong = norm(moonL - sun);

// // // //         const tithiIndex = Math.floor(elong / 12);
// // // //         const paksha = elong < 180 ? "Shukla Paksha" : "Krishna Paksha";
// // // //         const tithi =
// // // //             elong < 180 ? SHUKLA[tithiIndex] : KRISHNA[tithiIndex - 15];

// // // //         const nakshatra =
// // // //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];

// // // //         const lastAma = findAmavasya(simJD, "back");
// // // //         const nextAma = findAmavasya(simJD, "forward");

// // // //         let maasam = "—";
// // // //         if (lastAma && nextAma) {
// // // //             const lastR = Math.floor(sunLon(lastAma) / 30);
// // // //             const nextR = Math.floor(sunLon(nextAma) / 30);
// // // //             const idx = (lastR + 1) % 12;
// // // //             maasam =
// // // //                 lastR === nextR
// // // //                     ? "Adhika " + AMANTA_MAASAMS[idx]
// // // //                     : AMANTA_MAASAMS[idx];
// // // //         }

// // // //         const rasi = RASIS[Math.floor(sun / 30)];
// // // //         const samvatsara = samvatsaraName(simJD, maasam);

// // // //         onUpdate({
// // // //             date: fromJD(simJD).toUTCString(),
// // // //             tithi,
// // // //             paksha,
// // // //             nakshatra,
// // // //             maasam,
// // // //             rasi,
// // // //             samvatsara
// // // //         });

// // // //         earthOrbit.current.rotation.y = THREE.MathUtils.degToRad(sun);
// // // //         moonOrbit.current.rotation.y = THREE.MathUtils.degToRad(elong + 180);

// // // //         const moonPos = new THREE.Vector3();
// // // //         moon.current.getWorldPosition(moonPos);

// // // //         sunLight.current.position.copy(
// // // //             moonPos.clone().normalize().multiplyScalar(-20)
// // // //         );
// // // //         sunLight.current.target.position.copy(moonPos);
// // // //         sunLight.current.target.updateMatrixWorld();
// // // //     });

// // // //     return (
// // // //         <>
// // // //             <mesh>
// // // //                 <sphereGeometry args={[1.2, 32, 32]} />
// // // //                 <meshBasicMaterial color="orange" />
// // // //             </mesh>

// // // //             <directionalLight ref={sunLight} intensity={2.5} />
// // // //             <ambientLight intensity={0.06} />

// // // //             <group ref={earthOrbit}>
// // // //                 <mesh position={[6, 0, 0]}>
// // // //                     <sphereGeometry args={[0.5, 32, 32]} />
// // // //                     <meshStandardMaterial color="#2a6bd4" />
// // // //                 </mesh>

// // // //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// // // //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// // // //                         <sphereGeometry args={[0.22, 32, 32]} />
// // // //                         <meshStandardMaterial color="#ddd" />
// // // //                     </mesh>
// // // //                 </group>
// // // //             </group>

// // // //             <Grid
// // // //                 args={[25, 25]}
// // // //                 position={[0, -0.01, 0]}
// // // //                 rotation={[-Math.PI / 2, 0, 0]}
// // // //             />
// // // //         </>
// // // //     );
// // // // }

// // // // /* ===================== APP ===================== */

// // // // export default function Panchanga3D() {
// // // //     const [data, setData] = useState({});
// // // //     const [paused, setPaused] = useState(false);
// // // //     const [speed, setSpeed] = useState(1);

// // // //     const nowJD = toJD(Date.now());
// // // //     const [anchorJD, setAnchorJD] = useState(nowJD);
// // // //     const [scrubDays, setScrubDays] = useState(0);

// // // //     useEffect(() => {
// // // //         setScrubDays(Math.round(anchorJD - nowJD));
// // // //     }, [anchorJD]);

// // // //     const YEARS = 10000;

// // // //     const anchorDateStr = fromJD(anchorJD)
// // // //         .toISOString()
// // // //         .slice(0, 10);

// // // //     const handleDatePick = e => {
// // // //         const date = new Date(e.target.value + "T00:00:00Z");
// // // //         setAnchorJD(toJD(date.getTime()));
// // // //     };

// // // //     return (
// // // //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// // // //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// // // //                 <SolarSystem
// // // //                     speed={speed}
// // // //                     paused={paused}
// // // //                     anchorJD={anchorJD}
// // // //                     onUpdate={setData}
// // // //                 />
// // // //                 <OrbitControls />
// // // //             </Canvas>

// // // //             <div
// // // //                 style={{
// // // //                     position: "absolute",
// // // //                     top: 20,
// // // //                     left: 20,
// // // //                     color: "white",
// // // //                     background: "rgba(0,0,0,0.78)",
// // // //                     padding: 18,
// // // //                     borderRadius: 14,
// // // //                     width: 440
// // // //                 }}
// // // //             >
// // // //                 <div><b>Simulation Date (UTC)</b></div>
// // // //                 <div style={{ marginBottom: 8 }}>{data.date}</div>

// // // //                 <div><b>Tithi:</b> {data.tithi}</div>
// // // //                 <div><b>Paksha:</b> {data.paksha}</div>
// // // //                 <div><b>Nakshatra:</b> {data.nakshatra}</div>
// // // //                 <div><b>Rāśi:</b> {data.rasi}</div>
// // // //                 <div><b>Samvatsara:</b> {data.samvatsara}</div>
// // // //                 <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// // // //                     Āmānta Māsa: {data.maasam}
// // // //                 </div>

// // // //                 <div style={{ marginTop: 14 }}>
// // // //                     <div><b>Anchor Calendar Date (UTC)</b></div>
// // // //                     <input
// // // //                         type="date"
// // // //                         value={anchorDateStr}
// // // //                         onChange={handleDatePick}
// // // //                         style={{
// // // //                             width: "100%",
// // // //                             marginTop: 6,
// // // //                             padding: "6px 8px",
// // // //                             borderRadius: 8,
// // // //                             border: "1px solid #ccc",
// // // //                             background: "#ffffff",
// // // //                             color: "#000000"
// // // //                         }}
// // // //                     />
// // // //                 </div>

// // // //                 <button
// // // //                     onClick={() => setPaused(!paused)}
// // // //                     style={{
// // // //                         width: "100%",
// // // //                         marginTop: 12,
// // // //                         padding: "8px 0",
// // // //                         borderRadius: 10,
// // // //                         border: "none",
// // // //                         background: paused ? "#00cc88" : "#ff4444",
// // // //                         color: "white",
// // // //                         fontWeight: "bold"
// // // //                     }}
// // // //                 >
// // // //                     {paused ? "▶ Resume Simulation" : "⏸ Pause Simulation"}
// // // //                 </button>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }

// // // /// v2.0.8.1 tmp, correct year names but adhika labels gone ///
// // import React, { useRef, useState, useEffect } from "react";
// // import { Canvas, useFrame } from "@react-three/fiber";
// // import { OrbitControls, Grid } from "@react-three/drei";
// // import * as THREE from "three";

// // /* ===================== CONSTANTS ===================== */

// // const AYANAMSA = 24.0;

// // const SHUKLA = [
// //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// //     "Trayodashi", "Chaturdashi", "Pournami"
// // ];

// // const KRISHNA = [
// //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// //     "Trayodashi", "Chaturdashi", "Amavasya"
// // ];

// // const NAKSHATRAS = [
// //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// //     "Uttara Bhadrapada", "Revati"
// // ];

// // const AMANTA_MAASAMS = [
// //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // ];

// // const RASIS = [
// //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// //     "Simha", "Kanya", "Tula", "Vrischika",
// //     "Dhanu", "Makara", "Kumbha", "Meena"
// // ];

// // /* 🔑 Samvatsara cycle */
// // const SAMVATSARAS = [
// //     "Prabhava", "Vibhava", "Shukla", "Pramodoota", "Prajotpatti", "Angirasa",
// //     "Shrimukha", "Bhava", "Yuva", "Dhata", "Ishvara", "Bahudhanya",
// //     "Pramathi", "Vikrama", "Vrisha", "Chitrabhanu", "Svabhanu", "Tarana",
// //     "Parthiva", "Vyaya", "Sarvajit", "Sarvadhari", "Virodhi", "Vikruti",
// //     "Khara", "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukhi",
// //     "Hevilambi", "Vilambi", "Vikari", "Sharvari", "Plava", "Shubhakrit",
// //     "Shobhakrit", "Krodhi", "Vishvavasu", "Parabhava", "Plavanga",
// //     "Kilaka", "Saumya", "Sadharana", "Virodhikrit", "Paridhavi",
// //     "Pramadicha", "Ananda", "Rakshasa", "Nala", "Pingala", "Kalayukti",
// //     "Siddharthi", "Raudra", "Durmati", "Dundubhi", "Rudhirodgari",
// //     "Raktakshi", "Krodhana", "Akshaya"
// // ];

// // /* ===================== ASTRONOMY ===================== */

// // const toJD = ms => ms / 86400000 + 2440587.5;
// // const fromJD = jd => new Date((jd - 2440587.5) * 86400000);
// // const norm = d => (d % 360 + 360) % 360;

// // const sunLon = jd =>
// //     norm(280.46 + 0.9856474 * (jd - 2451545) - AYANAMSA);

// // const moonLon = jd =>
// //     norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);

// // /* ===================== AMAVASYA ===================== */

// // function findAmavasya(jd, dir) {
// //     const step = dir === "back" ? -1 / 24 : 1 / 24;
// //     let prev = norm(moonLon(jd) - sunLon(jd));

// //     for (let i = 0; i < 45 * 24; i++) {
// //         jd += step;
// //         const e = norm(moonLon(jd) - sunLon(jd));
// //         if (dir === "back" && prev < 10 && e > 350) return jd;
// //         if (dir === "forward" && prev > 350 && e < 10) return jd;
// //         prev = e;
// //     }
// //     return null;
// // }

// // /* ===================== SAMVATSARA (FAST & CORRECT) ===================== */

// // /**
// //  * Anchor:
// //  * Mesha Saṅkrānti 2007 (sidereal) ≈ JD 2454200
// //  * Samvatsaram = Sarvajit
// //  */
// // const SAMVATSARA_ANCHOR_JD = 2454200;
// // const SAMVATSARA_ANCHOR_INDEX = SAMVATSARAS.indexOf("Sarvajit");

// // function samvatsaraName(jd) {
// //     const siderealYears =
// //         Math.floor((jd - SAMVATSARA_ANCHOR_JD) / 365.25636);
// //     const idx = (SAMVATSARA_ANCHOR_INDEX + siderealYears) % 60;
// //     return SAMVATSARAS[(idx + 60) % 60];
// // }

// // /* ===================== SCENE ===================== */

// // function SolarSystem({ speed, paused, anchorJD, onUpdate }) {
// //     const earthOrbit = useRef();
// //     const moonOrbit = useRef();
// //     const moon = useRef();
// //     const sunLight = useRef();

// //     const elapsedSim = useRef(0);
// //     const lastFrame = useRef(null);

// //     useEffect(() => {
// //         elapsedSim.current = 0;
// //     }, [anchorJD]);

// //     useFrame(({ clock }) => {
// //         const now = clock.getElapsedTime();
// //         if (lastFrame.current === null) {
// //             lastFrame.current = now;
// //             return;
// //         }

// //         const delta = now - lastFrame.current;
// //         lastFrame.current = now;

// //         if (!paused) elapsedSim.current += delta * speed;
// //         const simJD = anchorJD + elapsedSim.current;

// //         const sun = sunLon(simJD);
// //         const moonL = moonLon(simJD);
// //         const elong = norm(moonL - sun);

// //         const tithiIndex = Math.floor(elong / 12);
// //         const paksha = elong < 180 ? "Shukla Paksha" : "Krishna Paksha";
// //         const tithi =
// //             elong < 180 ? SHUKLA[tithiIndex] : KRISHNA[tithiIndex - 15];

// //         const nakshatra =
// //             NAKSHATRAS[Math.floor(moonL / (360 / 27))];

// //         const lastAma = findAmavasya(simJD, "back");
// //         const nextAma = findAmavasya(simJD, "forward");

// //         let maasam = "—";
// //         if (lastAma && nextAma) {
// //             const lastR = Math.floor(sunLon(lastAma) / 30);
// //             const nextR = Math.floor(sunLon(nextAma) / 30);
// //             const idx = (lastR + 1) % 12;
// //             maasam =
// //                 lastR === nextR
// //                     ? "Adhika " + AMANTA_MAASAMS[idx]
// //                     : AMANTA_MAASAMS[idx];
// //         }

// //         const rasi = RASIS[Math.floor(sun / 30)];
// //         const samvatsara = samvatsaraName(simJD);

// //         onUpdate({
// //             date: fromJD(simJD).toUTCString(),
// //             tithi,
// //             paksha,
// //             nakshatra,
// //             maasam,
// //             rasi,
// //             samvatsara
// //         });

// //         earthOrbit.current.rotation.y = THREE.MathUtils.degToRad(sun);
// //         moonOrbit.current.rotation.y = THREE.MathUtils.degToRad(elong + 180);

// //         const moonPos = new THREE.Vector3();
// //         moon.current.getWorldPosition(moonPos);

// //         sunLight.current.position.copy(
// //             moonPos.clone().normalize().multiplyScalar(-20)
// //         );
// //         sunLight.current.target.position.copy(moonPos);
// //         sunLight.current.target.updateMatrixWorld();
// //     });

// //     return (
// //         <>
// //             <mesh>
// //                 <sphereGeometry args={[1.2, 32, 32]} />
// //                 <meshBasicMaterial color="orange" />
// //             </mesh>

// //             <directionalLight ref={sunLight} intensity={2.5} />
// //             <ambientLight intensity={0.06} />

// //             <group ref={earthOrbit}>
// //                 <mesh position={[6, 0, 0]}>
// //                     <sphereGeometry args={[0.5, 32, 32]} />
// //                     <meshStandardMaterial color="#2a6bd4" />
// //                 </mesh>

// //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// //                         <sphereGeometry args={[0.22, 32, 32]} />
// //                         <meshStandardMaterial color="#ddd" />
// //                     </mesh>
// //                 </group>
// //             </group>

// //             <Grid
// //                 args={[25, 25]}
// //                 position={[0, -0.01, 0]}
// //                 rotation={[-Math.PI / 2, 0, 0]}
// //             />
// //         </>
// //     );
// // }

// // /* ===================== APP ===================== */

// // export default function Panchanga3D() {
// //     const [data, setData] = useState({});
// //     const [paused, setPaused] = useState(false);
// //     const [speed, setSpeed] = useState(1);

// //     const nowJD = toJD(Date.now());
// //     const [anchorJD, setAnchorJD] = useState(nowJD);
// //     const [scrubDays, setScrubDays] = useState(0);

// //     useEffect(() => {
// //         setScrubDays(Math.round(anchorJD - nowJD));
// //     }, [anchorJD]);

// //     const YEARS = 10000;

// //     const anchorDateStr = fromJD(anchorJD)
// //         .toISOString()
// //         .slice(0, 10);

// //     const handleDatePick = e => {
// //         const date = new Date(e.target.value + "T00:00:00Z");
// //         setAnchorJD(toJD(date.getTime()));
// //     };

// //     return (
// //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// //                 <SolarSystem
// //                     speed={speed}
// //                     paused={paused}
// //                     anchorJD={anchorJD}
// //                     onUpdate={setData}
// //                 />
// //                 <OrbitControls />
// //             </Canvas>

// //             <div
// //                 style={{
// //                     position: "absolute",
// //                     top: 20,
// //                     left: 20,
// //                     color: "white",
// //                     background: "rgba(0,0,0,0.78)",
// //                     padding: 18,
// //                     borderRadius: 14,
// //                     width: 440
// //                 }}
// //             >
// //                 <div><b>Simulation Date (UTC)</b></div>
// //                 <div style={{ marginBottom: 8 }}>{data.date}</div>

// //                 <div><b>Tithi:</b> {data.tithi}</div>
// //                 <div><b>Paksha:</b> {data.paksha}</div>
// //                 <div><b>Nakshatra:</b> {data.nakshatra}</div>
// //                 <div><b>Rāśi:</b> {data.rasi}</div>
// //                 <div><b>Samvatsara:</b> {data.samvatsara}</div>

// //                 <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
// //                     Āmānta Māsa: {data.maasam}
// //                 </div>

// //                 {/* DATE PICKER */}
// //                 <div style={{ marginTop: 14 }}>
// //                     <div><b>Anchor Calendar Date (UTC)</b></div>
// //                     <input
// //                         type="date"
// //                         value={anchorDateStr}
// //                         onChange={handleDatePick}
// //                         style={{
// //                             width: "100%",
// //                             marginTop: 6,
// //                             padding: "6px 8px",
// //                             borderRadius: 8,
// //                             border: "1px solid #ccc",
// //                             background: "#ffffff",
// //                             color: "#000000",
// //                             colorScheme: "light"
// //                         }}
// //                     />
// //                 </div>

// //                 <button
// //                     onClick={() => setPaused(!paused)}
// //                     style={{
// //                         width: "100%",
// //                         marginTop: 12,
// //                         padding: "8px 0",
// //                         borderRadius: 10,
// //                         border: "none",
// //                         background: paused ? "#00cc88" : "#ff4444",
// //                         color: "white",
// //                         fontWeight: "bold"
// //                     }}
// //                 >
// //                     {paused ? "▶ Resume Simulation" : "⏸ Pause Simulation"}
// //                 </button>

// //                 <div style={{ marginTop: 14 }}>
// //                     <div><b>Time Scrub (Days from Today)</b></div>
// //                     <div style={{ fontSize: 12, opacity: 0.8 }}>
// //                         ±{YEARS.toLocaleString()} years
// //                     </div>
// //                     <input
// //                         type="range"
// //                         min={-YEARS * 365}
// //                         max={YEARS * 365}
// //                         step={1}
// //                         value={scrubDays}
// //                         onChange={e => setAnchorJD(nowJD + +e.target.value)}
// //                         style={{ width: "100%" }}
// //                     />
// //                 </div>

// //                 <div style={{ marginTop: 14 }}>
// //                     <div><b>Simulation Speed</b></div>
// //                     <div style={{ fontSize: 12, opacity: 0.8 }}>
// //                         Days per second
// //                     </div>
// //                     <input
// //                         type="range"
// //                         min="0.05"
// //                         max="20"
// //                         step="0.05"
// //                         value={speed}
// //                         onChange={e => setSpeed(+e.target.value)}
// //                         style={{ width: "100%" }}
// //                     />
// //                     <div style={{ fontSize: 12 }}>
// //                         {speed.toFixed(2)} days / second
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }


// // /////*****/////

// // import React, { useRef, useState, useEffect } from "react";
// // import { Canvas, useFrame } from "@react-three/fiber";
// // import { OrbitControls, Grid } from "@react-three/drei";
// // import * as THREE from "three";

// // /* ===================== LOCATION (PHASE 1 FIXED) ===================== */
// // // Hyderabad, India
// // const LAT = 17.3850;
// // const LON = 78.4867;
// // const IST_OFFSET = 5.5 / 24;

// // /* ===================== CONSTANTS ===================== */

// // const DEG = Math.PI / 180;

// // const SHUKLA = [
// //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// //     "Trayodashi", "Chaturdashi", "Pournami"
// // ];

// // const KRISHNA = [
// //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// //     "Trayodashi", "Chaturdashi", "Amavasya"
// // ];

// // const NAKSHATRAS = [
// //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// //     "Uttara Bhadrapada", "Revati"
// // ];

// // const AMANTA_MAASAMS = [
// //     "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha",
// //     "Shravana", "Bhadrapada", "Ashwayuja", "Kartika",
// //     "Margashirsha", "Pushya", "Magha", "Phalguna"
// // ];

// // const RASIS = [
// //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// //     "Simha", "Kanya", "Tula", "Vrischika",
// //     "Dhanu", "Makara", "Kumbha", "Meena"
// // ];

// // const SAMVATSARAS = [
// //     "Prabhava", "Vibhava", "Shukla", "Pramodoota", "Prajotpatti", "Angirasa",
// //     "Shrimukha", "Bhava", "Yuva", "Dhata", "Ishvara", "Bahudhanya",
// //     "Pramathi", "Vikrama", "Vrisha", "Chitrabhanu", "Svabhanu", "Tarana",
// //     "Parthiva", "Vyaya", "Sarvajit", "Sarvadhari", "Virodhi", "Vikruti",
// //     "Khara", "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukhi",
// //     "Hevilambi", "Vilambi", "Vikari", "Sharvari", "Plava", "Shubhakrit",
// //     "Shobhakrit", "Krodhi", "Vishvavasu", "Parabhava", "Plavanga",
// //     "Kilaka", "Saumya", "Sadharana", "Virodhikrit", "Paridhavi",
// //     "Pramadicha", "Ananda", "Rakshasa", "Nala", "Pingala", "Kalayukti",
// //     "Siddharthi", "Raudra", "Durmati", "Dundubhi", "Rudhirodgari",
// //     "Raktakshi", "Krodhana", "Akshaya"
// // ];

// // /* ===================== TIME ===================== */

// // const toJD = ms => ms / 86400000 + 2440587.5;
// // const fromJD = jd => new Date((jd - 2440587.5) * 86400000);
// // const norm = d => (d % 360 + 360) % 360;

// // /* ===================== AYANAMSA (LAHIRI – GOVT OF INDIA) ===================== */

// // function lahiriAyanamsa(jd) {
// //     const T = (jd - 2451545.0) / 36525;
// //     return 22.460148 + 1.396042 * T + 0.000087 * T * T;
// // }

// // /* ===================== TRUE SUN & MOON (MEEUS – STABLE) ===================== */

// // function sunLon(jd) {
// //     const T = (jd - 2451545.0) / 36525;
// //     const L0 = norm(280.46646 + 36000.76983 * T);
// //     const M = norm(357.52911 + 35999.05029 * T);
// //     const C = (1.914602 - 0.004817 * T) * Math.sin(M * DEG)
// //         + 0.019993 * Math.sin(2 * M * DEG);
// //     return norm(L0 + C - lahiriAyanamsa(jd));
// // }

// // function moonLon(jd) {
// //     const T = (jd - 2451545.0) / 36525;
// //     const L0 = norm(218.316 + 481267.881 * T);
// //     const M = norm(134.963 + 477198.867 * T);
// //     const D = norm(297.850 + 445267.111 * T);
// //     const lon = L0
// //         + 6.289 * Math.sin(M * DEG)
// //         + 1.274 * Math.sin((2 * D - M) * DEG)
// //         + 0.658 * Math.sin(2 * D * DEG);
// //     return norm(lon - lahiriAyanamsa(jd));
// // }

// // /* ===================== PRECISE AMAVASYA (BINARY ROOT) ===================== */

// // function findAmavasya(jd, dir) {
// //     let a = jd + (dir === "back" ? -2 : 0);
// //     let b = jd + (dir === "back" ? 0 : 2);

// //     for (let i = 0; i < 40; i++) {
// //         const m = (a + b) / 2;
// //         const e = norm(moonLon(m) - sunLon(m));
// //         if (e < 180) b = m; else a = m;
// //     }
// //     return (a + b) / 2;
// // }

// // /* ===================== TRUE SUNRISE (HYDERABAD) ===================== */

// // function sunriseJD(jd) {
// //     const d = Math.floor(jd - 0.5) + 0.5;
// //     const n = d - 2451545.0 + 0.0008;
// //     const Jstar = n - LON / 360;
// //     const M = norm(357.5291 + 0.98560028 * Jstar);
// //     const C = 1.9148 * Math.sin(M * DEG);
// //     const lambda = norm(M + C + 180 + 102.9372);
// //     const delta = Math.asin(Math.sin(lambda * DEG) * Math.sin(23.44 * DEG));
// //     const H = Math.acos(
// //         (Math.sin(-0.83 * DEG) - Math.sin(LAT * DEG) * Math.sin(delta)) /
// //         (Math.cos(LAT * DEG) * Math.cos(delta))
// //     );
// //     return 2451545.0 + Jstar + H / (2 * Math.PI) + IST_OFFSET;
// // }

// // /* ===================== SAMVATSARA (UGADI ANCHORED) ===================== */

// // const UGADI_1987 = toJD(Date.UTC(1987, 2, 29)); // Chaitra Shukla Prathama
// // const UGADI_INDEX = SAMVATSARAS.indexOf("Prabhava");

// // function samvatsaraName(jd) {
// //     let count = 0;
// //     let t = UGADI_1987;

// //     if (jd >= t) {
// //         while (true) {
// //             const ama = findAmavasya(t + 25, "forward");
// //             const sr = sunriseJD(ama + 1);
// //             const elong = norm(moonLon(sr) - sunLon(sr));
// //             if (elong < 12) {
// //                 if (sr > jd) break;
// //                 count++;
// //             }
// //             t = sr + 1;
// //         }
// //     } else {
// //         while (true) {
// //             const ama = findAmavasya(t - 25, "back");
// //             const sr = sunriseJD(ama + 1);
// //             const elong = norm(moonLon(sr) - sunLon(sr));
// //             if (elong < 12) {
// //                 if (sr < jd) break;
// //                 count--;
// //             }
// //             t = sr - 1;
// //         }
// //     }

// //     return SAMVATSARAS[(UGADI_INDEX + count + 60) % 60];
// // }

// // /* ===================== SCENE ===================== */

// // function SolarSystem({ speed, paused, anchorJD, onUpdate }) {
// //     const earthOrbit = useRef();
// //     const moonOrbit = useRef();

// //     const elapsed = useRef(0);

// //     useFrame((_, delta) => {
// //         if (!paused) elapsed.current += delta * speed;
// //         const jd = anchorJD + elapsed.current;

// //         const sun = sunLon(jd);
// //         const moon = moonLon(jd);
// //         const elong = norm(moon - sun);

// //         const tithiIndex = Math.floor(elong / 12);
// //         const paksha = elong < 180 ? "Shukla Paksha" : "Krishna Paksha";
// //         const tithi = elong < 180 ? SHUKLA[tithiIndex] : KRISHNA[tithiIndex - 15];

// //         const nakshatra = NAKSHATRAS[Math.floor(moon / (360 / 27))];
// //         const rasi = RASIS[Math.floor(sun / 30)];

// //         const lastAma = findAmavasya(jd, "back");
// //         const nextAma = findAmavasya(jd, "forward");
// //         const r1 = Math.floor(sunLon(lastAma) / 30);
// //         const r2 = Math.floor(sunLon(nextAma) / 30);
// //         const maasam = r1 === r2 ? `Adhika ${AMANTA_MAASAMS[(r1 + 1) % 12]}`
// //             : AMANTA_MAASAMS[(r1 + 1) % 12];

// //         onUpdate({
// //             date: fromJD(jd).toUTCString(),
// //             tithi, paksha, nakshatra, maasam, rasi,
// //             samvatsara: samvatsaraName(jd)
// //         });

// //         earthOrbit.current.rotation.y = sun * DEG;
// //         moonOrbit.current.rotation.y = (elong + 180) * DEG;
// //     });

// //     return (
// //         <>
// //             <mesh><sphereGeometry args={[1.2, 32, 32]} /><meshBasicMaterial color="orange" /></mesh>
// //             <group ref={earthOrbit}>
// //                 <mesh position={[6, 0, 0]}><sphereGeometry args={[0.5, 32, 32]} /><meshStandardMaterial color="#2a6bd4" /></mesh>
// //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// //                     <mesh position={[1.6, 0, 0]}><sphereGeometry args={[0.22, 32, 32]} /><meshStandardMaterial color="#ddd" /></mesh>
// //                 </group>
// //             </group>
// //             <Grid args={[25, 25]} rotation={[-Math.PI / 2, 0, 0]} />
// //         </>
// //     );
// // }

// // /* ===================== APP (UI UNCHANGED) ===================== */

// // export default function Panchanga3D() {
// //     const [data, setData] = useState({});
// //     const [paused, setPaused] = useState(false);
// //     const [speed, setSpeed] = useState(1);

// //     const nowJD = toJD(Date.now());
// //     const [anchorJD, setAnchorJD] = useState(nowJD);
// //     const [scrubDays, setScrubDays] = useState(0);

// //     useEffect(() => {
// //         setScrubDays(Math.round(anchorJD - nowJD));
// //     }, [anchorJD]);

// //     const YEARS = 10000;

// //     const anchorDateStr = fromJD(anchorJD).toISOString().slice(0, 10);

// //     const handleDatePick = e => {
// //         const date = new Date(e.target.value + "T00:00:00Z");
// //         setAnchorJD(toJD(date.getTime()));
// //     };

// //     return (
// //         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
// //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// //                 <SolarSystem speed={speed} paused={paused} anchorJD={anchorJD} onUpdate={setData} />
// //                 <OrbitControls />
// //             </Canvas>

// //             <div style={{ position: "absolute", top: 20, left: 20, color: "white", background: "rgba(0,0,0,0.78)", padding: 18, borderRadius: 14, width: 440 }}>
// //                 <div><b>Simulation Date (UTC)</b></div>
// //                 <div style={{ marginBottom: 8 }}>{data.date}</div>
// //                 <div><b>Tithi:</b> {data.tithi}</div>
// //                 <div><b>Paksha:</b> {data.paksha}</div>
// //                 <div><b>Nakshatra:</b> {data.nakshatra}</div>
// //                 <div><b>Rāśi:</b> {data.rasi}</div>
// //                 <div><b>Samvatsara:</b> {data.samvatsara}</div>
// //                 <div style={{ color: "#ffaa00", fontWeight: "bold" }}>Āmānta Māsa: {data.maasam}</div>

// //                 <div style={{ marginTop: 14 }}>
// //                     <div><b>Anchor Calendar Date (UTC)</b></div>
// //                     <input type="date" value={anchorDateStr} onChange={handleDatePick} style={{ width: "100%", marginTop: 6 }} />
// //                 </div>

// //                 <button onClick={() => setPaused(!paused)} style={{ width: "100%", marginTop: 12 }}>
// //                     {paused ? "▶ Resume Simulation" : "⏸ Pause Simulation"}
// //                 </button>

// //                 <div style={{ marginTop: 14 }}>
// //                     <div><b>Time Scrub (Days from Today)</b></div>
// //                     <input type="range" min={-YEARS * 365} max={YEARS * 365} step={1} value={scrubDays} onChange={e => setAnchorJD(nowJD + +e.target.value)} style={{ width: "100%" }} />
// //                 </div>

// //                 <div style={{ marginTop: 14 }}>
// //                     <div><b>Simulation Speed</b></div>
// //                     <input type="range" min="0.05" max="20" step="0.05" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "100%" }} />
// //                     <div style={{ fontSize: 12 }}>{speed.toFixed(2)} days / second</div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }






// // import React, { useRef, useState, useEffect } from "react";
// // import { Canvas, useFrame } from "@react-three/fiber";
// // import { OrbitControls } from "@react-three/drei";
// // import * as THREE from "three";

// // /* ===================== CONSTANTS ===================== */

// // const AYANAMSA = 24.0;

// // /* ===================== PANCHANGA TABLES ===================== */

// // const SHUKLA = [
// //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// //     "Trayodashi", "Chaturdashi", "Pournami"
// // ];
// // const KRISHNA = [
// //     "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
// //     "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
// //     "Trayodashi", "Chaturdashi", "Amavasya"
// // ];
// // const NAKSHATRAS = [
// //     "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
// //     "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
// //     "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
// //     "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
// //     "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
// //     "Uttara Bhadrapada", "Revati"
// // ];
// // const RASIS = [
// //     "Mesha", "Vrishabha", "Mithuna", "Karkaṭa",
// //     "Simha", "Kanya", "Tula", "Vrischika",
// //     "Dhanu", "Makara", "Kumbha", "Meena"
// // ];
// // const SAMVATSARAS = [
// //     "Prabhava", "Vibhava", "Shukla", "Pramodoota", "Prajotpatti", "Angirasa",
// //     "Shrimukha", "Bhava", "Yuva", "Dhata", "Ishvara", "Bahudhanya",
// //     "Pramathi", "Vikrama", "Vrisha", "Chitrabhanu", "Svabhanu", "Tarana",
// //     "Parthiva", "Vyaya", "Sarvajit", "Sarvadhari", "Virodhi", "Vikruti",
// //     "Khara", "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukhi",
// //     "Hevilambi", "Vilambi", "Vikari", "Sharvari", "Plava", "Shubhakrit",
// //     "Shobhakrit", "Krodhi", "Vishvavasu", "Parabhava", "Plavanga",
// //     "Kilaka", "Saumya", "Sadharana", "Virodhikrit", "Paridhavi",
// //     "Pramadicha", "Ananda", "Rakshasa", "Nala", "Pingala", "Kalayukti",
// //     "Siddharthi", "Raudra", "Durmati", "Dundubhi", "Rudhirodgari",
// //     "Raktakshi", "Krodhana", "Akshaya"
// // ];

// // /* ===================== TIME HELPERS ===================== */

// // const toJD = ms => ms / 86400000 + 2440587.5;
// // const fromJD = jd => new Date((jd - 2440587.5) * 86400000);
// // const norm = d => (d % 360 + 360) % 360;

// // /* ===================== ASTRONOMY (Vakya – stable baseline) ===================== */

// // function sunLon(jd) {
// //     return norm(280.460 + 0.9856474 * (jd - 2451545) - AYANAMSA);
// // }
// // function moonLon(jd) {
// //     return norm(218.316 + 13.176396 * (jd - 2451545) - AYANAMSA);
// // }

// // /* ===================== SAMVATSARA ===================== */

// // const SAMVATSARA_ANCHOR_JD = 2454200;
// // const SAMVATSARA_ANCHOR_INDEX = 20;

// // function samvatsaraName(jd) {
// //     const years = Math.floor((jd - SAMVATSARA_ANCHOR_JD) / 365.25636);
// //     return SAMVATSARAS[(SAMVATSARA_ANCHOR_INDEX + years + 60) % 60];
// // }

// // /* ===================== 3D SCENE ===================== */

// // function SolarSystem({ speed, paused, anchorJD, onUpdate }) {
// //     const earthOrbit = useRef();
// //     const moonOrbit = useRef();
// //     const moon = useRef();
// //     const sunLight = useRef();

// //     const elapsed = useRef(0);
// //     const lastT = useRef(null);

// //     useFrame(({ clock }) => {
// //         const t = clock.getElapsedTime();
// //         if (lastT.current === null) {
// //             lastT.current = t;
// //             return;
// //         }
// //         const dt = t - lastT.current;
// //         lastT.current = t;

// //         if (!paused) elapsed.current += dt * speed;
// //         const jd = anchorJD + elapsed.current;

// //         const sun = sunLon(jd);
// //         const moonL = moonLon(jd);
// //         const elong = norm(moonL - sun);

// //         const tIdx = Math.floor(elong / 12);
// //         const paksha = elong < 180 ? "Shukla Paksha" : "Krishna Paksha";
// //         const tithi =
// //             elong < 180 ? SHUKLA[tIdx] : KRISHNA[tIdx - 15];

// //         const nakshatra = NAKSHATRAS[Math.floor(moonL / (360 / 27))];
// //         const rasi = RASIS[Math.floor(sun / 30)];
// //         const samvatsara = samvatsaraName(jd);

// //         onUpdate({
// //             date: fromJD(jd).toUTCString(),
// //             tithi,
// //             paksha,
// //             nakshatra,
// //             rasi,
// //             samvatsara
// //         });

// //         earthOrbit.current.rotation.y = THREE.MathUtils.degToRad(sun);
// //         moonOrbit.current.rotation.y = THREE.MathUtils.degToRad(elong + 180);

// //         const mp = new THREE.Vector3();
// //         moon.current.getWorldPosition(mp);
// //         sunLight.current.position.copy(mp.clone().normalize().multiplyScalar(-20));
// //         sunLight.current.target.position.copy(mp);
// //         sunLight.current.target.updateMatrixWorld();
// //     });

// //     return (
// //         <>
// //             <mesh>
// //                 <sphereGeometry args={[1.2, 32, 32]} />
// //                 <meshBasicMaterial color="#f2c94c" />
// //             </mesh>

// //             <directionalLight ref={sunLight} intensity={2.5} />
// //             <ambientLight intensity={0.08} />

// //             <group ref={earthOrbit}>
// //                 <mesh position={[6, 0, 0]}>
// //                     <sphereGeometry args={[0.5, 32, 32]} />
// //                     <meshStandardMaterial color="#2a6bd4" />
// //                 </mesh>

// //                 <group ref={moonOrbit} position={[6, 0, 0]}>
// //                     <mesh ref={moon} position={[1.6, 0, 0]}>
// //                         <sphereGeometry args={[0.22, 32, 32]} />
// //                         <meshStandardMaterial color="#e0e0e0" />
// //                     </mesh>
// //                 </group>
// //             </group>
// //         </>
// //     );
// // }

// // /* ===================== APP + UI ===================== */

// // export default function Panchanga3D() {
// //     const [data, setData] = useState({});
// //     const [paused, setPaused] = useState(false);
// //     const [speed, setSpeed] = useState(1);

// //     const anchorJD = toJD(Date.now());

// //     return (
// //         <div style={{ height: "100vh", background: "#050510", color: "#fff" }}>
// //             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
// //                 <SolarSystem
// //                     speed={speed}
// //                     paused={paused}
// //                     anchorJD={anchorJD}
// //                     onUpdate={setData}
// //                 />
// //                 <OrbitControls />
// //             </Canvas>

// //             {/* LEFT UI PANEL */}
// //             <div
// //                 style={{
// //                     position: "absolute",
// //                     top: 20,
// //                     left: 20,
// //                     width: 340,
// //                     padding: 20,
// //                     background: "rgba(0,0,0,0.85)",
// //                     borderRadius: 16,
// //                     fontFamily: "serif"
// //                 }}
// //             >
// //                 <div>Simulation Date (UTC)</div>
// //                 <div style={{ marginBottom: 12 }}>{data.date}</div>

// //                 <div>Tithi: {data.tithi}</div>
// //                 <div>Paksha: {data.paksha}</div>
// //                 <div>Nakshatra: {data.nakshatra}</div>
// //                 <div>Rāśi: {data.rasi}</div>
// //                 <div>Samvatsara: {data.samvatsara}</div>

// //                 <button
// //                     onClick={() => setPaused(p => !p)}
// //                     style={{
// //                         marginTop: 16,
// //                         width: "100%",
// //                         padding: 12,
// //                         background: "#ff4d4f",
// //                         border: "none",
// //                         borderRadius: 12,
// //                         color: "#fff",
// //                         fontSize: 18,
// //                         cursor: "pointer"
// //                     }}
// //                 >
// //                     {paused ? "▶ Resume Simulation" : "⏸ Pause Simulation"}
// //                 </button>

// //                 <div style={{ marginTop: 20 }}>Simulation Speed</div>
// //                 <input
// //                     type="range"
// //                     min="0"
// //                     max="10"
// //                     step="0.1"
// //                     value={speed}
// //                     onChange={e => setSpeed(parseFloat(e.target.value))}
// //                     style={{ width: "100%" }}
// //                 />
// //                 <div>{speed.toFixed(2)} days / second</div>
// //             </div>
// //         </div>
// //     );
// // }



// import React, { useRef, useState, useEffect } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, Grid } from "@react-three/drei";
// import * as THREE from "three";
// import * as swe from "swisseph-wasm";

// /* =====================================================
//    CONFIG
// ===================================================== */

// const OBSERVER = { lat: 13.6833, lon: 79.3500 }; // Tirupati

// /* =====================================================
//    TELUGU PANCHANGAM CONSTANTS
// ===================================================== */

// const SHUKLA = [
//     "ప్రథమ", "ద్వితీయ", "తృతీయ", "చతుర్థి", "పంచమి", "షష్ఠి",
//     "సప్తమి", "అష్టమి", "నవమి", "దశమి", "ఏకాదశి", "ద్వాదశి",
//     "త్రయోదశి", "చతుర్దశి", "పౌర్ణమి"
// ];

// const KRISHNA = [
//     "ప్రథమ", "ద్వితీయ", "తృతీయ", "చతుర్థి", "పంచమి", "షష్ఠి",
//     "సప్తమి", "అష్టమి", "నవమి", "దశమి", "ఏకాదశి", "ద్వాదశి",
//     "త్రయోదశి", "చతుర్దశి", "అమావాస్య"
// ];

// const NAKSHATRAS = [
//     "అశ్విని", "భరణి", "కృత్తిక", "రోహిణి", "మృగశిర", "ఆర్ద్ర",
//     "పునర్వసు", "పుష్యమి", "ఆశ్లేష", "మఖ", "పూర్వ ఫల్గుణి",
//     "ఉత్తర ఫల్గుణి", "హస్త", "చిత్త", "స్వాతి", "విశాఖ", "అనూరాధ",
//     "జ్యేష్ఠ", "మూల", "పూర్వాషాఢ", "ఉత్తరాషాఢ", "శ్రవణం",
//     "ధనిష్ఠ", "శతభిష", "పూర్వ భాద్ర", "ఉత్తర భాద్ర", "రేవతి"
// ];

// const RASIS = [
//     "మేష", "వృషభ", "మిథున", "కర్కాటక", "సింహ", "కన్య",
//     "తుల", "వృశ్చిక", "ధనుస్సు", "మకర", "కుంభ", "మీనం"
// ];

// const AMANTA_MAASAMS = [
//     "చైత్ర", "వైశాఖ", "జ్యేష్ఠ", "ఆషాఢ", "శ్రావణ", "భాద్రపద",
//     "ఆశ్వయుజ", "కార్తిక", "మార్గశిర", "పుష్య", "మాఘ", "ఫాల్గుణ"
// ];

// /* =====================================================
//    TIME HELPERS
// ===================================================== */

// const toJD = ms => ms / 86400000 + 2440587.5;
// const fromJD = jd => new Date((jd - 2440587.5) * 86400000);
// const norm = d => ((d % 360) + 360) % 360;

// /* =====================================================
//    SWISS EPHEMERIS INIT (CRITICAL)
// ===================================================== */

// let sweReady = false;

// async function initSwiss() {
//     if (sweReady) return;
//     await swe.init();
//     swe.setSidMode(swe.SIDM_LAHIRI, 0, 0);
//     sweReady = true;
// }

// /* =====================================================
//    ASTRONOMY (DRIK)
// ===================================================== */

// function sunLon(jdUT) {
//     const r = swe.calcUt(jdUT, swe.SUN, swe.FLG_SIDEREAL);
//     return norm(r.longitude);
// }

// function moonLon(jdUT) {
//     const r = swe.calcUt(jdUT, swe.MOON, swe.FLG_SIDEREAL);
//     return norm(r.longitude);
// }

// /* =====================================================
//    SUNRISE
// ===================================================== */

// function sunriseJD(jd) {
//     const d = fromJD(jd);
//     const jd0 = toJD(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

//     const r = swe.riseTrans(
//         jd0,
//         swe.SUN,
//         "",
//         swe.FLG_SWIEPH | swe.FLG_TOPOCTR,
//         swe.CALC_RISE,
//         OBSERVER.lon,
//         OBSERVER.lat,
//         0,
//         0
//     );
//     return r.time;
// }

// /* =====================================================
//    AMAVASYA SEARCH
// ===================================================== */

// function findAmavasya(jd, dir) {
//     let step = dir === "back" ? -1 / 48 : 1 / 48;
//     let prev = norm(moonLon(jd) - sunLon(jd));

//     for (let i = 0; i < 3000; i++) {
//         jd += step;
//         let cur = norm(moonLon(jd) - sunLon(jd));
//         if (prev > 300 && cur < 60) return jd;
//         prev = cur;
//     }
//     return null;
// }

// /* =====================================================
//    SCENE
// ===================================================== */

// function SolarSystem({ speed, paused, anchorJD, onUpdate }) {
//     const earthOrbit = useRef();
//     const moonOrbit = useRef();
//     const elapsed = useRef(0);
//     const last = useRef(null);

//     useFrame(() => {
//         if (!sweReady) return;

//         const now = performance.now() / 1000;
//         if (!last.current) { last.current = now; return; }
//         const delta = now - last.current;
//         last.current = now;
//         if (!paused) elapsed.current += delta * speed;

//         const simJD = anchorJD + elapsed.current;
//         const riseJD = sunriseJD(simJD);

//         const sun = sunLon(riseJD);
//         const moon = moonLon(riseJD);
//         const elong = norm(moon - sun);

//         const tIdx = Math.floor(elong / 12);
//         const paksha = elong < 180 ? "శుక్ల పక్షం" : "కృష్ణ పక్షం";
//         const tithi = elong < 180 ? SHUKLA[tIdx] : KRISHNA[tIdx - 15];
//         const nakshatra = NAKSHATRAS[Math.floor(moon / (360 / 27))];
//         const rasi = RASIS[Math.floor(sun / 30)];

//         const ama = findAmavasya(riseJD, "back");
//         const maasam = ama
//             ? AMANTA_MAASAMS[(Math.floor(sunLon(ama) / 30) + 1) % 12]
//             : "—";

//         onUpdate({
//             date: fromJD(simJD).toUTCString(),
//             tithi,
//             paksha,
//             nakshatra,
//             rasi,
//             maasam
//         });

//         earthOrbit.current.rotation.y = THREE.MathUtils.degToRad(sun);
//         moonOrbit.current.rotation.y = THREE.MathUtils.degToRad(elong + 180);
//     });

//     return (
//         <>
//             <mesh>
//                 <sphereGeometry args={[1.2, 32, 32]} />
//                 <meshBasicMaterial color="orange" />
//             </mesh>
//             <ambientLight intensity={0.06} />
//             <directionalLight intensity={2.5} />
//             <group ref={earthOrbit}>
//                 <mesh position={[6, 0, 0]}>
//                     <sphereGeometry args={[0.5, 32, 32]} />
//                     <meshStandardMaterial color="#2a6bd4" />
//                 </mesh>
//                 <group ref={moonOrbit} position={[6, 0, 0]}>
//                     <mesh position={[1.6, 0, 0]}>
//                         <sphereGeometry args={[0.22, 32, 32]} />
//                         <meshStandardMaterial color="#ddd" />
//                     </mesh>
//                 </group>
//             </group>
//             <Grid args={[25, 25]} position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} />
//         </>
//     );
// }

// /* =====================================================
//    APP
// ===================================================== */

// export default function Panchanga3D() {
//     const [data, setData] = useState({});
//     const [paused, setPaused] = useState(false);
//     const [speed, setSpeed] = useState(1);
//     const [ready, setReady] = useState(false);

//     const nowJD = toJD(Date.now());
//     const [anchorJD, setAnchorJD] = useState(nowJD);
//     const anchorDateStr = fromJD(anchorJD).toISOString().slice(0, 10);

//     useEffect(() => {
//         initSwiss().then(() => setReady(true));
//     }, []);

//     if (!ready) return <div style={{ color: "white" }}>Loading Swiss Ephemeris…</div>;

//     return (
//         <div style={{ height: "100vh", background: "#050510", position: "relative" }}>
//             <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
//                 <SolarSystem speed={speed} paused={paused} anchorJD={anchorJD} onUpdate={setData} />
//                 <OrbitControls />
//             </Canvas>

//             {/* UI BLOCK UNCHANGED */}
//             <div style={{
//                 position: "absolute", top: 20, left: 20, color: "white",
//                 background: "rgba(0,0,0,0.78)", padding: 18, borderRadius: 14, width: 440
//             }}>
//                 <div><b>Simulation Date (UTC)</b></div>
//                 <div>{data.date}</div>
//                 <div><b>తిథి:</b> {data.tithi}</div>
//                 <div><b>పక్షం:</b> {data.paksha}</div>
//                 <div><b>నక్షత్రం:</b> {data.nakshatra}</div>
//                 <div><b>రాశి:</b> {data.rasi}</div>
//                 <div style={{ color: "#ffaa00", fontWeight: "bold" }}>
//                     ఆమాంత మాసం: {data.maasam}
//                 </div>

//                 <div style={{ marginTop: 14 }}>
//                     <div><b>Anchor Calendar Date (UTC)</b></div>
//                     <input type="date" value={anchorDateStr}
//                         onChange={e => setAnchorJD(toJD(new Date(e.target.value + "T00:00:00Z").getTime()))}
//                         style={{ width: "100%", padding: 6, borderRadius: 8 }}
//                     />
//                 </div>

//                 <button onClick={() => setPaused(!paused)}
//                     style={{
//                         width: "100%", marginTop: 12, padding: 8, borderRadius: 10,
//                         background: paused ? "#00cc88" : "#ff4444", color: "white"
//                     }}>
//                     {paused ? "▶ Resume" : "⏸ Pause"}
//                 </button>

//                 <div style={{ marginTop: 14 }}>
//                     <div><b>Simulation Speed</b></div>
//                     <input type="range" min="0.05" max="20" step="0.05"
//                         value={speed} onChange={e => setSpeed(+e.target.value)}
//                         style={{ width: "100%" }} />
//                     <div>{speed.toFixed(2)} days / second</div>
//                 </div>
//             </div>
//         </div>
//     );
// }
