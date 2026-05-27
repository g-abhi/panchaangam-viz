import React, { useState, useEffect, useRef } from 'react';
import { detectEclipse, riseTransFixed } from '@/lib/eclipseHelpers';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import SwissEph from 'swisseph-wasm';
// country-state-city is lazy-loaded on first search (saves ~8.7 MB from initial load)
// import { City, State, Country } from 'country-state-city';
import tzlookup from 'tz-lookup';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// --- DATA ---
// --- LOCALIZATION & DATA ---
const UI_STRINGS = {
    en: {
        title: "Panchaangam",
        subtitle: "Astronomical Sandbox • Sidereal Lahiri",
        transitParams: "Transit Parameters",
        simTime: "Simulation Local Time",
        samvathsaram: "Year",
        samvathsaramDesc: "The 60-year Jovian cycle in the Vedic calendar, each year having a unique name.",
        amanthaMasam: "Lunar Month",
        amanthaMasamDesc: "The lunar month ending with Amavasya (New Moon). Common in South India.",
        souramanaMasam: "Solar Month",
        tithi: "Tithi",
        tithiDesc: "The Lunar day, calculated based on the angular distance between the Sun and Moon (12° per Tithi).",
        nakshatra: "Nakshatra",
        nakshatraDesc: "The Moon's position relative to 27 specific star groups (asterisms) along the ecliptic.",
        varam: "Day",
        varamDesc: "The Day of the Week, corresponding to the seven visible celestial bodies.",
        rasi: "Rasi (Sun)",
        rasiDesc: "The Zodiac sign currently occupied by the Sun.",
        yoga: "Yoga",
        yogaDesc: "Calculated from the sum of Sun and Moon longitudes (13°20' per Yoga). Indicates combined planetary energy.",
        karana: "Karana",
        karanaDesc: "Half of a Tithi (6°). There are 60 Karanas in a lunar month.",
        engineStats: "Cosmic Engine Stats",
        precision: "High-Precision",
        sunLong: "Sun Longitude",
        moonLong: "Moon Longitude",
        elongation: "Elongation",
        lagnam: "Lagnam",
        lagnamDesc: "The Ascendant: the Rasi or zodiac sign rising on the eastern horizon at a specific time and location.",
        sunrise: "Sunrise",
        sunset: "Sunset",
        observerLoc: "Observer Location",
        searchCity: "Search City",
        activeStation: "Active Station",
        online: "ONLINE",
        useLocation: "Use My Location",
        locating: "Locating...",
        temporalAnchor: "Temporal Anchor",
        play: "▶ Play",
        pause: "⏸ Pause",
        speed: "Speed",

        obsTarget: "Observation Target",
        systemName: "Earth-Moon-Sun System",
        untilPre: "until",
        untilPost: "",
        sun: "Sun",
        moon: "Moon",
        earth: "Earth",
        realTime: "Real Time",
        sec: "sec",
        min: "min",
        hour: "hr",
        day: "day",
        month: "mo",
        year: "yr",
        adhika: "Adhika",
        solarEclipse: "Solar Eclipse (Surya Grahana)",
        lunarEclipse: "Lunar Eclipse (Chandra Grahana)",
        eclipseTotal: "Total",
        eclipsePartial: "Partial",
        eclipseAnnular: "Annular",
        eclipsePenumbral: "Penumbral",
        eclipseHybrid: "Hybrid",
        eclipseMagnitude: "Magnitude",
        eclipseObscuration: "Obscuration",
        eclipseMaximum: "Maximum",
        eclipseBegin: "Begin",
        eclipseEnd: "End",
        eclipseTotality: "Totality",
        eclipseDuration: "Duration",
        eclipseActive: "Active",
        eclipseGrahana: "Grahana"
    },
    te: {
        title: "పంచాంగం",
        subtitle: "ఖగోళ శాస్త్రం • సైడ్రియల్ లహిరి",
        transitParams: "గ్రహ సంచార వివరాలు",
        simTime: "అనుకరణ స్థానిక సమయం",
        samvathsaram: "సంవత్సరం",
        samvathsaramDesc: "60 సంవత్సరాల బృహస్పతి చక్రం, ప్రతి సంవత్సరానికి ఒక ప్రత్యేక పేరు ఉంటుంది.",
        amanthaMasam: "అమాంత మాసం",
        amanthaMasamDesc: "అమావాస్యతో ముగిసే చంద్ర మాసం. ఇది దక్షిణ భారత దేశంలో ప్రాచుర్యంలో ఉంది.",
        souramanaMasam: "సౌరమాన మాసం",
        tithi: "తిథి",
        tithiDesc: "సూర్యచంద్రుల మధ్య దూరం ఆధారంగా లెక్కించబడే చాంద్రమాన దినం (ప్రతి తిథికి 12°).",
        nakshatra: "నక్షత్రం",
        nakshatraDesc: "చంద్రుడు ప్రయాణించే మార్గంలో ఉండే 27 నక్షత్ర సమూహాలలో ఒక దానిలోని చంద్రుని స్థితి.",
        varam: "వారం",
        varamDesc: "ఏడు గ్రహాల పేర్లతో పిలువబడే వారంలోని దినం.",
        rasi: "రాశి (సూర్యుడు)",
        rasiDesc: "సూర్యుడు ప్రస్తుతం సంచరిస్తున్న రాశి చక్రం.",
        yoga: "యోగం",
        yogaDesc: "సూర్యచంద్రుల రేఖాంశాల మొత్తం నుండి లెక్కించబడుతుంది (ప్రతి యోగానికి 13°20').",
        karana: "కరణం",
        karanaDesc: "ఒక తిథిలో సగభాగం (6°). చంద్ర మాసంలో 60 కరణాలు ఉంటాయి.",
        engineStats: "కాస్మిక్ ఇంజిన్ గణాంకాలు",
        precision: "అధిక ఖచ్చితత్వం",
        sunLong: "సూర్య రేఖాంశం",
        moonLong: "చంద్ర రేఖాంశం",
        elongation: "నిడివి",
        lagnam: "లగ్నం",
        lagnamDesc: "తూర్పు దిగంతంలో ఉదయిస్తున్న రాశి చక్రం.",
        sunrise: "సూర్యోదయం",
        sunset: "సూర్యాస్తమయం",
        observerLoc: "వీక్షక స్థానం",
        searchCity: "నగరం వెతకండి",
        activeStation: "క్రియాశీల కేంద్రం",
        online: "ఆన్‌లైన్",
        useLocation: "నా స్థానాన్ని వాడండి",
        locating: "వెతుకుతోంది...",
        temporalAnchor: "సమయ లంగరు",
        play: "▶ ప్లే",
        pause: "⏸ పాజ్",
        speed: "వేగం",
        obsTarget: "వీక్షణ లక్ష్యం",
        systemName: "భూమి-చంద్ర-సూర్య వ్యవస్థ",
        untilPre: "",
        untilPost: " వరకు",
        sun: "సూర్యుడు",
        moon: "చంద్రుడు",
        earth: "భూమి",
        realTime: "వాస్తవ సమయం",
        sec: "సెకను",
        min: "నిమిషం",
        hour: "గంట",
        day: "రోజు",
        month: "నెల",
        year: "సంవత్సరం",
        adhika: "అధిక ",
        solarEclipse: "సూర్య గ్రహణం",
        lunarEclipse: "చంద్ర గ్రహణం",
        eclipseTotal: "సంపూర్ణ",
        eclipsePartial: "పాక్షిక",
        eclipseAnnular: "వలయాకార",
        eclipsePenumbral: "ఛాయా",
        eclipseHybrid: "సంకర",
        eclipseMagnitude: "తీవ్రత",
        eclipseObscuration: "ఆవరణ",
        eclipseMaximum: "గరిష్ఠం",
        eclipseBegin: "ప్రారంభం",
        eclipseEnd: "ముగింపు",
        eclipseTotality: "సంపూర్ణత",
        eclipseDuration: "వ్యవధి",
        eclipseActive: "క్రియాశీలం",
        eclipseGrahana: "గ్రహణం"
    }
};

const SHUKLA_TE = ["శుక్ల పాడ్యమి", "శుక్ల విదియ", "శుక్ల తదియ", "శుక్ల చవితి", "శుక్ల పంచమి", "శుక్ల షష్ఠి", "శుక్ల సప్తమి", "శుక్ల అష్టమి", "శుక్ల నవమి", "శుక్ల దశమి", "శుక్ల ఏకాదశి", "శుక్ల ద్వాదశి", "శుక్ల త్రయోదశి", "శుక్ల చతుర్దశి", "పూర్ణిమ"];
const SHUKLA_EN = ["Shukla Padyami", "Shukla Vidiya", "Shukla Tadiya", "Shukla Chavithi", "Shukla Panchami", "Shukla Shashthi", "Shukla Saptami", "Shukla Ashtami", "Shukla Navami", "Shukla Dashami", "Shukla Ekadashi", "Shukla Dwadashi", "Shukla Trayodashi", "Shukla Chaturdashi", "Pournami"];

const KRISHNA_TE = ["కృష్ణ పాడ్యమి", "కృష్ణ విదియ", "కృష్ణ తదియ", "కృష్ణ చవితి", "కృష్ణ పంచమి", "కృష్ణ షష్ఠి", "కృష్ణ సప్తమి", "కృష్ణ అష్టమి", "కృష్ణ నవమి", "కృష్ణ దశమి", "కృష్ణ ఏకాదశి", "కృష్ణ ద్వాదశి", "కృష్ణ త్రయోదశి", "కృష్ణ చతుర్దశి", "అమావాస్య"];
const KRISHNA_EN = ["Krishna Padyami", "Krishna Vidiya", "Krishna Tadiya", "Krishna Chavithi", "Krishna Panchami", "Krishna Shashthi", "Krishna Saptami", "Krishna Ashtami", "Krishna Navami", "Krishna Dashami", "Krishna Ekadashi", "Krishna Dwadashi", "Krishna Trayodashi", "Krishna Chaturdashi", "Amavasya"];

const NAKSHATRAS_TE = ["అశ్విని", "భరణి", "కృత్తిక", "రోహిణి", "మృగశిర", "ఆరుద్ర", "పునర్వసు", "పుష్యమి", "ఆశ్లేష", "మఖ", "పూర్వ ఫల్గుణి", "ఉత్తర ఫల్గుణి", "హస్త", "చిత్త", "స్వాతి", "విశాఖ", "అనూరాధ", "జ్యేష్ఠ", "మూల", "పూర్వాషాఢ", "ఉత్తరాషాఢ", "శ్రవణం", "ధనిష్ఠ", "శతభిషం", "పూర్వాభాద్ర", "ఉత్తరాభాద్ర", "రేవతి"];
const NAKSHATRAS_EN = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Arudra", "Punarvasu", "Pushyami", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purvashadha", "Uttarashadha", "Shravana", "Dhanista", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];

const RASIS_TE = ["మేష", "వృషభ", "మిథున", "కర్కాటక", "సింహ", "కన్య", "తుల", "వృశ్చిక", "ధనుస్సు", "మకర", "కుంభ", "మీనం"];
const RASIS_EN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

const VARAMS_TE = ["ఆదివారం", "సోమవారం", "మంగళవారం", "బుధవారం", "గురువారం", "శుక్రవారం", "శనివారం"];
const VARAMS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SAMVATHSARAMS_TE = [
    "ప్రభవ", "విభవ", "శుక్ల", "ప్రమోదూత", "ప్రజోత్పత్తి", "అంగీరస", "శ్రీముఖ", "భావ", "యువ", "ధాత",
    "ఈశ్వర", "బహుధాన్య", "ప్రమాది", "విక్రమ", "వృష", "చిత్రభాను", "స్వభాను", "తారణ", "పార్థివ", "వ్యయ",
    "సర్వజిత్తు", "సర్వధారి", "విరోధి", "వికృతి", "ఖర", "నందన", "విజయ", "జయ", "మన్మధ", "దుర్ముఖి",
    "హేవిలంబి", "విళంబి", "వికారి", "శార్వరి", "ప్లవ", "శుభకృతు", "శోభకృతు", "క్రోధి", "విశ్వావసు", "పరాభవ",
    "ప్లవంగ", "కీలక", "సౌమ్య", "సాధారణ", "విరోధికృతు", "పరీధావి", "ప్రమాదీచ", "ఆనంద", "రాక్షస", "నల",
    "పింగళ", "కాళయుక్తి", "సిద్ధార్థి", "రౌద్రి", "దుర్మతి", "దుందుభి", "రుధిరోద్గారి", "రక్తాక్షి", "క్రోధన", "అక్షయ"
];
// Romanized Samvatsarams for English
const SAMVATHSARAMS_EN = [
    "Prabhava", "Vibhava", "Shukla", "Pramoduta", "Prajotpatti", "Angirasa", "Srimukha", "Bhava", "Yuva", "Dhata",
    "Ishvara", "Bahudhanya", "Pramadi", "Vikrama", "Vrisha", "Chitrabhanu", "Svabhanu", "Tarana", "Parthiva", "Vyaya",
    "Sarvajitu", "Sarvadhari", "Virodhi", "Vikriti", "Khara", "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukhi",
    "Hevilambi", "Vilambi", "Vikari", "Sharvari", "Plava", "Shubhakrutu", "Shobhakrutu", "Krodhi", "Vishvavasu", "Parabhava",
    "Plavanga", "Kilaka", "Saumya", "Sadharana", "Virodhikrutu", "Paridhavi", "Pramadicha", "Ananda", "Rakshasa", "Nala",
    "Pingala", "Kalayukti", "Siddharthi", "Raudri", "Durmati", "Dundubhi", "Rudhirodgari", "Raktakshi", "Krodhana", "Akshaya"
];

