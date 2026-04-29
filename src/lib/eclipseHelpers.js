/**
 * Eclipse Helper Module for Panchaangam
 * 
 * Provides correct WASM-level wrappers for Swiss Ephemeris eclipse functions.
 * The swisseph-wasm npm wrapper has incorrect parameter signatures for eclipse
 * and rise_trans functions — it passes individual numbers where the underlying
 * C API expects heap-allocated pointers to arrays.
 * 
 * This module bypasses the broken wrappers by directly calling the C functions
 * via Emscripten's ccall with correct pointer-based signatures.
 * 
 * Prepared for NASA–ISRO Joint Collaboration: Panchaangam Astronomical Sandbox
 * 
 * Eclipse type bitflags (from Swiss Ephemeris):
 *   SE_ECL_CENTRAL        = 1
 *   SE_ECL_NONCENTRAL     = 2
 *   SE_ECL_TOTAL           = 4
 *   SE_ECL_ANNULAR         = 8
 *   SE_ECL_PARTIAL         = 16
 *   SE_ECL_ANNULAR_TOTAL   = 32
 *   SE_ECL_PENUMBRAL       = 64
 * 
 * Solar eclipse tret indices (swe_sol_eclipse_when_loc):
 *   [0] = maximum eclipse      [1] = first contact (partial begin)
 *   [2] = second contact       [3] = third contact
 *   [4] = fourth contact       [5] = sunrise if eclipse at sunrise
 *   [6] = sunset if eclipse at sunset
 * 
 * Lunar eclipse tret indices (swe_lun_eclipse_when_loc):
 *   [0] = maximum eclipse      [1] = (reserved)
 *   [2] = partial phase begin  [3] = partial phase end
 *   [4] = totality begin       [5] = totality end
 *   [6] = penumbral begin      [7] = penumbral end
 * 
 * Solar eclipse attr indices (swe_sol_eclipse_how):
 *   [0] = magnitude (fraction of solar diameter covered)
 *   [1] = ratio of lunar to solar diameter
 *   [2] = obscuration (fraction of solar disc area covered)
 *   [3] = diameter of core shadow (km)
 *   [4] = azimuth of sun at tjd
 *   [5] = true altitude of sun above horizon at tjd
 *   [6] = apparent altitude of sun above horizon at tjd
 *   [7] = elongation of moon in degrees
 * 
 * Lunar eclipse attr indices (swe_lun_eclipse_how):
 *   [0] = umbral magnitude
 *   [1] = penumbral magnitude
 *   [4] = azimuth of moon at tjd
 *   [5] = true altitude of moon
 *   [6] = apparent altitude of moon
 *   [7] = distance of moon from opposition in degrees
 */

// Eclipse type bitflag constants
const SE_ECL_CENTRAL = 1;
const SE_ECL_NONCENTRAL = 2;
const SE_ECL_TOTAL = 4;
const SE_ECL_ANNULAR = 8;
const SE_ECL_PARTIAL = 16;
const SE_ECL_ANNULAR_TOTAL = 32;
const SE_ECL_PENUMBRAL = 64;

/**
 * Allocate a double array on the Emscripten heap and optionally fill it.
 * @returns {{ ptr: number, read: () => number[], free: () => void }}
 */
function heapDoubles(module, count, fillValues) {
    const ptr = module._malloc(count * Float64Array.BYTES_PER_ELEMENT);
    if (fillValues) {
        for (let i = 0; i < fillValues.length; i++) {
            module.HEAPF64[ptr / 8 + i] = fillValues[i];
        }
    }
    return {
        ptr,
        read: () => {
            const arr = [];
            for (let i = 0; i < count; i++) {
                arr.push(module.HEAPF64[ptr / 8 + i]);
            }
            return arr;
        },
        free: () => module._free(ptr),
    };
}

/**
 * Find next solar eclipse visible at a given location.
 * @param {object} swe - SwissEph instance (must have SweModule initialized)
 * @param {number} jdStart - Julian Day to start searching from
 * @param {number} flags - Ephemeris flags (e.g. SEFLG_SWIEPH)
 * @param {number[]} geopos - [longitude, latitude, altitude]
 * @param {number} backward - 0 = forward search, 1 = backward
 * @returns {{ retFlag: number, tret: number[], attr: number[] } | null}
 */