const YOGAS_TE = ["విష్కుంభం", "ప్రీతి", "ఆయుష్మాన్", "సౌభాగ్యం", "శోభనం", "అతిగండం", "సుకర్మ", "ధృతి", "శూలం", "గండం", "వృద్ధి", "ధ్రువం", "వ్యాఘాతం", "హర్షణం", "వజ్రం", "సిద్ధి", "వ్యతీపాతం", "వరీయాన్", "పరిఘం", "శివం", "సిద్ధం", "సాధ్యం", "శుభం", "శుక్లం", "బ్రహ్మం", "ఐంద్రం", "వైధృతి"];
const YOGAS_EN = ["Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Sobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];

const KARANAS_TE = ["బవ", "బాలవ", "కౌలవ", "తైతుల", "గరజ", "వణిజ", "విష్టి", "శకుని", "చతుష్పాద", "నాగవ", "కింస్తుఘ్నం"];
const KARANAS_EN = ["Bava", "Balava", "Kaulava", "Taitula", "Garaja", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Nagava", "Kimstughna"];

const SPEED_UNIT_VALUES = {
    yr: 365,
    mo: 30,
    day: 1,
    hr: 1 / 24,
    min: 1 / 1440,
    sec: 1 / 86400
};

const MAASAMS_TE = ["చైత్రము", "వైశాఖము", "జ్యేష్ఠము", "ఆషాఢము", "శ్రావణము", "భాద్రపదము", "ఆశ్వయుజము", "కార్తీకము", "మార్గశిరము", "పుష్యము", "మాఘము", "ఫాల్గుణము"];
const MAASAMS_EN = ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashwayuja", "Karthika", "Margashira", "Pushya", "Magha", "Phalguna"];

// --- NASA/ISRO CONSTELLATION DATA ---
// Coordinates are roughly normalized for display within segments.
// --- NASA/ISRO CONSTELLATION DATA ---
// Precise stylized star patterns. Normalized coordinates [x, y] where [0.5, 0.5] is center.
// Shapes reflect the official Yogatara (identifying stars) and traditional stick figures.

const RASHI_CONSTELLATIONS = {
    "Aries": { points: [[0.8, 0.7], [0.5, 0.6], [0.3, 0.5], [0.35, 0.3], [0.6, 0.2]], yogataras: [0, 1] }, // Hamal, Sheratan + neck
    "Taurus": { points: [[0.2, 0.8], [0.5, 0.5], [0.8, 0.8], [0.5, 0.5], [0.5, 0.2], [0.1, 0.1], [0.5, 0.2], [0.9, 0.1]], yogataras: [1] }, // The "V" and Horns
    "Gemini": { points: [[0.2, 0.8], [0.2, 0.2], [0.4, 0.2], [0.4, 0.8], [0.2, 0.6], [0.4, 0.6], [0.8, 0.8], [0.8, 0.2], [0.6, 0.2], [0.6, 0.8], [0.8, 0.6], [0.6, 0.6]], yogataras: [0, 6] }, // Two stick men
    "Cancer": { points: [[0.5, 0.5], [0.3, 0.3], [0.7, 0.3], [0.5, 0.8]], yogataras: [0] }, // Inverted Y
    "Leo": { points: [[0.8, 0.1], [0.5, 0.1], [0.2, 0.3], [0.2, 0.7], [0.4, 0.9], [0.7, 0.8], [0.8, 0.5], [0.5, 0.1]], yogataras: [0] }, // Full Lion outline
    "Virgo": { points: [[0.5, 0.9], [0.5, 0.5], [0.2, 0.3], [0.5, 0.5], [0.8, 0.3], [0.5, 0.5], [0.5, 0.1]], yogataras: [1] }, // Stick figure with Spica
    "Libra": { points: [[0.5, 0.8], [0.1, 0.4], [0.5, 0.1], [0.9, 0.4], [0.5, 0.8], [0.1, 0.4], [0.9, 0.4]], yogataras: [0, 3] }, // Diamond Scales
    "Scorpio": { points: [[0.9, 0.8], [0.7, 0.7], [0.5, 0.6], [0.3, 0.5], [0.2, 0.3], [0.4, 0.1], [0.6, 0.2], [0.5, 0.6]], yogataras: [2] }, // Full Hook/Scorpion
    "Sagittarius": { points: [[0.2, 0.2], [0.8, 0.2], [0.8, 0.8], [0.2, 0.8], [0.2, 0.2], [0.1, 0.5], [0.2, 0.2], [0.8, 0.2], [0.9, 0.5]], yogataras: [1, 2] }, // Teapot with Handle/Spout
    "Capricorn": { points: [[0.1, 0.8], [0.9, 0.8], [0.5, 0.2], [0.1, 0.8]], yogataras: [2] }, // Sea-Goat triangle
    "Aquarius": { points: [[0.1, 0.6], [0.4, 0.5], [0.7, 0.6], [0.4, 0.4], [0.3, 0.1], [0.5, 0.1]], yogataras: [1] }, // Water flow
    "Pisces": { points: [[0.1, 0.1], [0.4, 0.4], [0.5, 0.5], [0.6, 0.6], [0.9, 0.9], [0.3, 0.7], [0.1, 0.1]] } // Resonant fishes
};

// Comprehensive mapping for all 27 Nakshatras with realistic star patterns relative to their segment
// Comprehensive mapping for all 27 Nakshatras with realistic star patterns relative to their segment
const NAKSHATRA_CONSTELLATIONS = {
    // 1. Ashwini (Aries - Beta/Gamma Arietis)
    "Ashwini": {
        points: [
            [0.8, 0.4], [0.5, 0.6], [0.2, 0.5] // Hamal(alpha), Sheratan(beta), Mesarthim(gamma)
        ],
        yogataras: [1] // Sheratan (Beta Ari)
    },
    // 2. Bharani (Aries - 35, 39, 41 Arietis)
    "Bharani": {
        points: [
            [0.3, 0.4], [0.5, 0.8], [0.7, 0.4] // The triangle of Musca Borealis / 41 Ari
        ],
        yogataras: [1] // 41 Arietis
    },
    // 3. Krittika (Pleiades - η Tau)
    "Krittika": {
        points: [
            [0.35, 0.35], [0.45, 0.45], [0.5, 0.6], [0.65, 0.7], // Handle
            [0.65, 0.7], [0.8, 0.6], [0.85, 0.4], [0.75, 0.25], [0.5, 0.6] // The Cup/Sisters
        ],
        yogataras: [2] // Alcyone (Eta Tauri)
    },
    // 4. Rohini (Taurus - Aldebaran)
    "Rohini": {
        points: [
            [0.1, 0.9], [0.35, 0.6], [0.5, 0.4], [0.65, 0.6], [0.9, 0.9], // Hyades V-shape
            [0.35, 0.6], [0.65, 0.6] // Cross-bar
        ],
        yogataras: [2] // Aldebaran (Alpha Tauri)
    },
    // 5. Mrigashira (Orion - Meissa/Bellatrix)
    "Mrigashira": {
        points: [
            [0.2, 0.3], [0.5, 0.8], [0.8, 0.3], // Head and Shoulders
            [0.45, 0.75], [0.55, 0.75], [0.5, 0.85], [0.45, 0.75] // Meissa triangle (Head)
        ],
        yogataras: [5] // Meissa (Lambda Ori)
    },
    // 6. Arudra (Orion - Betelgeuse)
    "Arudra": {
        points: [
            [0.5, 0.5], [0.3, 0.7], [0.2, 0.9], // Shoulder to Club path
            [0.5, 0.5], [0.7, 0.3] // To Belt hint
        ],
        yogataras: [0] // Betelgeuse (Alpha Ori)
    },
    // 7. Punarvasu (Gemini - Castor/Pollux)
    "Punarvasu": {
        points: [
            [0.2, 0.8], [0.2, 0.3], // Castor's torso
            [0.5, 0.8], [0.5, 0.3], // Pollux's torso
            [0.2, 0.8], [0.5, 0.8]  // Heads connected
        ],
        yogataras: [0, 2] // Castor, Pollux
    },
    // 8. Pushyami (Cancer - Delta Cancri)
    "Pushyami": {
        points: [
            [0.5, 0.5], [0.3, 0.2], // Leg
            [0.5, 0.5], [0.7, 0.2], // Leg
            [0.5, 0.5], [0.5, 0.8], // Body
            [0.3, 0.9], [0.5, 0.8], [0.7, 0.9] // Claws
        ],
        yogataras: [0] // Asellus Australis (Delta Cnc)
    },
    // 9. Ashlesha (Hydra - Epsilon Hydrae)
    "Ashlesha": {
        points: [
            [0.5, 0.2], [0.8, 0.4], [0.7, 0.7], [0.4, 0.8], [0.2, 0.6], [0.3, 0.3], [0.5, 0.2] // Circular Head
        ],
        yogataras: [3] // Epsilon Hydrae
    },
    // 10. Magha (Leo - Regulus)
    "Magha": {
        points: [
            [0.5, 0.1], [0.3, 0.15], [0.2, 0.4], [0.35, 0.7], [0.6, 0.8], [0.8, 0.6], [0.6, 0.4], [0.3, 0.15] // The Sickle
        ],
        yogataras: [1] // Regulus (Alpha Leo)
    },
    // 11. Purva Phalguni (Leo - Delta Leonis)
    "Purva Phalguni": {
        points: [
            [0.2, 0.3], [0.8, 0.3], [0.8, 0.8], [0.2, 0.8], [0.2, 0.3] // Middle body box
        ],
        yogataras: [3] // Zosma (Delta Leo)
    },
    // 12. Uttara Phalguni (Leo - Beta Leonis)
    "Uttara Phalguni": {
        points: [
            [0.2, 0.8], [0.5, 0.5], [0.9, 0.2], // Back leg to Tail
            [0.5, 0.5], [0.7, 0.8] // Hind quarter
        ],
        yogataras: [2] // Denebola (Beta Leo)
    },
    // 13. Hasta (Corvus - Delta Corvi)
    "Hasta": {
        points: [
            [0.2, 0.2], [0.8, 0.3], [0.7, 0.8], [0.3, 0.7], [0.2, 0.2], // Quad
            [0.7, 0.8], [0.5, 0.9] // Beak
        ],
        yogataras: [2] // Algorab (Delta Crv)
    },
    // 14. Chitra (Virgo - Spica)
    "Chitra": {
        points: [
            [0.5, 0.5], [0.3, 0.9], [0.7, 0.9], [0.5, 0.5], // The Spike
            [0.5, 0.5], [0.5, 0.1] // Stem
        ],
        yogataras: [0] // Spica (Alpha Vir)
    },
    // 15. Swati (Boötes - Arcturus)
    "Swati": {
        points: [
            [0.5, 0.1], [0.5, 0.4], // Leg
            [0.5, 0.4], [0.2, 0.7], [0.5, 0.9], [0.8, 0.7], [0.5, 0.4] // Bottom of Kite
        ],
        yogataras: [1] // Arcturus (Alpha Boo)
    },
    // 16. Vishakha (Libra - Alpha/Beta Librae)
    "Vishakha": {
        points: [
            [0.2, 0.2], [0.5, 0.8], [0.8, 0.2], // The Arch
            [0.5, 0.8], [0.5, 0.9] // Hanger
        ],
        yogataras: [0, 2] // Zubenelgenubi, Zubeneschamali
    },
    // 17. Anuradha (Scorpio - Delta Scorpii)
    "Anuradha": {
        points: [
            [0.2, 0.8], [0.5, 0.6], [0.8, 0.8], // Claws
            [0.5, 0.6], [0.5, 0.1] // Path to Heart
        ],
        yogataras: [1] // Dschubba (Delta Sco)
    },
    // 18. Jyeshtha (Scorpio - Antares)
    "Jyeshtha": {
        points: [
            [0.2, 0.3], [0.5, 0.5], [0.8, 0.7], // Flank stars
            [0.5, 0.5], [0.5, 0.1] // The Heart connection
        ],
        yogataras: [1] // Antares (Alpha Sco)
    },
    // 19. Mula (Scorpio - Lambda Scorpii)
    "Mula": {
        points: [
            [0.1, 0.8], [0.3, 0.4], [0.6, 0.3], [0.8, 0.5], [0.9, 0.8], [0.7, 0.9], [0.6, 0.7] // Curved Sting hook
        ],
        yogataras: [5] // Shaula (Lambda Sco)
    },
    // 20. Purvashadha (Sagittarius - Kaus Media)
    "Purvashadha": {
        points: [
            [0.3, 0.2], [0.7, 0.2], [0.7, 0.6], [0.3, 0.6], [0.3, 0.2], // Pot body
            [0.7, 0.4], [0.9, 0.5] // Spout
        ],
        yogataras: [0] // Kaus Media (Delta Sgr)
    },
    // 21. Uttarashadha (Sagittarius - Nunki)
    "Uttarashadha": {
        points: [
            [0.3, 0.7], [0.7, 0.7], [0.8, 0.5], [0.7, 0.3], [0.3, 0.3], // Handle
            [0.3, 0.7], [0.4, 0.9], [0.7, 0.7] // Lid
        ],
        yogataras: [2] // Nunki (Sigma Sgr)
    },
    // 22. Shravana (Aquila - Altair)
    "Shravana": {
        points: [
            [0.2, 0.4], [0.5, 0.5], [0.8, 0.6], // Altair line
            [0.5, 0.5], [0.4, 0.1], [0.6, 0.1], [0.5, 0.5] // Eagle Body
        ],
        yogataras: [1] // Altair (Alpha Aql)
    },
    // 23. Dhanista (Delphinus - Beta Delphini)
    "Dhanista": {
        points: [
            [0.3, 0.6], [0.5, 0.8], [0.7, 0.6], [0.5, 0.4], [0.3, 0.6], // Diamond head
            [0.5, 0.4], [0.5, 0.1] // Tail
        ],
        yogataras: [3] // Rotanev (Beta Del)
    },
    // 24. Shatabhisha (Aquarius - Lambda Aquarii)
    "Shatabhisha": {
        points: [
            [0.5, 0.1], [0.8, 0.3], [0.9, 0.5], [0.8, 0.7], [0.5, 0.9], [0.2, 0.7], [0.1, 0.5], [0.2, 0.3], [0.5, 0.1] // Large Circle
        ],
        yogataras: [0] // Lambda Aqr
    },
    // 25. Purva Bhadrapada (Pegasus - Alpha Pegasi)
    "Purva Bhadrapada": {
        points: [
            [0.2, 0.2], [0.2, 0.8], [0.8, 0.8], [0.8, 0.2] // Front half Pegasus square
        ],
        yogataras: [1] // Markab (Alpha Peg)
    },
    // 26. Uttara Bhadrapada (Pegasus/Andromeda - Gamma Pegasi)
    "Uttara Bhadrapada": {
        points: [
            [0.2, 0.8], [0.8, 0.8], [0.8, 0.2], // Square part
            [0.8, 0.8], [0.9, 0.9] // Link to Andromeda
        ],
        yogataras: [2] // Algenib (Gamma Peg)
    },
    // 27. Revati (Pisces - Zeta Piscium)
    "Revati": {
        points: [
            [0.1, 0.2], [0.4, 0.5], [0.1, 0.8], // V shape cord
            [0.4, 0.5], [0.7, 0.2], // Extension to stinger
            [0.7, 0.2], [0.8, 0.3], [0.9, 0.1], [0.7, 0.2] // Terminal Fish
        ],
        yogataras: [1] // Zeta Piscium
    }
};

// --- HELPERS ---
const toJD = ms => ms / 86400000 + 2440587.5;
const fromJD = jd => new Date((jd - 2440587.5) * 86400000);
const formatJDForInput = jd => fromJD(jd).toISOString().split('T')[0];
const norm = d => ((d % 360) + 360) % 360;

const formatInTz = (jd, timezone, full = false, refJD = null) => {
    // jd to UTC Date
    const d = new Date((jd - 2440587.5) * 86400000);

    const options = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    if (full) {
        options.weekday = 'short';
        options.day = '2-digit';
        options.month = 'short';
        options.year = 'numeric';
    }

    try {
        const formatter = new Intl.DateTimeFormat('en-US', options);
        let str = formatter.format(d);

        let suffix = "";
        if (refJD) {
            const simDate = new Date((refJD - 2440587.5) * 86400000);
            const dStr = d.toLocaleDateString('en-US', { timeZone: timezone });
            const refStr = simDate.toLocaleDateString('en-US', { timeZone: timezone });
            if (dStr !== refStr && jd > refJD) {
                suffix = " (+1)";
            }
        }

        if (full) {
            // Get timezone name/abbreviation
            const tzName = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                timeZoneName: 'short'
            }).formatToParts(d).find(p => p.type === 'timeZoneName')?.value || timezone;
            return `${str} (${tzName})${suffix}`;
        }
        return str + suffix;
    } catch (e) {
        console.error("Formatting error for TZ:", timezone, e);
        return d.toUTCString();
    }
};

const getEstimateTz = (lon) => {
    // Legacy helper - no longer used as primary, but kept for fallback
    if (lon > 68 && lon < 98) return "Asia/Kolkata";
    return "UTC";
};

const findNM = (jd, direction) => {
    let currentJD = jd + (direction * 0.5); // Jump out of current basin
    for (let i = 0; i < 12; i++) {
        const s = swe.calc_ut(currentJD, swe.SE_SUN, swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL)[0];
        const m = swe.calc_ut(currentJD, swe.SE_MOON, swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL)[0];

        if (i === 0) {
            let elong = (m - s + 360) % 360;
            if (direction < 0) currentJD -= elong / 12.19;
            else currentJD += (360 - elong) / 12.19;
        } else {
            let diff = m - s;
            while (diff < -180) diff += 360;
            while (diff > 180) diff -= 360;
            currentJD -= diff / 12.19;
        }
    }
    return currentJD;
};

// Singleton instance
const swe = new SwissEph();

/**
 * Robust Newton-Raphson solver for astronomical events (Tithi/Nakshatra transitions).
 * Uses real-time derivative (speed) for maximum accuracy.
 */
const findTransitJD = (jd, target, type) => {
    let currentJD = jd;
    const getVal = (j) => {
        const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL;
        const s = swe.calc_ut(j, swe.SE_SUN, flags)[0];
        const m = swe.calc_ut(j, swe.SE_MOON, flags)[0];
        if (type === 'TITHI' || type === 'KARANA') return norm(m - s);
        if (type === 'YOGA') return norm(s + m);
        return norm(m); // Default: NAK (Moon Longitude)
    };

    for (let i = 0; i < 10; i++) {
        const val = getVal(currentJD);
        let diff = target - val;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;

        if (Math.abs(diff) < 1e-8) break; // ~1ms precision

        // Calculate instant speed (derivative)
        const delta = 0.0001;
        const v2 = getVal(currentJD + delta);
        let speed = (v2 - val);
        while (speed < -180) speed += 360;
        while (speed > 180) speed -= 360;
        speed /= delta;

        // Newton-Raphson step
        currentJD += diff / speed;
    }
    return currentJD;
};

/**
 * Robustly finds the Lunar New Year (Ugadi) for a given Gregorian year.
 * Ugadi is the start of Chaitra (Nija or Adhika).
 */
const findUgadiJD = (year) => {
    // 1. Find Mesha Sankranti (Sun = 0° Sidereal)
    // Starting anchor around April 14
    let msJD = swe.julday(year, 4, 14, 0);
    for (let i = 0; i < 10; i++) {
        const sunPos = swe.calc_ut(msJD, swe.SE_SUN, swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL);
        const sun = norm(sunPos[0]);
        const diff = sun > 180 ? sun - 360 : sun;
        msJD -= diff / 0.9856;
    }

    // 2. The New Moon preceding Mesha Sankranti starts the Nija Chaitra moon cycle.
    const nmNija = findNM(msJD, -1);

    // 3. Check if the month before Nija Chaitra was Adhika Chaitra.
    // A month is Adhika if no zodiac boundary (Sankranti) is crossed within it.
    const nmPrev = findNM(nmNija - 1, -1);
    const s0 = swe.calc_ut(nmPrev, swe.SE_SUN, swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL)[0];
    const s1 = swe.calc_ut(nmNija, swe.SE_SUN, swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL)[0];
    const r0 = Math.floor(norm(s0) / 30);
    const r1 = Math.floor(norm(s1) / 30);

    // If Sun stayed in the same Rasi (Index 11 / Meena) throughout, then nmPrev was Adhika Chaitra.
    return (r0 === r1) ? nmPrev : nmNija;
};

/**
 * Constellation Renders a group of stars and connecting lines
 */
function Constellation({ points, color, active, scale = 1, yogataras = [] }) {
    const starRef = useRef();

    useFrame(({ clock }) => {
        if (starRef.current && active) {
            const t = clock.getElapsedTime();
            starRef.current.intensity = 1 + Math.sin(t * 3) * 0.5;
        }
    });

    return (
        <group>
            {/* Stars */}
            {points.map((p, i) => {
                const isYogatara = yogataras.includes(i);
                // Highlight if it's a Yogatara (always visible), OR if it's the only star
                const isHighlight = isYogatara || (points.length === 1);

                return (
                    <group key={i} position={[0, p[1] * scale - (scale / 2), (p[0] - 0.5) * scale]}>
                        <mesh>
                            <sphereGeometry args={[isHighlight ? 0.35 : 0.04, 16, 16]} />
                            <meshStandardMaterial
                                color={isHighlight ? "#ffffff" : "#e2e8f0"} // Neutral Stellar White
                                emissive={isHighlight ? "#ffffff" : "#e2e8f0"}
                                emissiveIntensity={isHighlight ? 50 : (active ? 2 : 0.5)}
                                transparent
                                opacity={(active || isHighlight) ? 1 : 0.4}
                            />
                        </mesh>
                        {isHighlight && (
                            <pointLight ref={starRef} distance={8} intensity={6} color="white" />
                        )}
                    </group>
                );
            })}

            {/* Outline Lines - Uniform Silver - Tangential Plane */}
            {points.length > 1 && (
                <line>
                    <bufferGeometry>
                        <float32BufferAttribute
                            attach="attributes-position"
                            count={points.length}
                            array={new Float32Array(points.flatMap(p => [0, p[1] * scale - (scale / 2), (p[0] - 0.5) * scale]))}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="#94a3b8" transparent opacity={active ? 0.8 : 0.4} />
                </line>
            )}
        </group>
    );
}

/**
 * HighlightBeam A glowing line projecting from a source to a target radius
 */
function HighlightBeam({ sourcePos, angle, radius, color, active, beamMeshRef, offset = 0, beamWidth = 2.5 }) {
    if (!active) return null;
    const height = radius - offset;
    return (
        <group rotation={[0, angle, 0]} position={sourcePos || [0, 0, 0]}>
            <mesh ref={beamMeshRef} rotation={[0, 0, Math.PI / 2]} position={[offset + height / 2, 0, 0]}>
                <cylinderGeometry args={[0.01, beamWidth, height, 32, 1, true]} />
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={0.15}
                    emissive={color}
                    emissiveIntensity={3}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <pointLight position={[radius, 0, 0]} intensity={3} distance={15} color={color} />
        </group>
    );
}

/**
 * Utility component to make camera follow a specific target
 */

/**
 * Helper to convert decimal degrees to Degrees° Minutes' format
 */
const toDMS = (deg) => {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    return `${d}° ${m.toString().padStart(2, '0')}'`;
};