export function solarEclipseWhenLoc(swe, jdStart, flags, geopos, backward = 0) {
    const M = swe.SweModule;
    const geo = heapDoubles(M, 3, geopos);
    const tret = heapDoubles(M, 10);
    const attr = heapDoubles(M, 20);
    const serr = M._malloc(256);

    try {
        const retFlag = M.ccall(
            'swe_sol_eclipse_when_loc',
            'number',
            ['number', 'number', 'pointer', 'pointer', 'pointer', 'number', 'pointer'],
            [jdStart, flags, geo.ptr, tret.ptr, attr.ptr, backward, serr]
        );
        if (retFlag < 0) return null;
        return { retFlag, tret: tret.read(), attr: attr.read() };
    } catch (e) {
        console.error('solarEclipseWhenLoc error:', e);
        return null;
    } finally {
        geo.free();
        tret.free();
        attr.free();
        M._free(serr);
    }
}

/**
 * Compute solar eclipse attributes at a specific time and location.
 * @returns {{ retFlag: number, attr: number[] } | null}
 */
export function solarEclipseHow(swe, jd, flags, geopos) {
    const M = swe.SweModule;
    const geo = heapDoubles(M, 3, geopos);
    const attr = heapDoubles(M, 20);
    const serr = M._malloc(256);

    try {
        const retFlag = M.ccall(
            'swe_sol_eclipse_how',
            'number',
            ['number', 'number', 'pointer', 'pointer', 'pointer'],
            [jd, flags, geo.ptr, attr.ptr, serr]
        );
        if (retFlag < 0) return null;
        return { retFlag, attr: attr.read() };
    } catch (e) {
        console.error('solarEclipseHow error:', e);
        return null;
    } finally {
        geo.free();
        attr.free();
        M._free(serr);
    }
}

/**
 * Find next lunar eclipse visible at a given location.
 * @returns {{ retFlag: number, tret: number[], attr: number[] } | null}
 */
export function lunarEclipseWhenLoc(swe, jdStart, flags, geopos, backward = 0) {
    const M = swe.SweModule;
    const geo = heapDoubles(M, 3, geopos);
    const tret = heapDoubles(M, 10);
    const attr = heapDoubles(M, 20);
    const serr = M._malloc(256);

    try {
        const retFlag = M.ccall(
            'swe_lun_eclipse_when_loc',
            'number',
            ['number', 'number', 'pointer', 'pointer', 'pointer', 'number', 'pointer'],
            [jdStart, flags, geo.ptr, tret.ptr, attr.ptr, backward, serr]
        );
        if (retFlag < 0) return null;
        return { retFlag, tret: tret.read(), attr: attr.read() };
    } catch (e) {
        console.error('lunarEclipseWhenLoc error:', e);
        return null;
    } finally {
        geo.free();
        tret.free();
        attr.free();
        M._free(serr);
    }
}

/**
 * Compute lunar eclipse attributes at a specific time and location.
 * @returns {{ retFlag: number, attr: number[] } | null}
 */
export function lunarEclipseHow(swe, jd, flags, geopos) {
    const M = swe.SweModule;
    const geo = heapDoubles(M, 3, geopos);
    const attr = heapDoubles(M, 20);
    const serr = M._malloc(256);

    try {
        const retFlag = M.ccall(
            'swe_lun_eclipse_how',
            'number',
            ['number', 'number', 'pointer', 'pointer', 'pointer'],
            [jd, flags, geo.ptr, attr.ptr, serr]
        );
        if (retFlag < 0) return null;
        return { retFlag, attr: attr.read() };
    } catch (e) {
        console.error('lunarEclipseHow error:', e);
        return null;
    } finally {
        geo.free();
        attr.free();
        M._free(serr);
    }
}

/**
 * Compute sunrise or sunset for a given location.
 * Properly wraps swe_rise_trans with correct C API signatures.
 * 
 * C signature:
 *   int32 swe_rise_trans(double tjd_ut, int32 ipl, char *starname,
 *                        int32 epheflag, int32 rsmi, double *geopos,
 *                        double atpress, double attemp,
 *                        double *tret, char *serr)
 * 
 * @param {object} swe - SwissEph instance
 * @param {number} jd - Julian Day (UT)
 * @param {number} planet - Planet number (e.g. swe.SE_SUN)
 * @param {number} epheflag - Ephemeris flag
 * @param {number} rsmi - Rise/set flag (SE_CALC_RISE=1, SE_CALC_SET=2)
 * @param {number[]} geopos - [longitude, latitude, altitude]
 * @param {number} [pressure=1013.25] - Atmospheric pressure in mbar
 * @param {number} [temperature=15] - Temperature in °C
 * @returns {number | null} - Julian Day of the event, or null on error
 */
export function riseTransFixed(swe, jd, planet, epheflag, rsmi, geopos, pressure = 1013.25, temperature = 15) {
    const M = swe.SweModule;
    const geo = heapDoubles(M, 3, geopos);
    const tret = heapDoubles(M, 4);
    const serr = M._malloc(256);
    // Empty star name (null pointer works for planets)
    const starPtr = M._malloc(2);
    M.HEAP8[starPtr] = 0; // null-terminated empty string

    try {
        const retFlag = M.ccall(
            'swe_rise_trans',
            'number',
            ['number', 'number', 'pointer', 'number', 'number', 'pointer', 'number', 'number', 'pointer', 'pointer'],
            [jd, planet, starPtr, epheflag, rsmi, geo.ptr, pressure, temperature, tret.ptr, serr]
        );
        if (retFlag < 0) return null;
        const result = tret.read();
        return result[0]; // JD of the event
    } catch (e) {
        console.error('riseTransFixed error:', e);
        return null;
    } finally {
        geo.free();
        tret.free();
        M._free(serr);
        M._free(starPtr);
    }
}

/**
 * Classify an eclipse from the retFlag bitfield and attr data.
 * 
 * @param {number} retFlag - Return flag from eclipse function
 * @param {number[]} attr - Attributes array from eclipse_how
 * @param {boolean} isSolar - true for solar, false for lunar
 * @returns {{ classification: string, magnitude: number, obscuration: number }}
 */
export function classifyEclipse(retFlag, attr, isSolar) {
    let classification = 'Unknown';

    if (isSolar) {
        if (retFlag & SE_ECL_TOTAL) {
            classification = 'Total';
        } else if (retFlag & SE_ECL_ANNULAR_TOTAL) {
            classification = 'Hybrid';
        } else if (retFlag & SE_ECL_ANNULAR) {
            classification = 'Annular';
        } else if (retFlag & SE_ECL_PARTIAL) {
            classification = 'Partial';
        }

        return {
            classification,
            magnitude: attr ? attr[0] : 0,
            obscuration: attr ? attr[2] : 0,
            sunAltitude: attr ? attr[6] : 0,
        };
    } else {
        // Lunar eclipse
        if (retFlag & SE_ECL_TOTAL) {
            classification = 'Total';
        } else if (retFlag & SE_ECL_PARTIAL) {
            classification = 'Partial';
        } else if (retFlag & SE_ECL_PENUMBRAL) {
            classification = 'Penumbral';
        }

        return {
            classification,
            magnitude: attr ? attr[0] : 0,         // umbral magnitude
            penumbralMag: attr ? attr[1] : 0,       // penumbral magnitude
            obscuration: attr ? attr[0] : 0,        // use umbral mag as proxy
            moonAltitude: attr ? attr[6] : 0,
        };
    }
}

/**
 * Master function: Detect eclipses for the current simulation day and location.
 * 
 * @param {object} swe - SwissEph instance
 * @param {number} simJD - Current simulation Julian Day
 * @param {number} flags - Ephemeris flags
 * @param {object} location - { lon, lat, alt, timezone }
 * @param {object} ui - UI strings for current language
 * @param {function} formatTime - Function to format JD to local time string
 * @returns {object|null} - Comprehensive eclipse data or null
 */