function ZodiacWheel({ radius, segments, labels, dataKeys, color, activeIndex, labelScale = 1, showPadas = false, outerRadius }) {
    const angleStep = (Math.PI * 2) / segments;

    return (
        <group>
            {/* The Ring Base */}
            {/* The Ring Base - Solid Band for Chakra Alignment */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                {/* Width 6 units (Radius +/- 3). Rasi (60) meets Nakshatra (54) exactly at 57 */}
                <ringGeometry args={[radius - 3.0, radius + 3.0, 128]} />
                <meshBasicMaterial
                    color={color}
                    opacity={0.25}
                    transparent
                    side={THREE.DoubleSide}
                    depthWrite={false} // Prevent z-fighting transparency issues
                />
            </mesh>

            {/* Dividers */}
            {labels.map((_, i) => {
                // Main segment divider
                const angle = i * angleStep;
                const isRasiAlignment = showPadas && (i * 4) % 9 === 0;

                return (
                    <group key={`div-${i}`} rotation={[0, angle, 0]}>
                        {/* Main Divider - Full band width (6.0) */}
                        <mesh position={[radius, 0, 0]}>
                            {/* Length 6.0 spans the 51-57 or 57-63 bands perfectly */}
                            <boxGeometry args={[6.0, 0.05, isRasiAlignment ? 0.08 : 0.04]} />
                            <meshBasicMaterial
                                color={isRasiAlignment ? "#FFD700" : "#FFFFFF"}
                                opacity={isRasiAlignment ? 0.8 : 0.3}
                                transparent
                            />
                        </mesh>
                    </group>
                );
            })}

            {/* Padas (Sub-dividers) - Only for Nakshatras */}
            {showPadas && labels.map((_, i) => {
                return [1, 2, 3].map(p => {
                    const subAngle = (i * angleStep) + (p * (angleStep / 4));
                    const globalPadaIdx = i * 4 + p;
                    const isRasiBound = globalPadaIdx % 9 === 0;

                    return (
                        <group key={`pada-${i}-${p}`} rotation={[0, subAngle, 0]}>
                            <mesh position={[radius, 0, 0]}>
                                {/* Short tick for Padas */}
                                <boxGeometry args={[isRasiBound ? 6.0 : 1.5, 0.03, isRasiBound ? 0.06 : 0.02]} />
                                <meshBasicMaterial
                                    color={isRasiBound ? "#FFD700" : color}
                                    opacity={isRasiBound ? 0.8 : 0.4}
                                    transparent
                                />
                            </mesh>
                        </group>
                    );
                });
            })}

            {/* Labels and Highlights (Centered in segments) */}
            {labels.map((label, i) => {
                const angle = (i + 0.5) * angleStep; // CCW (Prograde) distribution
                const isSelected = i === activeIndex;
                const degStart = i * (360 / segments);
                const degEnd = (i + 1) * (360 / segments);
                // Try to get English name if available in dataKeys (depends on mapping)
                const enName = dataKeys && dataKeys[i] ? dataKeys[i] : label;

                return (
                    <group key={`label-${i}`} rotation={[0, angle, 0]}>
                        {/* Segment Fill */}
                        {isSelected && (
                            <group>
                                <mesh rotation={[Math.PI / 2, 0, 0]}>
                                    <ringGeometry args={[radius - 3.0, radius + 3.0, 32, 1, -angleStep / 2, angleStep]} />
                                    <meshBasicMaterial
                                        color={color}
                                        opacity={0.4}
                                        transparent
                                        side={THREE.DoubleSide}
                                    />
                                </mesh>
                            </group>
                        )}

                        {/* Label */}
                        <Html
                            position={[radius + 1.8, 0, 0]}
                            center
                            distanceFactor={45}
                            zIndexRange={[100, 0]}
                            style={{ pointerEvents: 'none' }} // Let clicks pass through, but we need pointer-events-auto on the content for hover
                        >
                            <div className="relative flex flex-col items-center group pointer-events-auto">
                                {/* The Label Pill */}
                                <div
                                    className={`transition-all duration-500 cursor-help px-3 py-1 rounded-full whitespace-nowrap font-bold tracking-tighter shadow-lg border backdrop-blur-md font-mono uppercase ${isSelected ? 'text-white bg-white/25 border-white/60 shadow-[0_0_12px_rgba(255,255,255,0.4)] opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
                                    style={{
                                        transform: `scale(${isSelected ? 1.4 : 1.1})`,
                                        backgroundColor: isSelected ? undefined : 'rgba(0,0,0,0.6)',
                                        color: isSelected ? undefined : color,
                                        borderColor: isSelected ? undefined : color,
                                        fontSize: `${18 * labelScale}px`
                                    }}
                                >
                                    {label}
                                </div>

                                {isSelected && (
                                    <div className="text-[8px] text-white mt-1 font-mono animate-pulse opacity-90 bg-black/60 px-2 rounded tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.3)] border border-white/20">
                                        ACTIVE
                                    </div>
                                )}

                                {/* Custom CSS Tooltip (Refined Style & Format) */}
                                <div className="absolute bottom-full mb-3 bg-black/90 backdrop-blur-xl border border-white/20 text-white rounded-xl p-5 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-max z-[9999] shadow-2xl scale-95 group-hover:scale-100 origin-bottom transform transition-all">
                                    <div className="font-mono space-y-2">
                                        <p className="font-bold text-yellow-500 text-2xl tracking-wide uppercase leading-none">{enName}</p>
                                        <p className="text-lg text-white/80 font-bold tracking-tight">{toDMS(degStart)} - {toDMS(degEnd)}</p>
                                    </div>
                                    {/* Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/90"></div>
                                </div>
                            </div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
}

function CameraFollower({ target, targetsRef }) {
    const { controls, camera } = useThree();

    useFrame(() => {
        if (!controls || !targetsRef.current) return;

        let targetPos = new THREE.Vector3(0, 0, 0);
        let minD = 10, maxD = 60;

        if (target === 'EARTH' && targetsRef.current.earth) {
            targetsRef.current.earth.getWorldPosition(targetPos);
            minD = 1.5; maxD = 450;
        } else if (target === 'MOON' && targetsRef.current.moon) {
            targetsRef.current.moon.getWorldPosition(targetPos);
            minD = 0.5; maxD = 450;
        } else if (target === 'RAHU' && targetsRef.current.rahu) {
            targetsRef.current.rahu.getWorldPosition(targetPos);
            minD = 0.3; maxD = 450;
        } else if (target === 'KETU' && targetsRef.current.ketu) {
            targetsRef.current.ketu.getWorldPosition(targetPos);
            minD = 0.3; maxD = 450;
        } else if (target?.startsWith('PLANET_')) {
            const ref = targetsRef.current[target.toLowerCase()];
            if (ref) {
                ref.getWorldPosition(targetPos);
                minD = 2; maxD = 450;
            }
        } else {
            // SUN
            minD = 5; maxD = 450; // Use larger max distance to view the expanded Chakras (R=150)
        }

        controls.target.lerp(targetPos, 0.1);
        controls.minDistance = minD;
        controls.maxDistance = maxD;
        controls.update();
    });
    return null;
}

function SolarSystem({ speed, paused, anchorJD, location, onUpdate, sweReady, targetsRef, onFocus, focusTarget }) {
    // ... rest of the component
    const sunMesh = useRef();
    const earthOrbit = useRef();
    const earthMesh = useRef();
    const moonOrbit = useRef();
    const moonMesh = useRef();
    const nakshatraWheel = useRef();
    const sunBeamRef = useRef();
    const sunBeamMeshRef = useRef();
    const moonBeamRef = useRef();
    const moonBeamMeshRef = useRef();
    const nodeGroupRef = useRef();

    // Determine active datasets based on language
    const lang = location.lang || 'en';
    const ui = UI_STRINGS[lang];
    const NAKSHATRAS = lang === 'te' ? NAKSHATRAS_TE : NAKSHATRAS_EN;
    const RASIS = lang === 'te' ? RASIS_TE : RASIS_EN;
    const SHUKLA = lang === 'te' ? SHUKLA_TE : SHUKLA_EN;
    const KRISHNA = lang === 'te' ? KRISHNA_TE : KRISHNA_EN;
    const MAASAMS = lang === 'te' ? MAASAMS_TE : MAASAMS_EN;
    const YOGAS = lang === 'te' ? YOGAS_TE : YOGAS_EN;
    const KARANAS = lang === 'te' ? KARANAS_TE : KARANAS_EN;
    const SAMVATHSARAMS = lang === 'te' ? SAMVATHSARAMS_TE : SAMVATHSARAMS_EN;
    const VARAMS = lang === 'te' ? VARAMS_TE : VARAMS_EN;

    const [activeRasi, setActiveRasi] = useState(0);
    const [activeNak, setActiveNak] = useState(0);
    const elapsed = useRef(0);
    const last = useRef(null);
    const ugadiCache = useRef({});
    const epheCache = useRef({ day: -1, sunrise: null, sunset: null, location: null });

    // Navagraha State
    const [planetPos, setPlanetPos] = useState({});
    const [nodePos, setNodePos] = useState({ rahu: 0, ketu: 0 });

    // Load textures
    const base = import.meta.env.BASE_URL;
    const earthMap = useTexture(`${base}assets/earth_vibrant.png`);
    const sunMap = useTexture(`${base}assets/sun_texture.png`);
    const moonMap = useTexture(`${base}assets/moon_texture.png`);
    const mercuryMap = useTexture(`${base}assets/mercury.png`);
    const venusMap = useTexture(`${base}assets/venus.png`);
    const marsMap = useTexture(`${base}assets/mars.png`);
    const jupiterMap = useTexture(`${base}assets/jupiter.png`);
    const saturnMap = useTexture(`${base}assets/saturn.png`);

    const planetTextures = {
        2: mercuryMap,
        3: venusMap,
        4: marsMap,
        5: jupiterMap,
        6: saturnMap
    };

    // Reset elapsed time when the anchor changes manually
    useEffect(() => {
        elapsed.current = 0;
    }, [anchorJD]);

    useFrame((state) => {
        if (!sweReady) return;

        const now = performance.now() / 1000;
        if (!last.current) { last.current = now; return; }
        const delta = now - last.current;
        last.current = now;

        if (!paused) {
            elapsed.current += delta * speed;
        }

        const simJD = anchorJD + elapsed.current;
        const simDate = fromJD(simJD);
        const year = simDate.getUTCFullYear();

        // High-precision Topocentric settings
        swe.set_topo(location.lon, location.lat, location.alt);
        const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL;

        // Perform calculation
        const sunPos = swe.calc_ut(simJD, swe.SE_SUN, flags);
        const moonPos = swe.calc_ut(simJD, swe.SE_MOON, flags);

        const sun = norm(sunPos[0]);
        const moon = norm(moonPos[0]);
        const elong = norm(moon - sun);

        // Update active indices and precise degrees
        const rIdx = Math.floor(sun / 30);
        if (rIdx !== activeRasi) setActiveRasi(rIdx);
        const nIdx = Math.floor(moon / (360 / 27));
        if (nIdx !== activeNak) setActiveNak(nIdx);

        // Update Sun & Moon beams to account for parallax (Point from Earth to current highlight segments on Sun-centered wheels)
        // Hardcoded Visual Radii
        const R_BEAM = 150;

        if (targetsRef.current?.earth) {
            const earthPos = new THREE.Vector3();
            targetsRef.current.earth.getWorldPosition(earthPos);

            // 1. Sun Beam (Geocentric Rashi)
            if (sunBeamRef.current) {
                sunBeamRef.current.position.copy(earthPos);
                const sunRad = THREE.MathUtils.degToRad(sun);
                const targetSunX = R_BEAM * Math.cos(sunRad);
                const targetSunZ = -R_BEAM * Math.sin(sunRad);
                const dSunX = targetSunX - earthPos.x;
                const dSunZ = targetSunZ - earthPos.z;
                const distSun = Math.sqrt(dSunX * dSunX + dSunZ * dSunZ);
                sunBeamRef.current.rotation.y = Math.atan2(-dSunZ, dSunX);

                if (sunBeamMeshRef.current) {
                    const offset = 0.5; // Earth radius offset
                    const height = distSun - offset;
                    sunBeamMeshRef.current.scale.y = height / (R_BEAM - offset);
                    sunBeamMeshRef.current.position.x = offset + height / 2;
                }
            }

            // 2. Moon Beam (Geocentric Nakshatra)
            if (moonBeamRef.current) {
                moonBeamRef.current.position.copy(earthPos);
                const moonRad = THREE.MathUtils.degToRad(moon);
                const targetMoonX = R_BEAM * Math.cos(moonRad);
                const targetMoonZ = -R_BEAM * Math.sin(moonRad);
                const dMoonX = targetMoonX - earthPos.x;
                const dMoonZ = targetMoonZ - earthPos.z;
                const distMoon = Math.sqrt(dMoonX * dMoonX + dMoonZ * dMoonZ);
                const beamRot = Math.atan2(-dMoonZ, dMoonX);
                moonBeamRef.current.rotation.y = beamRot;

                if (moonBeamMeshRef.current) {
                    const offset = 0.5; // Earth radius offset
                    const height = distMoon - offset;
                    moonBeamMeshRef.current.scale.y = height / (R_BEAM - offset);
                    moonBeamMeshRef.current.position.x = offset + height / 2;
                }

                // Sync Moon Orbit mesh to follow this beam exactly (eliminates parallax drift)
                if (moonOrbit.current && earthOrbit.current) {
                    moonOrbit.current.rotation.y = beamRot - earthOrbit.current.rotation.y;
                }
            }
        }

        // --- PRECISE PANCHAANGAM LOGIC ---
        // 1. Find the current lunar month's boundaries
        const prevNM = findNM(simJD, -1);
        const nextNM = findNM(simJD, 1);

        // 2. Maasam Logic (Amantha)
        // A month is named after the Rasi the sun enters during its duration.
        const s1 = swe.calc_ut(prevNM, swe.SE_SUN, swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL)[0];
        const s2 = swe.calc_ut(nextNM, swe.SE_SUN, swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL)[0];
        const r1 = Math.floor(norm(s1) / 30);
        const r2 = Math.floor(norm(s2) / 30);

        let amantha = "";
        if (r1 === r2) amantha = ui.adhika + " " + MAASAMS[(r2 + 1) % 12];
        else amantha = MAASAMS[r2];

        // 3. Soura Masam (Solar Month based on Sun's Rasi)
        const soura = RASIS[Math.floor(sun / 30)];

        // 3. Samvathsaram (Changes exactly at the New Year / Ugadi)
        if (!ugadiCache.current[year]) {
            // First time in this Gregorian year, define the anchor
            swe.set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0); // Explicitly use Lahiri Ayanamsa
            ugadiCache.current[year] = findUgadiJD(year);
        }

        const u = ugadiCache.current[year];
        const isAfterUgadi = simJD >= (u - 0.001);

        // Before Ugadi of current Gregorian year, we use the cycle of the previous Gregorian year.
        const lAnchor = isAfterUgadi ? year : year - 1;
        const samvathsaram = SAMVATHSARAMS[(lAnchor - 1987 + 60) % 60];

        // 4. Tithi (Compact)
        const tIdx = Math.floor(elong / 12);
        const tithi = elong < 180 ? SHUKLA[tIdx] : KRISHNA[tIdx - 15];
        const tithiTarget = (tIdx + 1) * 12;
        const tEndJD = findTransitJD(simJD, tithiTarget, 'TITHI');
        const tithiUntil = formatInTz(tEndJD, location.timezone, false, simJD);

        // 5. Nakshatra (27 divisions)
        const moonIdx = Math.floor(moon / (360 / 27));
        const nakshatra = NAKSHATRAS[moonIdx];
        const nTarget = norm((moonIdx + 1) * (360 / 27));
        const nEndJD = findTransitJD(simJD, nTarget, 'NAK');
        const nakshatraUntil = formatInTz(nEndJD, location.timezone, false, simJD);

        // 6. Yoga (Sun + Moon / 13.33)
        const yogaLong = norm(sun + moon);
        const yogaIdx = Math.floor(yogaLong / (360 / 27));
        const yoga = YOGAS[yogaIdx];
        const yogaTarget = norm((yogaIdx + 1) * (360 / 27));
        const yogaEndJD = findTransitJD(simJD, yogaTarget, 'YOGA');
        const yogaUntil = formatInTz(yogaEndJD, location.timezone, false, simJD);

        // 7. Karana (Half of Tithi, 6 degrees each)
        let kIdx;
        const totalHalfTithi = Math.floor(elong / 6);
        if (totalHalfTithi === 0) kIdx = 10; // Kimstughna
        else if (totalHalfTithi >= 57) kIdx = 7 + (totalHalfTithi - 57); // Shakuni...
        else kIdx = ((totalHalfTithi - 1) % 7); // Bava...Vanija
        const karana = KARANAS[kIdx];

        const karanaTarget = (totalHalfTithi + 1) * 6;
        const karanaEndJD = findTransitJD(simJD, karanaTarget, 'KARANA');
        const karanaUntil = formatInTz(karanaEndJD, location.timezone, false, simJD);

        // 8. Rasi
        const rasi = RASIS[Math.floor(sun / 30)];

        // 9. Varam (day of week in observer's local timezone)
        // swe.day_of_week uses UTC-based JD which gives wrong results
        // for timezones ahead of UTC (e.g., IST midnight = previous UTC day)
        const simDateUtc = fromJD(simJD);
        const localDateStr = simDateUtc.toLocaleDateString('en-US', { timeZone: location.timezone });
        const varamIdx = new Date(localDateStr).getDay();
        const varam = VARAMS[varamIdx];

        // 10. Location-based (Sunrise, Sunset, Lagnam)
        let sunrise = epheCache.current.sunrise || "---";
        let sunset = epheCache.current.sunset || "---";
        const simDateFloor = Math.floor(simJD + 0.5); // Midnight anchor

        if (epheCache.current.day !== simDateFloor ||
            epheCache.current.location?.lat !== location.lat ||
            epheCache.current.location?.lon !== location.lon) {

            try {
                const geopos = [location.lon, location.lat, location.alt];
                // Sunrise — use fixed wrapper with proper C API pointer signatures
                const riseJD = riseTransFixed(swe, simJD, swe.SE_SUN, swe.SEFLG_SWIEPH, 1, geopos, 1013.25, 15);
                if (riseJD) {
                    sunrise = formatInTz(riseJD, location.timezone, false, simJD);
                }

                // Sunset
                const setJD = riseTransFixed(swe, simJD, swe.SE_SUN, swe.SEFLG_SWIEPH, 2, geopos, 1013.25, 15);
                if (setJD) {
                    sunset = formatInTz(setJD, location.timezone, false, simJD);
                }

                epheCache.current = { day: simDateFloor, sunrise, sunset, location: { ...location } };
            } catch (e) {
                console.error("Sunrise/Sunset Calculation Error:", e);
            }
        }

        // 11. Lagnam (Ascendant)
        let lagnam = "---";
        let lagnamLong = 0;
        try {
            // Calculate Houses (try Whole Sign first, fallback to Placidus 'P')
            let h = swe.houses(simJD, location.lat, location.lon, 'W');
            if (!h || !h.ascmc) h = swe.houses(simJD, location.lat, location.lon, 'P');

            if (h && h.ascmc) {
                lagnamLong = norm(h.ascmc[0]);
                lagnam = RASIS[Math.floor(lagnamLong / 30)] + " " + (ui?.lagnam || "Lagnam");
            }
        } catch (e) {
            console.error("Lagnam Calculation Error:", e);
        }

        onUpdate({
            date: formatInTz(simJD, location.timezone, true),
            amantha,
            soura,
            tithi,
            nakshatra,
            yoga,
            karana,
            rasi,
            varam,
            samvathsaram,
            elong,
            sun,
            moon,
            ayanamsa: swe.get_ayanamsa_ut(simJD),
            sunrise,
            sunset,
            lagnam,
            lagnamLong,
            nakshatraUntil,
            tithiUntil,
            yogaUntil,
            karanaUntil,
            eclipse: (() => {
                // Persistent Day-wide Eclipse Detection (NASA/ISRO precision)
                try {
                    const simDate = fromJD(simJD);
                    const y = simDate.getUTCFullYear();
                    const m = simDate.getUTCMonth();
                    const d = simDate.getUTCDate();

                    const simDayKey = `${y}-${m + 1}-${d}`;
                    const cacheKey = `${simDayKey}-${location.lat.toFixed(1)}-${location.lon.toFixed(1)}`;

                    if (epheCache.current.eclipseKey === cacheKey) {
                        return epheCache.current.eclipseData;
                    }

                    // Use corrected WASM-level eclipse detection
                    const formatTimeFn = (jd) => formatInTz(jd, location.timezone, false, simJD);
                    const eclipseData = detectEclipse(swe, simJD, flags, location, ui, formatTimeFn);

                    epheCache.current.eclipseKey = cacheKey;
                    epheCache.current.eclipseData = eclipseData;
                    return eclipseData;
                } catch (e) {
                    console.error("Day-wide eclipse calc error:", e);
                    return null;
                }
            })()
        });

        // --- NAVAGRAHA CALCULATIONS ---

        // 1. Starry Planets (Heliocentric)
        const pPos = {};
        PLANET_DATA.forEach(p => {
            // calc_ut with SEFLG_HELCTR for Heliocentric
            const res = swe.calc_ut(simJD, p.id, swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL | swe.SEFLG_HELCTR);
            if (res) {
                pPos[p.id] = { long: norm(res[0]), dist: res[2] };
            }
        });
        setPlanetPos(pPos);

        // 2. Nodes (Geocentric - Relative to Earth)
        // Rahu = Mean Node (SE_MEAN_NODE = 10) or True Node (SE_TRUE_NODE = 11). Usually Mean for Panchangam.
        // We use Moon Node (Mean) -> SE_MEAN_NODE
        const nodeRes = swe.calc_ut(simJD, swe.SE_MEAN_NODE, swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL);
        if (nodeRes) {
            const rahuLong = norm(nodeRes[0]);
            const ketuLong = norm(rahuLong + 180);
            setNodePos({ rahu: rahuLong, ketu: ketuLong });
        }

        // 3D Visualization updates (Physical Accuracy)
        // 1. Earth Orbit (Prograde CCW)
        if (earthOrbit.current) {
            // Earth is at longitude sun+180 relative to Sun
            earthOrbit.current.rotation.y = THREE.MathUtils.degToRad(sun + 180);

            // Dynamic distance (Ellipticity) - sqrt-compressed AU scaling
            const r = auToVisual(sunPos[2]);
            // The Earth Unit is the first child group
            const earthUnit = earthOrbit.current.children[0];
            if (earthUnit) earthUnit.position.set(r, 0, 0);
        }

        // 2. Earth Axial Rotation (Sidereal & Sun-Synchronized)
        if (earthMesh.current) {
            const gst = swe.sidtime(simJD); // Hours GST
            // Formula: Rotation = (Sidereal Time) - (Sun Longitude) + Phase
            // We use Sidereal sun here because the parent earthOrbit is already in the sidereal frame.
            // The +180 aligns the prime meridian face with the Sun light source.
            earthMesh.current.rotation.y = THREE.MathUtils.degToRad(gst * 15 - sun + 180);
        }

        // 3. Moon Orbit (Prograde CCW relative to Earth)
        // Moon orbit is rotated by beamRot in beam logic earlier

        // Dynamic distance for Moon
        if (moonOrbit.current) {
            const mR = 1.5 * (moonPos[2] / 0.002569);
            const moonMeshGroup = moonOrbit.current.children[0];
            if (moonMeshGroup) moonMeshGroup.position.set(mR, 0, 0);
        }

        // 4. Moon Axial Rotation (Synchronous)
        if (moonMesh.current) {
            // Face always towards Earth - with 180 flip to align with position logic
            moonMesh.current.rotation.y = Math.PI;

            // UPDATE: Ensure Spotlight targets the Moon for phase visualization if ref exists
            // Since moonMesh is deep in the tree to move with orbit, we can't easily pass it as a prop to a root light.
            // But we can let the light lookAt it if we have a mutable ref at root.
            // Or cleaner: Add SpotLight attached to Sun, pointing at Moon position.
            // Since Moon position is complex (Earth relative), simpler to put SpotLight in Scene and update target.
            // We will use a dummy target object at the Moon's world coords.
        }

        // 5. Sun Axial Rotation
        if (sunMesh.current && !paused) {
            sunMesh.current.rotation.y += (Math.PI * 2 / 27) * (delta * speed);
        }

        // 6. Nakshatra Wheel Counter-rotation removed - it is now fixed at the center

        // 7. Node Group Rotation (Stabilize frame to Ecliptic)
        if (nodeGroupRef.current) {
            nodeGroupRef.current.rotation.y = -THREE.MathUtils.degToRad(sun + 180);
        }

        // 8. Update SpotLight Target Position (for Moon Phases)
        if (targetsRef.current?.moon && targetsRef.current?.moonLightTarget) {
            const mPos = new THREE.Vector3();
            targetsRef.current.moon.getWorldPosition(mPos);
            targetsRef.current.moonLightTarget.position.copy(mPos);
        }
    });

    // Beams for Sun and Moon
    const sunAngle = THREE.MathUtils.degToRad(activeRasi * 30 + 15); // Center of Rasi
    const moonAngle = THREE.MathUtils.degToRad(activeNak * (360 / 27) + (360 / 27) / 2); // Center of Nakshatra

    // Derived from AU_SCALE — all positions scale together
    const R_WHEEL_RASI = R_VIS_RASI;
    const R_WHEEL_NAK = R_VIS_NAK;
    const R_BEAM_LEN = R_VIS_CONSTELLATION;

    return (
        <group>
            {/* Sun */}
            <mesh ref={sunMesh} onClick={(e) => { e.stopPropagation(); onFocus?.('SUN'); }}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshStandardMaterial
                    map={sunMap}
                    emissiveMap={sunMap}
                    emissive="#FF8C00"
                    emissiveIntensity={1}
                    toneMapped={true}
                />
                <Html position={[0, 2.5, 0]} center distanceFactor={45}>
                    <div onClick={() => onFocus?.('SUN')} className={`text-[14px] px-3 py-1 rounded-full whitespace-nowrap backdrop-blur-sm border tracking-widest uppercase font-mono font-bold cursor-pointer transition-all ${focusTarget === 'SUN' ? 'text-yellow-100 bg-yellow-500/30 border-yellow-400/60 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'text-white bg-black/50 border-white/20 hover:bg-white/20 shadow-[0_0_15px_rgba(255,140,0,0.2)]'}`}>{ui.sun}</div>
                </Html>
            </mesh>
            <pointLight intensity={0.8} distance={0} decay={0} color="#fffaed" />
            <hemisphereLight intensity={0.25} groundColor="#111111" color="#ffffff" />
            {/* Spotlight for dramatic Moon Phases - DISABLED for Accuracy */
                /* 
                <spotLight
                    position={[0, 0, 0]}
                    intensity={150}
                    distance={200}
                    angle={0.12}
                    penumbra={0}
                    decay={1}
                    color="#ffffff"
                    target={targetsRef.current?.moonLightTarget || sunMesh.current} // Fallback to avoid error
                />
                 */
            }
            {/* Dummy target for spotlight */}
            <primitive object={new THREE.Object3D()} ref={(el) => { if (targetsRef.current) targetsRef.current.moonLightTarget = el; }} />

            {/* Rashi Wheel (Around Sun) - Outer Ring */}
            <ZodiacWheel
                radius={R_WHEEL_RASI}
                segments={12}
                labels={RASIS}
                dataKeys={RASIS_EN}
                color="#f87171" // rose-400 equivalent
                activeIndex={activeRasi}
                labelScale={1.5}
            />

            {/* Sun Position Beam (Geocentric - from Earth) */}
            <group ref={sunBeamRef}>
                <HighlightBeam
                    angle={0}
                    radius={R_BEAM_LEN}
                    color="#f87171"
                    active={true}
                    beamMeshRef={sunBeamMeshRef}
                    offset={0.5} // Earth radius
                    beamWidth={2.5}
                />
            </group>

            {/* Nakshatra Wheel (Around Sun) - Inner Ring */}
            <ZodiacWheel
                radius={R_WHEEL_NAK}
                segments={27}
                labels={NAKSHATRAS}
                dataKeys={NAKSHATRAS_EN}
                color="#bae6fd" // Lighter blue (blue-200) for fresh look
                activeIndex={activeNak}
                labelScale={1.2}
                showPadas={true}
                outerRadius={R_WHEEL_RASI} // Connect to Rasi wheel
            />

            {/* Dynamic Moon Beam projection from Earth */}
            <group ref={moonBeamRef}>
                <HighlightBeam
                    angle={0}
                    radius={R_BEAM_LEN}
                    color="#93c5fd"
                    active={true}
                    beamMeshRef={moonBeamMeshRef}
                    offset={0.5} // Earth radius
                    beamWidth={1.8}
                />
            </group>

            {/* Other Planets (Heliocentric) */}
            {PLANET_DATA.map(p => (
                <PlanetOrbit
                    key={p.id}
                    data={p}
                    map={planetTextures[p.id]}
                    ephemeris={planetPos[p.id]}
                    lang={location.lang}
                    isActive={!paused}
                    speed={speed}
                    onFocus={onFocus}
                    targetsRef={targetsRef}
                    focusTarget={focusTarget}
                />
            ))}

            {/* Earth Unit */}
            <group ref={earthOrbit}>
                <group> {/* Earth Unit Container moved by distance */}
                    {/* Earth Axis tilt (23.4 degrees) */}
                    <group rotation={[0.409, 0, 0]}>
                        <mesh ref={(el) => { earthMesh.current = el; if (targetsRef) targetsRef.current.earth = el; }} onClick={(e) => { e.stopPropagation(); onFocus?.('EARTH'); }}>
                            <sphereGeometry args={[0.7, 64, 64]} />
                            <meshPhysicalMaterial
                                map={earthMap}
                                roughness={0.4}
                                metalness={0.1}
                                clearcoat={0.3}
                                clearcoatRoughness={0.1}
                            />
                            <Html position={[0, 1.4, 0]} center distanceFactor={45}>
                                <div onClick={() => onFocus?.('EARTH')} className={`text-[14px] px-3 py-1 rounded-full whitespace-nowrap backdrop-blur-sm border tracking-widest uppercase font-mono font-bold cursor-pointer transition-all ${focusTarget === 'EARTH' ? 'text-blue-100 bg-blue-500/30 border-blue-400/60 shadow-[0_0_15px_rgba(96,165,250,0.5)]' : 'text-white bg-black/50 border-white/20 hover:bg-white/20'}`}>{ui.earth}</div>
                            </Html>
                        </mesh>
                    </group>

                    {/* Rahu / Ketu (Geocentric - orbiting Earth) */}
                    <group ref={nodeGroupRef}>
                        <LunarNodes nodePos={nodePos} lang={location.lang} onFocus={onFocus} focusTarget={focusTarget} targetsRef={targetsRef} />
                    </group>

                    <group ref={moonOrbit}>
                        <mesh ref={(el) => { moonMesh.current = el; if (targetsRef) targetsRef.current.moon = el; }} position={[1.5, 0, 0]} onClick={(e) => { e.stopPropagation(); onFocus?.('MOON'); }}>
                            <sphereGeometry args={[0.35, 32, 32]} />
                            <meshStandardMaterial
                                map={moonMap}
                                color={ui.eclipse?.type === 'LUNAR' ? "#ef4444" : "#ffffff"}
                                roughness={0.9}
                                metalness={0.1}
                                emissive={ui.eclipse?.type === 'LUNAR' ? "#991b1b" : "#000000"}
                                emissiveIntensity={ui.eclipse?.type === 'LUNAR' ? 0.5 : 0}
                            />
                            <Html position={[0, 0.7, 0]} center distanceFactor={45}>
                                <div onClick={() => onFocus?.('MOON')} className={`text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap backdrop-blur-sm border tracking-widest uppercase font-mono font-bold cursor-pointer transition-all ${focusTarget === 'MOON'
                                    ? 'text-white bg-white/30 border-white/60 shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                                    : ui.eclipse?.type === 'LUNAR'
                                        ? 'text-red-100 bg-red-900/60 border-red-500/50 shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                                        : 'text-white bg-black/50 border-white/20 hover:bg-white/20'
                                    }`}>{ui.moon}</div>
                            </Html>
                        </mesh>
                    </group>

                    {/* Moon Orbit Trajectory (Relative to Earth) */}
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[1.45, 1.55, 64]} />
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive="#ffffff"
                            emissiveIntensity={0.5}
                            opacity={0.5}
                            transparent
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                </group>
            </group>

            {/* Eclipse Indicator */}
            {ui.eclipse && (
                <Html position={[0, 5, 0]} center zIndexRange={[1000, 0]}>
                    <div className="flex flex-col items-center" style={{ animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }}>
                        <div className={`font-bold text-lg tracking-[0.2em] uppercase ${ui.eclipse.type === 'SOLAR' ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}>
                            {ui.eclipse.type === 'SOLAR' ? '🌑' : '🌕'} {ui.eclipse.name}
                        </div>
                        <div className={`text-xs font-mono uppercase tracking-widest mt-1 ${ui.eclipse.type === 'SOLAR' ? 'text-amber-300/80' : 'text-red-400/80'}`}>
                            {ui.eclipse.classification} • {ui.eclipse.eclipseActive || 'Active'}
                        </div>
                        {ui.eclipse.magnitude > 0 && (
                            <div className="text-[10px] font-mono text-white/60 mt-0.5 tracking-wider">
                                MAG {ui.eclipse.magnitude.toFixed(4)}
                            </div>
                        )}
                    </div>
                </Html>
            )}

            {/* Earth Orbit Trajectory (Avg radius) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[auToVisual(1.0) - 0.15, auToVisual(1.0) + 0.15, 128]} />
                <meshStandardMaterial
                    color="#60a5fa"
                    emissive="#60a5fa"
                    emissiveIntensity={0.6}
                    opacity={0.45}
                    transparent
                    side={THREE.DoubleSide}
                />
            </mesh>

            <ambientLight intensity={0.25} />

            {/* Master Celestial Sky (Uniform Stars) */}
            {/* 1. Nakshatra Layer (High Res) */}
            {NAKSHATRAS_EN.map((key, i) => {
                const angleStep = (Math.PI * 2) / 27;
                const angle = (i + 0.5) * angleStep;
                const isSelected = i === activeNak;
                const data = NAKSHATRA_CONSTELLATIONS[key];
                const points = data?.points || [[0.5, 0.5]];
                const yogataras = data?.yogataras || [];

                return (
                    <group key={`sky-nak-${i}`} rotation={[0, angle, 0]}>
                        <group position={[R_VIS_CONSTELLATION, 0, 0]}>
                            <Constellation
                                points={points}
                                color="#94a3b8" // Neutral Silver
                                active={isSelected}
                                scale={22}
                                yogataras={yogataras}
                            />
                        </group>
                    </group>
                );
            })}
        </group>
    );
}

// --- NAVAGRAHA COMPONENTS ---

// Master visualization scale — changing this single value rescales the entire solar system
const AU_SCALE = 30;
const auToVisual = (au) => AU_SCALE * Math.sqrt(au);

// Derived layout constants (all relative to Saturn's orbit)
const R_SATURN_ORBIT = auToVisual(9.537);   // ~92.6 units
const R_VIS_NAK = R_SATURN_ORBIT * 1.4;     // Nakshatra wheel — ~130 units
const R_VIS_RASI = R_SATURN_ORBIT * 1.5;    // Rasi wheel — ~139 units
const R_VIS_CONSTELLATION = R_SATURN_ORBIT * 1.62; // Beams & Constellations — ~150 units

const PLANET_DATA = [
    { id: 2, name: { en: "Mercury", te: "బుధుడు" }, color: "#9ca3af", radius: 1.2, au: 0.387, rotationPeriod: 58.646 },      // 0.387 AU → ~18.7 units
    { id: 3, name: { en: "Venus", te: "శుక్రుడు" }, color: "#fff7ed", radius: 2.0, au: 0.723, rotationPeriod: -243.018 },    // 0.723 AU → ~25.5 units
    { id: 4, name: { en: "Mars", te: "కుజుడు" }, color: "#fb7185", radius: 1.6, au: 1.524, rotationPeriod: 1.0259 },       // 1.524 AU → ~37.0 units
    { id: 5, name: { en: "Jupiter", te: "బృహస్పతి" }, color: "#fbbf24", radius: 8.0, au: 5.203, scale: 0.35, rotationPeriod: 0.4135 }, // 5.203 AU → ~68.4 units
    { id: 6, name: { en: "Saturn", te: "శని" }, color: "#fcd34d", radius: 7.0, au: 9.537, scale: 0.35, rotationPeriod: 0.444, ring: true } // 9.537 AU → ~92.6 units
];

function PlanetOrbit({ data, ephemeris, lang, map, isActive, speed, onFocus, targetsRef, focusTarget }) {
    const meshRef = useRef();
    const { au, color, radius, ring, scale = 1, name, rotationPeriod, id } = data;
    const distance = auToVisual(au);
    const targetKey = `planet_${id}`;

    // Register mesh ref for camera tracking
    useFrame((state, delta) => {
        if (meshRef.current) {
            if (targetsRef?.current) targetsRef.current[targetKey] = meshRef.current;
            if (ephemeris) {
                const angle = THREE.MathUtils.degToRad(ephemeris.long);
                const x = distance * Math.cos(angle);
                const z = -distance * Math.sin(angle);
                meshRef.current.position.set(x, 0, z);

                // Axial rotation (Scientific duration relative to Earth=1.0)
                if (isActive && rotationPeriod) {
                    const rotationIncrement = (delta * speed / rotationPeriod) * (Math.PI * 2);
                    meshRef.current.rotation.y += rotationIncrement;
                }
            }
        }
    });

    const displayRadius = radius * 0.5 * scale;
    const handleClick = (e) => { if (e?.stopPropagation) e.stopPropagation(); onFocus?.(`PLANET_${id}`); };
    const isActive3D = focusTarget === `PLANET_${id}`;

    return (
        <group>
            {/* Orbit Path */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[distance - 0.15, distance + 0.15, 128]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} opacity={0.35} transparent side={THREE.DoubleSide} />
            </mesh>

            {/* Planet Mesh */}
            <mesh ref={meshRef} onClick={handleClick}>
                <sphereGeometry args={[displayRadius, 32, 32]} />
                <meshStandardMaterial
                    map={map}
                    color={map ? "#ffffff" : color}
                    roughness={1.0}
                    metalness={0.0}
                    emissive={color}
                    emissiveIntensity={0.05}
                />

                {ring && (
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[displayRadius * 1.4, displayRadius * 2.2, 64]} />
                        <meshStandardMaterial color={color} opacity={0.6} transparent side={THREE.DoubleSide} />
                    </mesh>
                )}

                <Html position={[0, displayRadius + 0.5, 0]} center distanceFactor={60} zIndexRange={[100, 0]}>
                    <div onClick={handleClick} className={`text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md border tracking-widest uppercase font-mono whitespace-nowrap font-bold cursor-pointer transition-all ${isActive3D ? 'text-white bg-white/25 border-white/60 shadow-[0_0_12px_rgba(255,255,255,0.4)]' : 'text-white/90 bg-black/60 border-white/20 hover:bg-white/20'}`}>{name[lang] || name.en}</div>
                </Html>
            </mesh>
        </group>
    );
}

function LunarNodes({ nodePos, lang, onFocus, focusTarget, targetsRef }) {
    const rahuLabel = lang === 'te' ? "రాహు" : "Rahu";
    const ketuLabel = lang === 'te' ? "కేతు" : "Ketu";

    return (
        <group>
            {/* Rahu */}
            <group rotation={[0, THREE.MathUtils.degToRad(nodePos.rahu), 0]}>
                <group position={[2.0, 0, 0]}>
                    <mesh ref={(el) => { if (targetsRef?.current) targetsRef.current.rahu = el; }} rotation={[Math.PI / 2, 0, 0]} onClick={(e) => { e.stopPropagation(); onFocus?.('RAHU'); }}>
                        <torusGeometry args={[0.15, 0.05, 12, 24]} />
                        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} />
                    </mesh>
                    <Html position={[0, 0.4, 0]} center distanceFactor={45}>
                        <div onClick={() => onFocus?.('RAHU')} className={`text-[9px] font-mono tracking-widest uppercase font-bold px-1 rounded cursor-pointer transition-all ${focusTarget === 'RAHU' ? 'text-emerald-200 bg-emerald-500/30 border border-emerald-400/60 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'text-emerald-400 bg-black/70 hover:bg-emerald-900/40'}`}>{rahuLabel}</div>
                    </Html>
                </group>
            </group>
            {/* Ketu */}
            <group rotation={[0, THREE.MathUtils.degToRad(nodePos.ketu), 0]}>
                <group position={[2.0, 0, 0]}>
                    <mesh ref={(el) => { if (targetsRef?.current) targetsRef.current.ketu = el; }} rotation={[Math.PI / 2, 0, 0]} onClick={(e) => { e.stopPropagation(); onFocus?.('KETU'); }}>
                        <torusGeometry args={[0.15, 0.05, 12, 24]} />
                        <meshStandardMaterial color="#f87171" emissive="#f87171" emissiveIntensity={2} />
                    </mesh>
                    <Html position={[0, 0.4, 0]} center distanceFactor={45}>
                        <div onClick={() => onFocus?.('KETU')} className={`text-[9px] font-mono tracking-widest uppercase font-bold px-1 rounded cursor-pointer transition-all ${focusTarget === 'KETU' ? 'text-rose-200 bg-rose-500/30 border border-rose-400/60 shadow-[0_0_10px_rgba(248,113,113,0.5)]' : 'text-rose-400 bg-black/70 hover:bg-rose-900/40'}`}>{ketuLabel}</div>
                    </Html>
                </group>
            </group>
        </group>
    );
}

const HelpIcon = ({ text }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <button className="inline-flex ml-2 outline-none focus:ring-0 cursor-pointer">
                <svg className="w-5 h-5 text-yellow-500 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="w-64 p-3 bg-neutral-900 border-white/10 text-white/90">
            {text}
        </TooltipContent>
    </Tooltip>
);

const DataBox = ({ label, value, until, color, help, ui }) => (
    <Card className="bg-white/5 border-2 border-white/5 hover:border-white/30 transition-all group/box font-mono overflow-hidden">
        <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1.5">
                {help ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help group/label">
                                <div className="text-lg text-white/60 group-hover/label:text-white transition-colors uppercase tracking-[0.15em] font-bold">{label}</div>
                                <svg className="w-4 h-4 text-yellow-500/50 group-hover/label:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="w-64 p-3 bg-neutral-900 border-white/10 text-white/90 z-50">
                            {help}
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <div className="text-lg text-white/60 uppercase tracking-[0.15em] font-bold">{label}</div>
                )}
            </div>
            <div className={`text-lg tracking-tight leading-none uppercase ${color}`}>{value}</div>
            {until && ui && (
                <div className="text-sm text-white/60 mt-1.5 italic font-medium">
                    {ui.untilPre} {until} {ui.untilPost}
                </div>
            )}
        </CardContent>
    </Card>
);

const MiniStat = ({ label, value, color, help }) => (
    <div className="text-center group/mini font-mono">
        <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-lg text-white/50 uppercase tracking-widest font-bold">{label}</span>
            {help && <HelpIcon text={help} />}
        </div>
        <div className={`text-lg font-mono uppercase ${color}`}>{value}</div>
    </div>
);

export default function Panchaangam() {
    const [data, setData] = useState({
        date: '...',
        maasam: '...',
        tithi: '...',
        paksha: '...',
        nakshatra: '...',
        rasi: '...',
        varam: '...',
        samvathsaram: '...',
        yoga: '...',
        karana: '...',
        sun: 0,
        moon: 0,
        elong: 0,
        ayanamsa: 0,
        lagnamLong: 0,
        nakshatraUntil: '...',
        tithiUntil: '...',
        yogaUntil: '...',
        karanaUntil: '...',
        eclipse: null
    });
    const [paused, setPaused] = useState(false);
    const [speed, setSpeed] = useState(1 / 86400); // Default to Real Time
    const [ready, setReady] = useState(false);
    const [isPanelVisible, setIsPanelVisible] = useState(true);
    // Focus Helpers
    const getTargetFromSlug = (slug) => {
        if (!slug) return 'SUN';
        const s = slug.toLowerCase();
        if (s === 'earth') return 'EARTH';
        if (s === 'moon') return 'MOON';
        if (s === 'sun') return 'SUN';
        if (s === 'rahu') return 'RAHU';
        if (s === 'ketu') return 'KETU';

        // Planet mapping
        const pMap = {
            'mercury': 'PLANET_2',
            'venus': 'PLANET_3',
            'mars': 'PLANET_4',
            'jupiter': 'PLANET_5',
            'saturn': 'PLANET_6'
        };
        return pMap[s] || 'SUN';
    };

    const getSlugFromTarget = (target) => {
        if (!target || target === 'SUN') return '';
        if (target === 'EARTH') return 'earth';
        if (target === 'MOON') return 'moon';
        if (target === 'RAHU') return 'rahu';
        if (target === 'KETU') return 'ketu';

        if (target.startsWith('PLANET_')) {
            const id = parseInt(target.split('_')[1]);
            const p = PLANET_DATA.find(p => p.id === id);
            return p ? p.name.en.toLowerCase() : '';
        }
        return '';
    };

    // Initialize from URL
    const getInitialFocus = () => {
        try {
            const hash = window.location.hash;
            const qIdx = hash.indexOf('?');
            if (qIdx !== -1) {
                const params = new URLSearchParams(hash.slice(qIdx));
                return getTargetFromSlug(params.get('focus'));
            }
        } catch (_) { }
        return 'SUN';
    };

    const [cameraTarget, setCameraTarget] = useState(getInitialFocus);

    // 1. Sync state to URL (UI -> URL)
    useEffect(() => {
        const hash = window.location.hash;
        const qIdx = hash.indexOf('?');
        const basePath = qIdx !== -1 ? hash.slice(0, qIdx) : hash;
        const slug = getSlugFromTarget(cameraTarget);
        const newParam = slug ? `?focus=${slug}` : '';

        // Only replace if currently different to avoid loops
        const currentParams = new URLSearchParams(qIdx !== -1 ? hash.slice(qIdx) : '');
        if (currentParams.get('focus') !== slug) {
            window.history.replaceState(null, '', basePath + newParam);
        }
    }, [cameraTarget]);

    // 2. Listen for URL changes (URL -> UI)
    useEffect(() => {
        const handleHashChange = () => {
            const newTarget = getInitialFocus();
            setCameraTarget(newTarget);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    const [location, setLocation] = useState({
        name: 'Hyderabad, Telangana, India',
        lat: 17.3850,
        lon: 78.4867,
        alt: 0,
        timezone: 'Asia/Kolkata'
    });
    const [cityQuery, setCityQuery] = useState('');
    const [cityResults, setCityResults] = useState([]);
    const [isLocating, setIsLocating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const celestialRefs = useRef({ earth: null, moon: null });
    const searchInputRef = useRef(null);
    const [speedInput, setSpeedInput] = useState('1');
    const [speedUnit, setSpeedUnit] = useState('sec');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const nowJD = toJD(Date.now());
    const [anchorJD, setAnchorJD] = useState(nowJD);
    const anchorDateStr = fromJD(anchorJD).toISOString().slice(0, 10);

    // Speed Constraints (Days per Second)
    const MIN_SPEED = 1 / 86400; // Real Time (1 sec = 1 sec)
    const MAX_SPEED = 365;       // 1 Year per second

    // Helper to map slider value (0-100) to speed (Logarithmic)
    const sliderToSpeed = (val) => {
        if (val <= 0) return MIN_SPEED;
        if (val >= 100) return MAX_SPEED;
        const minLog = Math.log(MIN_SPEED);
        const maxLog = Math.log(MAX_SPEED);
        const scale = (maxLog - minLog) / 100;
        return Math.exp(minLog + scale * val);
    };

    // Helper to map speed to slider value (0-100)
    const speedToSlider = (s) => {
        if (s <= MIN_SPEED) return 0;
        if (s >= MAX_SPEED) return 100;
        const minLog = Math.log(MIN_SPEED);
        const maxLog = Math.log(MAX_SPEED);
        return ((Math.log(s) - minLog) / (maxLog - minLog)) * 100;
    };

    const formatSpeed = (s) => {
        if (s <= MIN_SPEED * 1.1) return UI_STRINGS[lang].realTime;


        const units = [
            { val: 365, label: UI_STRINGS[lang].year, mult: 1 / 365 },
            { val: 30, label: UI_STRINGS[lang].month, mult: 1 / 30 },
            { val: 1, label: UI_STRINGS[lang].day },
            { val: 1 / 24, label: UI_STRINGS[lang].hour, mult: 24 },
            { val: 1 / 1440, label: UI_STRINGS[lang].min, mult: 1440 },
            { val: 1 / 86400, label: UI_STRINGS[lang].sec, mult: 86400 }
        ];

        for (let unit of units) {
            if (s >= unit.val) {
                const val = s * (unit.mult || 1);
                return `${val.toFixed(1).replace(/\.0$/, '')} ${unit.label} / ${UI_STRINGS[lang].sec}`;
            }
        }
        return `${s.toFixed(3)} ${UI_STRINGS[lang].day} / ${UI_STRINGS[lang].sec}`; // Fallback
    };

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            try {
                await swe.initSwissEph();
                swe.set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
                if (isMounted) setReady(true);
            } catch (e) {
                console.error("Failed to initialize Swiss Ephemeris:", e);
            }
        };
        init();
        return () => { isMounted = false; };
    }, []);

    // Sync input components when speed changes (via slider or external)
    useEffect(() => {
        if (isInputFocused) return;
        const units = [
            { id: 'yr', val: 365 },
            { id: 'mo', val: 30 },
            { id: 'day', val: 1 },
            { id: 'hr', val: 1 / 24 },
            { id: 'min', val: 1 / 1440 },
            { id: 'sec', val: 1 / 86400 }
        ];
        for (let u of units) {
            if (speed >= u.val * 0.99) {
                const val = (speed / u.val).toFixed(2).replace(/\.?0+$/, '');
                setSpeedInput(val);
                setSpeedUnit(u.id);
                break;
            }
        }
    }, [speed, isInputFocused]);

    // Ref to cache the lazy-loaded country-state-city module
    const geoModuleRef = useRef(null);
    const [geoLoading, setGeoLoading] = useState(false);

    useEffect(() => {
        if (cityQuery.length <= 2) {
            setCityResults([]);
            return;
        }

        let cancelled = false;

        const doSearch = async () => {
            try {
                // Lazy-load country-state-city on first search
                if (!geoModuleRef.current) {
                    setGeoLoading(true);
                    const mod = await import('country-state-city');
                    geoModuleRef.current = {
                        City: mod.City,
                        State: mod.State,
                        Country: mod.Country,
                    };
                    setGeoLoading(false);
                }

                if (cancelled) return;

                const { City, State, Country } = geoModuleRef.current;
                const query = cityQuery.toLowerCase();
                const allCities = City.getAllCities();
                const matches = [];

                for (let i = 0; i < allCities.length && matches.length < 10; i++) {
                    const city = allCities[i];
                    if (city.name.toLowerCase().includes(query)) {
                        const stateObj = State.getStateByCodeAndCountry(city.stateCode, city.countryCode);
                        const countryObj = Country.getCountryByCode(city.countryCode);
                        matches.push({
                            ...city,
                            stateName: stateObj?.name || city.stateCode,
                            countryName: countryObj?.name || city.countryCode,
                            timezone: tzlookup(parseFloat(city.latitude), parseFloat(city.longitude))
                        });
                    }
                }
                if (!cancelled) setCityResults(matches);
            } catch (e) {
                console.error("City search error:", e);
                if (!cancelled) {
                    setCityResults([]);
                    setGeoLoading(false);
                }
            }
        };

        doSearch();
        return () => { cancelled = true; };
    }, [cityQuery]);

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const tz = tzlookup(latitude, longitude);

                setLocation({
                    name: "Current Location",
                    lat: latitude,
                    lon: longitude,
                    alt: position.coords.altitude || 0,
                    timezone: tz
                });
                setIsLocating(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setIsLocating(false);
                alert("Could not fetch location. Please enter manually.");
            }
        );
    };

    const [lang, setLang] = useState('en');

    // Update location with language so SolarSystem can access it
    useEffect(() => {
        setLocation(prev => ({ ...prev, lang }));
    }, [lang]);

    if (!ready) {
        return (
            <div className="h-screen bg-[#050510] flex items-center justify-center text-white font-sans">
                <div className="text-center space-y-8">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-4 border-yellow-500/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-yellow-500 rounded-full animate-spin shadow-[0_0_20px_rgba(234,179,8,0.3)]"></div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-4xl font-black tracking-tighter text-rustic-cream uppercase animate-pulse leading-none font-mono">{UI_STRINGS[lang].title}</p>
                        <p className="text-[10px] text-yellow-500/50 uppercase tracking-[0.4em] font-bold font-mono">Initializing Cosmic Data</p>
                    </div>
                </div>
            </div>
        );
    }

    const ui = UI_STRINGS[lang];

    return (
        <TooltipProvider delayDuration={0}>
            <div className="h-screen w-full bg-black text-white selection:bg-yellow-500/30 overflow-hidden flex font-serif">
                {/* Global Style overrides for native components */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(72%) sepia(85%) saturate(543%) hue-rotate(3deg) brightness(101%) contrast(89%);
                    cursor: pointer;
                }
            `}} />
                {/* Side Control Panel (Integrated Glass Sidebar) */}
                <aside
                    className={`h-screen border-r border-white/5 bg-black/90 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex-none z-40 ${isPanelVisible ? 'w-[680px] opacity-100' : 'w-0 opacity-0 pointer-events-none overflow-hidden'}`}
                >
                    <div className="h-full overflow-y-auto no-scrollbar scroll-smooth p-6 space-y-12 min-w-[680px] font-mono">
                        <div className="space-y-4 pb-10">
                            <div className="flex justify-between items-start">

                                {/* Language Toggle */}
                                <div className="flex bg-white/5 rounded-xl p-1.5 border border-white/10 shrink-0 font-mono">
                                    <button
                                        onClick={() => setLang('en')}
                                        className={`px-5 py-2 text-sm font-black rounded-lg transition-all ${lang === 'en' ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'text-white/40 hover:text-white'}`}
                                    >
                                        EN
                                    </button>
                                    <button
                                        onClick={() => setLang('te')}
                                        className={`px-5 py-2 text-sm font-black rounded-lg transition-all ${lang === 'te' ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'text-white/40 hover:text-white'}`}
                                    >
                                        తె
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div>
                                    {/* Navbar Title and Subtitle removed for readability */}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {/* Temporal Anchor & Simulation Speed */}
                            <div className="space-y-8">
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                                        <div className="flex-1 flex flex-col gap-2 px-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">{ui.speed}</label>
                                                <div className="flex items-center gap-1.5">
                                                    <Input
                                                        type="text"
                                                        value={isInputFocused ? speedInput : (parseFloat(speedInput) || 0)}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setSpeedInput(val);
                                                            const num = parseFloat(val);
                                                            if (!isNaN(num)) setSpeed(num * SPEED_UNIT_VALUES[speedUnit]);
                                                        }}
                                                        onFocus={() => setIsInputFocused(true)}
                                                        onBlur={() => setIsInputFocused(false)}
                                                        className="w-16 h-7 bg-white/5 border-white/5 text-[11px] font-mono text-yellow-500 font-bold text-center p-0 focus:border-yellow-500/50 rounded-lg"
                                                    />
                                                    <select
                                                        value={speedUnit}
                                                        onChange={(e) => {
                                                            const unit = e.target.value;
                                                            setSpeedUnit(unit);
                                                            const num = parseFloat(speedInput);
                                                            if (!isNaN(num)) setSpeed(num * SPEED_UNIT_VALUES[unit]);
                                                        }}
                                                        className="h-7 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest px-2 outline-none focus:border-yellow-500/50 text-yellow-500 cursor-pointer hover:bg-white/10 transition-colors"
                                                    >
                                                        <option value="sec" className="bg-neutral-900 text-yellow-500">{ui.sec}</option>
                                                        <option value="min" className="bg-neutral-900 text-yellow-500">{ui.min}</option>
                                                        <option value="hr" className="bg-neutral-900 text-yellow-500">{ui.hour}</option>
                                                        <option value="day" className="bg-neutral-900 text-yellow-500">{ui.day}</option>
                                                        <option value="mo" className="bg-neutral-900 text-yellow-500">{ui.month}</option>
                                                        <option value="yr" className="bg-neutral-900 text-yellow-500">{ui.year}</option>
                                                    </select>
                                                    <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">/ {ui.sec}</span>
                                                </div>
                                            </div>
                                            <Slider
                                                value={[speedToSlider(speed)]}
                                                onValueChange={vals => setSpeed(sliderToSpeed(vals[0]))}
                                                max={100}
                                                step={0.1}
                                                className="py-1"
                                            />
                                        </div>

                                        <div className="flex gap-1.5 shrink-0">
                                            <button
                                                onClick={() => setPaused(!paused)}
                                                className={`p-2.5 rounded-xl border border-white/5 transition-all ${paused ? 'bg-yellow-500 text-black' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                                                title={paused ? "Play" : "Pause"}
                                            >
                                                {paused ? (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                                                )}
                                            </button>

                                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                                        title="Pick Date"
                                                    >
                                                        <CalendarIcon className="h-4 w-4" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0 bg-neutral-900 border-white/10 shadow-2xl"
                                                    align="center"
                                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                                    onInteractOutside={(e) => {
                                                        // Prevent all closures when interacting with dropdowns
                                                        const target = e.target;
                                                        if (
                                                            target.tagName === 'SELECT' ||
                                                            target.closest('select') ||
                                                            target.closest('.rdp-dropdown') ||
                                                            target.tagName === 'OPTION'
                                                        ) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        fromYear={1900}
                                                        toYear={2100}
                                                        selected={anchorJD ? new Date(fromJD(anchorJD)) : undefined}
                                                        onSelect={(date) => {
                                                            if (date) {
                                                                // Robust local midnight calculation for target timezone
                                                                const year = date.getFullYear();
                                                                const month = date.getMonth();
                                                                const day = date.getDate();

                                                                // 1. Create a UTC date at the same "wall time"
                                                                const wallUtc = new Date(Date.UTC(year, month, day));

                                                                // 2. Format it in the target timezone to find the current offset
                                                                const formatter = new Intl.DateTimeFormat('en-US', {
                                                                    timeZone: location.timezone,
                                                                    year: 'numeric', month: 'numeric', day: 'numeric',
                                                                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                                                                    hour12: false
                                                                });

                                                                const parts = formatter.formatToParts(wallUtc);
                                                                const getVal = (type) => parseInt(parts.find(p => p.type === type).value);

                                                                // 3. Construct a date object representing how that UTC midnight looks in local time
                                                                const apparentLocal = new Date(Date.UTC(
                                                                    getVal('year'),
                                                                    getVal('month') - 1,
                                                                    getVal('day'),
                                                                    getVal('hour'),
                                                                    getVal('minute'),
                                                                    getVal('second')
                                                                ));

                                                                // 4. The difference tells us the offset to subtract from UTC to get local midnight
                                                                const offsetMs = apparentLocal.getTime() - wallUtc.getTime();
                                                                const targetUtcMs = wallUtc.getTime() - offsetMs;

                                                                setAnchorJD(toJD(targetUtcMs));
                                                                setIsCalendarOpen(false); // Close popover
                                                            }
                                                        }}
                                                        className="bg-neutral-900 text-white border border-white/5 shadow-2xl rounded-2xl"
                                                        onMonthChange={(date) => {
                                                            const newJD = toJD(date.getTime());
                                                            setAnchorJD(newJD);
                                                        }}
                                                        onYearChange={(date) => {
                                                            const newJD = toJD(date.getTime());
                                                            setAnchorJD(newJD);
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>

                                            <button
                                                onClick={() => setIsSearching(!isSearching)}
                                                className={`p-2.5 rounded-xl border border-white/5 transition-all ${isSearching ? 'bg-yellow-500 text-black' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                                                title="Search Location"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    const now = new Date();
                                                    setAnchorJD(toJD(now.getTime()));
                                                    setSpeed(MIN_SPEED);
                                                }}
                                                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-white/40 hover:text-white"
                                                title="Reset to Real Time"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Location Search Overlay */}
                                    {isSearching && (
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="relative">
                                                <input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    value={cityQuery}
                                                    onChange={(e) => setCityQuery(e.target.value)}
                                                    placeholder={ui.searchCity + "..."}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50 transition-all font-mono"
                                                    autoFocus
                                                />
                                                {cityQuery && (
                                                    <button
                                                        onClick={() => setCityQuery('')}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleUseMyLocation}
                                                    disabled={isLocating}
                                                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all flex items-center justify-center gap-2"
                                                >
                                                    <svg className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {isLocating ? ui.locating : ui.useLocation}
                                                </button>
                                            </div>

                                            {geoLoading && (
                                                <div className="flex items-center gap-2 p-3 text-white/50 text-sm">
                                                    <div className="w-4 h-4 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
                                                    Loading city database…
                                                </div>
                                            )}

                                            {cityResults.length > 0 && (
                                                <div className="space-y-1 max-h-60 overflow-y-auto no-scrollbar pr-1">
                                                    {cityResults.map((city, idx) => (
                                                        <button
                                                            key={`${city.name}-${city.countryCode}-${idx}`}
                                                            onClick={() => {
                                                                setLocation({
                                                                    name: `${city.name}, ${city.stateName}, ${city.countryName}`,
                                                                    lat: parseFloat(city.latitude),
                                                                    lon: parseFloat(city.longitude),
                                                                    alt: 0,
                                                                    timezone: city.timezone
                                                                });
                                                                setCityQuery('');
                                                                setIsSearching(false);
                                                            }}
                                                            className="w-full text-left p-3 rounded-xl hover:bg-yellow-500 hover:text-black transition-all group border border-transparent hover:border-black/10"
                                                        >
                                                            <div className="text-sm font-bold truncate leading-tight">{city.name}</div>
                                                            <div className="text-[10px] opacity-60 group-hover:opacity-100 font-mono tracking-tighter truncate">{city.stateName}, {city.countryName}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Data Visualization */}
                            <div className="space-y-6">
                                <div className="flex flex-col gap-1 px-1">
                                    <div className="text-sm text-white/60 uppercase tracking-[0.15em] font-bold mt-1">{data.date}</div>
                                    <div className="text-sm text-yellow-500 font-mono uppercase tracking-widest font-black">{location.name}</div>
                                </div>

                                {/* ── Eclipse Alert Card (NASA/ISRO Grade) ── */}
                                {data.eclipse && (() => {
                                    const ecl = data.eclipse;
                                    const isSolar = ecl.type === 'SOLAR';
                                    const gradientFrom = isSolar ? 'from-amber-900/30' : 'from-red-900/30';
                                    const gradientTo = isSolar ? 'to-amber-950/10' : 'to-red-950/10';
                                    const borderColor = isSolar ? 'border-amber-500/40' : 'border-red-500/40';
                                    const accentText = isSolar ? 'text-amber-400' : 'text-red-400';
                                    const badgeBg = isSolar
                                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                                        : 'bg-red-500/20 border-red-500/50 text-red-200';
                                    const icon = isSolar ? '🌑' : '🌕';

                                    const formatDur = (sec) => {
                                        if (!sec || sec <= 0) return null;
                                        const m = Math.floor(sec / 60);
                                        const s = Math.round(sec % 60);
                                        if (m > 0) return `${m}m ${s}s`;
                                        return `${s}s`;
                                    };

                                    // Build contact timeline entries
                                    const timeline = [];
                                    if (ecl.contacts) {
                                        const c = ecl.contacts;
                                        if (isSolar) {
                                            if (c.firstContact) timeline.push({ label: 'C1 · ' + (ui.eclipseBegin || 'Begin'), time: c.firstContact });
                                            if (c.secondContact) timeline.push({ label: 'C2 · ' + (ui.eclipseTotality || 'Totality') + ' ▸', time: c.secondContact });
                                            if (c.maximum) timeline.push({ label: '● ' + (ui.eclipseMaximum || 'Maximum'), time: c.maximum, highlight: true });
                                            if (c.thirdContact) timeline.push({ label: 'C3 · ' + (ui.eclipseTotality || 'Totality') + ' ◂', time: c.thirdContact });
                                            if (c.fourthContact) timeline.push({ label: 'C4 · ' + (ui.eclipseEnd || 'End'), time: c.fourthContact });
                                        } else {
                                            if (c.penumbralBegin) timeline.push({ label: 'P1 · Penumbral ▸', time: c.penumbralBegin });
                                            if (c.partialBegin) timeline.push({ label: 'U1 · Partial ▸', time: c.partialBegin });
                                            if (c.totalityBegin) timeline.push({ label: 'U2 · ' + (ui.eclipseTotality || 'Totality') + ' ▸', time: c.totalityBegin });
                                            if (c.maximum) timeline.push({ label: '● ' + (ui.eclipseMaximum || 'Maximum'), time: c.maximum, highlight: true });
                                            if (c.totalityEnd) timeline.push({ label: 'U3 · ' + (ui.eclipseTotality || 'Totality') + ' ◂', time: c.totalityEnd });
                                            if (c.partialEnd) timeline.push({ label: 'U4 · Partial ◂', time: c.partialEnd });
                                            if (c.penumbralEnd) timeline.push({ label: 'P4 · Penumbral ◂', time: c.penumbralEnd });
                                        }
                                    }

                                    return (
                                        <div className={`col-span-2 rounded-2xl border ${borderColor} bg-gradient-to-br ${gradientFrom} ${gradientTo} backdrop-blur-xl p-4 font-mono overflow-hidden relative`}>
                                            {/* Animated glow border effect */}
                                            <div className={`absolute inset-0 rounded-2xl opacity-20 pointer-events-none`} style={{
                                                boxShadow: isSolar
                                                    ? '0 0 30px rgba(245,158,11,0.3), inset 0 0 30px rgba(245,158,11,0.1)'
                                                    : '0 0 30px rgba(239,68,68,0.3), inset 0 0 30px rgba(239,68,68,0.1)',
                                                animation: 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite'
                                            }} />

                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-3 relative">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{icon}</span>
                                                    <div>
                                                        <div className={`text-sm font-black uppercase tracking-[0.15em] ${accentText}`}>{ecl.name}</div>
                                                        <div className="text-[10px] text-white/40 uppercase tracking-widest">{ui.eclipseGrahana || 'Grahana'}</div>
                                                    </div>
                                                </div>
                                                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${badgeBg}`}>
                                                    {ecl.classification || 'Unknown'}
                                                </span>
                                            </div>

                                            {/* Stats Row */}
                                            <div className="grid grid-cols-3 gap-2 mb-3">
                                                {ecl.magnitude > 0 && (
                                                    <div className="bg-white/5 rounded-lg p-2 text-center">
                                                        <div className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">{ui.eclipseMagnitude || 'Magnitude'}</div>
                                                        <div className="text-sm text-white font-bold">{ecl.magnitude.toFixed(4)}</div>
                                                    </div>
                                                )}
                                                {ecl.obscuration > 0 && (
                                                    <div className="bg-white/5 rounded-lg p-2 text-center">
                                                        <div className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">{ui.eclipseObscuration || 'Obscuration'}</div>
                                                        <div className="text-sm text-white font-bold">{ecl.obscuration.toFixed(1)}%</div>
                                                    </div>
                                                )}
                                                {(ecl.totalityDuration || ecl.overallDuration) && (
                                                    <div className="bg-white/5 rounded-lg p-2 text-center">
                                                        <div className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">{ui.eclipseDuration || 'Duration'}</div>
                                                        <div className="text-sm text-white font-bold">
                                                            {ecl.totalityDuration ? formatDur(ecl.totalityDuration) : (ecl.overallDuration ? `${Math.round(ecl.overallDuration)}m` : '—')}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Contact Timeline */}
                                            {timeline.length > 0 && (
                                                <div className="border-t border-white/5 pt-2.5 space-y-1">
                                                    {timeline.map((entry, i) => (
                                                        <div key={i} className={`flex justify-between text-[11px] ${entry.highlight ? 'text-white font-bold' : 'text-white/50'}`}>
                                                            <span className={entry.highlight ? accentText : ''}>{entry.label}</span>
                                                            <span className="font-mono text-white/80">{entry.time}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                <div className="grid grid-cols-2 gap-2">
                                    <DataBox label={ui.samvathsaram} value={data.samvathsaram} ui={ui} color="text-yellow-500" help={ui.samvathsaramDesc} />
                                    <DataBox label={ui.amanthaMasam} value={data.amantha} ui={ui} color="text-yellow-500" help={ui.amanthaMasamDesc} />
                                    <DataBox label={ui.tithi} value={data.tithi} until={data.tithiUntil} ui={ui} color="text-yellow-500" help={ui.tithiDesc} />
                                    <DataBox label={ui.nakshatra} value={data.nakshatra} until={data.nakshatraUntil} ui={ui} color="text-yellow-500" help={ui.nakshatraDesc} />
                                    <DataBox label={ui.varam} value={data.varam} ui={ui} color="text-yellow-500" help={ui.varamDesc} />
                                    <DataBox label={ui.souramanaMasam} value={data.soura} ui={ui} color="text-yellow-500" help={ui.rasiDesc} />
                                    <DataBox label={ui.yoga} value={data.yoga} until={data.yogaUntil} ui={ui} color="text-yellow-500" help={ui.yogaDesc} />
                                    <DataBox label={ui.karana} value={data.karana} until={data.karanaUntil} ui={ui} color="text-yellow-500" help={ui.karanaDesc} />
                                </div>

                                {/* Sunrise / Sunset Row */}
                                <div className="grid grid-cols-2 gap-2">
                                    <Card className="bg-white/5 border-2 border-white/5 hover:border-white/30 transition-all font-mono overflow-hidden">
                                        <CardContent className="p-3">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-base">🌅</span>
                                                <div className="text-lg text-white/60 uppercase tracking-[0.15em] font-bold">{ui.sunrise}</div>
                                            </div>
                                            <div className="text-lg tracking-tight leading-none text-amber-400 font-mono">{data.sunrise || '---'}</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-white/5 border-2 border-white/5 hover:border-white/30 transition-all font-mono overflow-hidden">
                                        <CardContent className="p-3">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-base">🌇</span>
                                                <div className="text-lg text-white/60 uppercase tracking-[0.15em] font-bold">{ui.sunset}</div>
                                            </div>
                                            <div className="text-lg tracking-tight leading-none text-orange-400 font-mono">{data.sunset || '---'}</div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                        </div>

                        {/* Engine Stats (Collapsed View) */}
                        <div className="pt-6 opacity-20 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-center mb-4 font-mono">
                                <span className="text-base font-black uppercase tracking-[0.2em] text-yellow-500">{ui.engineStats}</span>
                                <span className="text-emerald-500 font-mono italic text-xs uppercase font-bold">{ui.precision}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[11px] text-white/40">
                                <div className="flex justify-between"><span>SUN</span><span>{data.sun?.toFixed(4)}°</span></div>
                                <div className="flex justify-between"><span>MOON</span><span>{data.moon?.toFixed(4)}°</span></div>
                                <div className="flex justify-between"><span>ELONG</span><span>{data.elong?.toFixed(4)}°</span></div>
                                <div className="flex justify-between"><span>AYAN</span><span>{data.ayanamsa?.toFixed(4)}°</span></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Area (Canvas & Global Overlays) */}
                <main className="flex-1 relative flex flex-col bg-black">

                    <div className="flex-1">
                        <Canvas camera={{ position: [0, 30, 45], fov: 45, far: 10000 }} dpr={[1, 2]}>
                            <Stars radius={200} depth={60} count={10000} factor={6} saturation={0} fade speed={0.2} />
                            <SolarSystem speed={speed} paused={paused} anchorJD={anchorJD} location={{ ...location, lang }} onUpdate={setData} sweReady={ready} targetsRef={celestialRefs} onFocus={setCameraTarget} focusTarget={cameraTarget} />
                            <CameraFollower target={cameraTarget} targetsRef={celestialRefs} />
                            <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
                        </Canvas>
                    </div>

                    {/* Control Trigger (Floating) */}
                    <button
                        onClick={() => setIsPanelVisible(!isPanelVisible)}
                        className="absolute bottom-10 left-10 z-50 w-14 h-14 rounded-full bg-black/40 backdrop-blur-3xl border border-white/10 text-white shadow-2xl transition-all hover:bg-yellow-500/20 hover:border-yellow-500/40 flex items-center justify-center group"
                    >
                        <svg
                            className={`w-6 h-6 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isPanelVisible ? 'rotate-0' : 'rotate-180'}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </main>
            </div>
        </TooltipProvider>
    );
}