export function detectEclipse(swe, simJD, flags, location, ui, formatTime) {
    const geopos = [location.lon, location.lat, location.alt || 0];
    const searchJD = Math.floor(simJD);

    // ── 1. Solar Eclipse Search ──────────────────────────────────────
    const solar = solarEclipseWhenLoc(swe, searchJD - 0.5, flags, geopos, 0);
    if (solar) {
        const maxJD = solar.tret[0];
        // Check if the eclipse is within ±1 day of current sim time
        if (Math.abs(maxJD - simJD) < 1.0) {
            const howRes = solarEclipseHow(swe, maxJD, flags, geopos);
            if (howRes && howRes.attr[0] > 0) {
                const info = classifyEclipse(howRes.retFlag, howRes.attr, true);

                // Build contact times
                const contacts = {};
                if (solar.tret[1] > 0) contacts.firstContact = formatTime(solar.tret[1]);
                if (solar.tret[2] > 0) contacts.secondContact = formatTime(solar.tret[2]);
                if (solar.tret[0] > 0) contacts.maximum = formatTime(solar.tret[0]);
                if (solar.tret[3] > 0) contacts.thirdContact = formatTime(solar.tret[3]);
                if (solar.tret[4] > 0) contacts.fourthContact = formatTime(solar.tret[4]);

                // Duration of totality/annularity (if applicable)
                let totalityDuration = null;
                if (solar.tret[2] > 0 && solar.tret[3] > 0) {
                    totalityDuration = (solar.tret[3] - solar.tret[2]) * 24 * 3600; // seconds
                }

                // Overall duration
                let overallDuration = null;
                if (solar.tret[1] > 0 && solar.tret[4] > 0) {
                    overallDuration = (solar.tret[4] - solar.tret[1]) * 24 * 60; // minutes
                }

                // Simple time range for backward compat
                const startTime = contacts.firstContact || '';
                const endTime = contacts.fourthContact || '';

                return {
                    type: 'SOLAR',
                    name: ui.solarEclipse,
                    classification: info.classification,
                    times: startTime && endTime ? `${startTime} – ${endTime}` : '',
                    contacts,
                    magnitude: Math.round(info.magnitude * 10000) / 10000,
                    obscuration: Math.round((info.obscuration || 0) * 10000) / 100, // to percentage
                    totalityDuration, // seconds, or null
                    overallDuration, // minutes, or null
                    partial: info.classification === 'Partial',
                    maxJD,
                };
            }
        }
    }

    // ── 2. Lunar Eclipse Search ──────────────────────────────────────
    const lunar = lunarEclipseWhenLoc(swe, searchJD - 0.5, flags, geopos, 0);
    if (lunar) {
        const maxJD = lunar.tret[0];
        if (Math.abs(maxJD - simJD) < 1.0) {
            const howRes = lunarEclipseHow(swe, maxJD, flags, geopos);
            if (howRes && (howRes.attr[0] > 0 || howRes.attr[1] > 0)) {
                const info = classifyEclipse(howRes.retFlag, howRes.attr, false);

                const contacts = {};
                if (lunar.tret[6] > 0) contacts.penumbralBegin = formatTime(lunar.tret[6]);
                if (lunar.tret[2] > 0) contacts.partialBegin = formatTime(lunar.tret[2]);
                if (lunar.tret[4] > 0) contacts.totalityBegin = formatTime(lunar.tret[4]);
                if (lunar.tret[0] > 0) contacts.maximum = formatTime(lunar.tret[0]);
                if (lunar.tret[5] > 0) contacts.totalityEnd = formatTime(lunar.tret[5]);
                if (lunar.tret[3] > 0) contacts.partialEnd = formatTime(lunar.tret[3]);
                if (lunar.tret[7] > 0) contacts.penumbralEnd = formatTime(lunar.tret[7]);

                let totalityDuration = null;
                if (lunar.tret[4] > 0 && lunar.tret[5] > 0) {
                    totalityDuration = (lunar.tret[5] - lunar.tret[4]) * 24 * 3600;
                }

                let overallDuration = null;
                if (lunar.tret[6] > 0 && lunar.tret[7] > 0) {
                    overallDuration = (lunar.tret[7] - lunar.tret[6]) * 24 * 60;
                }

                const startTime = contacts.penumbralBegin || contacts.partialBegin || '';
                const endTime = contacts.penumbralEnd || contacts.partialEnd || '';

                return {
                    type: 'LUNAR',
                    name: ui.lunarEclipse,
                    classification: info.classification,
                    times: startTime && endTime ? `${startTime} – ${endTime}` : '',
                    contacts,
                    magnitude: Math.round(info.magnitude * 10000) / 10000,
                    penumbralMag: Math.round((info.penumbralMag || 0) * 10000) / 10000,
                    obscuration: Math.round((info.obscuration || 0) * 10000) / 100,
                    totalityDuration,
                    overallDuration,
                    partial: info.classification === 'Partial' || info.classification === 'Penumbral',
                    maxJD,
                };
            }
        }
    }

    return null;
}
