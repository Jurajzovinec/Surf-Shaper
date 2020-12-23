import * as THREE from 'three';
import { useAsset } from 'use-asset';
import React, { useMemo, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useSpring, animated } from 'react-spring/three';
import { useEffect } from 'react';

const SurfComponent = ({ position, gltfData }) => {

    const [initialize, setInitialize] = useState(() => false);

    let buffer;

    buffer = gltfData ? JSON.stringify(gltfData) : JSON.stringify(cube);

    const { scene } = useAsset((buffer) => new Promise((res, rej) => new GLTFLoader().parse(buffer, '', res, rej)), [buffer]);

    const sceneCopy = useMemo(() => scene?.clone(true), [scene]);

    const newMaterial = new THREE.MeshStandardMaterial({
        color: 0xfcfc,
        metalness: 0.65,
        roughness: 0
    });

    sceneCopy.traverse((o) => { if (o.isMesh) o.material = newMaterial; });

    useEffect(() => {
        console.log(scene);
        setInitialize(true);
        setInitialize(!initialize);
    }, [buffer]);

    const { rotation } = useSpring({
        rotation: initialize ? [0, THREE.Math.degToRad(720), THREE.Math.degToRad(0)] : [0, 0, 0],
        config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 }
    });

    return (
        <animated.mesh position={position} scale={[1.5, 1.5, 1.5]} rotation={rotation} >
            <primitive object={sceneCopy} dispose={null} />
            <animated.meshStandardMaterial />
        </animated.mesh>
    )
}

const cube = {
    "accessors": [
        {
            "bufferView": 0,
            "componentType": 5125,
            "count": 6,
            "max": [
                3.0
            ],
            "min": [
                0.0
            ],
            "name": "mesh0_idx_accessor",
            "type": "SCALAR"
        },
        {
            "bufferView": 1,
            "componentType": 5126,
            "count": 4,
            "max": [
                0.10000000149011612,
                0.4000000059604645,
                0.0
            ],
            "min": [
                -0.10000000149011612,
                0.0,
                0.0
            ],
            "name": "mesh0_coord_accessor",
            "type": "VEC3"
        },
        {
            "bufferView": 2,
            "componentType": 5126,
            "count": 4,
            "max": [
                0.0,
                0.0,
                1.0
            ],
            "min": [
                0.0,
                0.0,
                1.0
            ],
            "name": "mesh0_norm_accessor",
            "type": "VEC3"
        },
        {
            "bufferView": 3,
            "componentType": 5125,
            "count": 6,
            "max": [
                3.0
            ],
            "min": [
                0.0
            ],
            "name": "mesh1_idx_accessor",
            "type": "SCALAR"
        },
        {
            "bufferView": 4,
            "componentType": 5126,
            "count": 4,
            "max": [
                0.10000000149011612,
                5.551115123125783e-17,
                0.0
            ],
            "min": [
                -0.10000000149011612,
                0.0,
                -1.0
            ],
            "name": "mesh1_coord_accessor",
            "type": "VEC3"
        },
        {
            "bufferView": 5,
            "componentType": 5126,
            "count": 4,
            "max": [
                6.123234262925839e-17,
                -1.0,
                6.123234262925839e-17
            ],
            "min": [
                6.123234262925839e-17,
                -1.0,
                6.123234262925839e-17
            ],
            "name": "mesh1_norm_accessor",
            "type": "VEC3"
        },
        {
            "bufferView": 6,
            "componentType": 5125,
            "count": 6,
            "max": [
                3.0
            ],
            "min": [
                0.0
            ],
            "name": "mesh2_idx_accessor",
            "type": "SCALAR"
        },
        {
            "bufferView": 7,
            "componentType": 5126,
            "count": 4,
            "max": [
                0.10000000149011612,
                0.4000000059604645,
                -1.0
            ],
            "min": [
                -0.10000000149011612,
                5.551115123125783e-17,
                -1.0
            ],
            "name": "mesh2_coord_accessor",
            "type": "VEC3"
        },
        {
            "bufferView": 8,
            "componentType": 5126,
            "count": 4,
            "max": [
                1.2246468525851679e-16,
                0.0,
                -1.0
            ],
            "min": [
                1.2246468525851679e-16,
                0.0,
                -1.0
            ],
            "name": "mesh2_norm_accessor",
            "type": "VEC3"
        },
        {
            "bufferView": 9,
            "componentType": 5125,
            "count": 6,
            "max": [
                3.0
            ],
            "min": [
                0.0
            ],
            "name": "mesh3_idx_accessor",
            "type": "SCALAR"
        },
        {
            "bufferView": 10,
            "componentType": 5126,
            "count": 4,
            "max": [
                0.10000000149011612,
                0.4000000059604645,
                0.0
            ],
            "min": [
                -0.10000000149011612,
                0.4000000059604645,
                -1.0
            ],
            "name": "mesh3_coord_accessor",
            "type": "VEC3"
        },
        {
            "bufferView": 11,
            "componentType": 5126,
            "count": 4,
            "max": [
                6.123234262925839e-17,
                1.0,
                6.123234262925839e-17
            ],
            "min": [
                6.123234262925839e-17,
                1.0,
                6.123234262925839e-17
            ],
            "name": "mesh3_norm_accessor",
            "type": "VEC3"
        },
        {
            "bufferView": 12,
            "componentType": 5125,
            "count": 6,
            "max": [
                3.0
            ],
            "min": [
                0.0
            ],
            "name": "mesh4_idx_accessor",
            "type": "SCALAR"
        },
        {
            "bufferView": 13,
            "componentType": 5126,
            "count": 4,
            "max": [
                0.10000000149011612,
                0.4000000059604645,
                0.0
            ],
            "min": [
                0.10000000149011612,
                0.0,
                -1.0
            ],
            "name": "mesh4_coord_accessor",
            "type": "VEC3"
        },
        {
            "bufferView": 14,
            "componentType": 5126,
            "count": 4,
            "max": [
                1.0,
                0.0,
                6.123234262925839e-17
            ],
            "min": [
                1.0,
                0.0,
                6.123234262925839e-17
            ],
            "name": "mesh4_norm_accessor",
            "type": "VEC3"
        },
        {
            "bufferView": 15,
            "componentType": 5125,
            "count": 6,
            "max": [
                3.0
            ],
            "min": [
                0.0
            ],
            "name": "mesh5_idx_accessor",
            "type": "SCALAR"
        },
        {
            "bufferView": 16,
            "componentType": 5126,
            "count": 4,
            "max": [
                -0.10000000149011612,
                0.4000000059604645,
                0.0
            ],
            "min": [
                -0.10000000149011612,
                0.0,
                -1.0
            ],
            "name": "mesh5_coord_accessor",
            "type": "VEC3"
        },
        {
            "bufferView": 17,
            "componentType": 5126,
            "count": 4,
            "max": [
                -1.0,
                -1.2246468525851679e-16,
                6.123234262925839e-17
            ],
            "min": [
                -1.0,
                -1.2246468525851679e-16,
                6.123234262925839e-17
            ],
            "name": "mesh5_norm_accessor",
            "type": "VEC3"
        }
    ],
    "asset": {
        "version": "2.0"
    },
    "bufferViews": [
        {
            "buffer": 0,
            "byteLength": 24,
            "name": "mesh0_idx_bufferView",
            "target": 34963
        },
        {
            "buffer": 1,
            "byteLength": 48,
            "name": "mesh0_coord_bufferView",
            "target": 34962
        },
        {
            "buffer": 2,
            "byteLength": 48,
            "name": "mesh0_norm_bufferView",
            "target": 34962
        },
        {
            "buffer": 3,
            "byteLength": 24,
            "name": "mesh1_idx_bufferView",
            "target": 34963
        },
        {
            "buffer": 4,
            "byteLength": 48,
            "name": "mesh1_coord_bufferView",
            "target": 34962
        },
        {
            "buffer": 5,
            "byteLength": 48,
            "name": "mesh1_norm_bufferView",
            "target": 34962
        },
        {
            "buffer": 6,
            "byteLength": 24,
            "name": "mesh2_idx_bufferView",
            "target": 34963
        },
        {
            "buffer": 7,
            "byteLength": 48,
            "name": "mesh2_coord_bufferView",
            "target": 34962
        },
        {
            "buffer": 8,
            "byteLength": 48,
            "name": "mesh2_norm_bufferView",
            "target": 34962
        },
        {
            "buffer": 9,
            "byteLength": 24,
            "name": "mesh3_idx_bufferView",
            "target": 34963
        },
        {
            "buffer": 10,
            "byteLength": 48,
            "name": "mesh3_coord_bufferView",
            "target": 34962
        },
        {
            "buffer": 11,
            "byteLength": 48,
            "name": "mesh3_norm_bufferView",
            "target": 34962
        },
        {
            "buffer": 12,
            "byteLength": 24,
            "name": "mesh4_idx_bufferView",
            "target": 34963
        },
        {
            "buffer": 13,
            "byteLength": 48,
            "name": "mesh4_coord_bufferView",
            "target": 34962
        },
        {
            "buffer": 14,
            "byteLength": 48,
            "name": "mesh4_norm_bufferView",
            "target": 34962
        },
        {
            "buffer": 15,
            "byteLength": 24,
            "name": "mesh5_idx_bufferView",
            "target": 34963
        },
        {
            "buffer": 16,
            "byteLength": 48,
            "name": "mesh5_coord_bufferView",
            "target": 34962
        },
        {
            "buffer": 17,
            "byteLength": 48,
            "name": "mesh5_norm_bufferView",
            "target": 34962
        }
    ],
    "buffers": [
        {
            "byteLength": 24,
            "name": "mesh0_idx_buffer",
            "uri": "data:application/octet-stream;base64,AAAAAAEAAAACAAAAAgAAAAMAAAAAAAAA"
        },
        {
            "byteLength": 48,
            "name": "mesh0_coord_buffer",
            "uri": "data:application/octet-stream;base64,zczMPc3MzD4AAAAAzczMvc3MzD4AAAAAzczMvQAAAAAAAAAAzczMPQAAAAAAAAAA"
        },
        {
            "byteLength": 48,
            "name": "mesh0_norm_buffer",
            "uri": "data:application/octet-stream;base64,AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/"
        },
        {
            "byteLength": 24,
            "name": "mesh1_idx_buffer",
            "uri": "data:application/octet-stream;base64,AAAAAAEAAAACAAAAAgAAAAMAAAAAAAAA"
        },
        {
            "byteLength": 48,
            "name": "mesh1_coord_buffer",
            "uri": "data:application/octet-stream;base64,zczMPQAAAAAAAAAAzczMvQAAAAAAAAAAzczMvQAAgCQAAIC/zczMPQAAgCQAAIC/"
        },
        {
            "byteLength": 48,
            "name": "mesh1_norm_buffer",
            "uri": "data:application/octet-stream;base64,MjGNJAAAgL8yMY0kMjGNJAAAgL8yMY0kMjGNJAAAgL8yMY0kMjGNJAAAgL8yMY0k"
        },
        {
            "byteLength": 24,
            "name": "mesh2_idx_buffer",
            "uri": "data:application/octet-stream;base64,AAAAAAEAAAACAAAAAgAAAAMAAAAAAAAA"
        },
        {
            "byteLength": 48,
            "name": "mesh2_coord_buffer",
            "uri": "data:application/octet-stream;base64,zczMPQAAgCQAAIC/zczMvQAAgCQAAIC/zczMvc3MzD4AAIC/zczMPc3MzD4AAIC/"
        },
        {
            "byteLength": 48,
            "name": "mesh2_norm_buffer",
            "uri": "data:application/octet-stream;base64,MjENJQAAAAAAAIC/MjENJQAAAAAAAIC/MjENJQAAAAAAAIC/MjENJQAAAAAAAIC/"
        },
        {
            "byteLength": 24,
            "name": "mesh3_idx_buffer",
            "uri": "data:application/octet-stream;base64,AAAAAAEAAAACAAAAAgAAAAMAAAAAAAAA"
        },
        {
            "byteLength": 48,
            "name": "mesh3_coord_buffer",
            "uri": "data:application/octet-stream;base64,zczMPc3MzD4AAIC/zczMvc3MzD4AAIC/zczMvc3MzD4AAAAAzczMPc3MzD4AAAAA"
        },
        {
            "byteLength": 48,
            "name": "mesh3_norm_buffer",
            "uri": "data:application/octet-stream;base64,MjGNJAAAgD8yMY0kMjGNJAAAgD8yMY0kMjGNJAAAgD8yMY0kMjGNJAAAgD8yMY0k"
        },
        {
            "byteLength": 24,
            "name": "mesh4_idx_buffer",
            "uri": "data:application/octet-stream;base64,AAAAAAEAAAACAAAAAgAAAAMAAAAAAAAA"
        },
        {
            "byteLength": 48,
            "name": "mesh4_coord_buffer",
            "uri": "data:application/octet-stream;base64,zczMPc3MzD4AAAAAzczMPQAAAAAAAAAAzczMPQAAgCQAAIC/zczMPc3MzD4AAIC/"
        },
        {
            "byteLength": 48,
            "name": "mesh4_norm_buffer",
            "uri": "data:application/octet-stream;base64,AACAPwAAAAAyMY0kAACAPwAAAAAyMY0kAACAPwAAAAAyMY0kAACAPwAAAAAyMY0k"
        },
        {
            "byteLength": 24,
            "name": "mesh5_idx_buffer",
            "uri": "data:application/octet-stream;base64,AAAAAAEAAAACAAAAAgAAAAMAAAAAAAAA"
        },
        {
            "byteLength": 48,
            "name": "mesh5_coord_buffer",
            "uri": "data:application/octet-stream;base64,zczMvc3MzD4AAAAAzczMvc3MzD4AAIC/zczMvQAAgCQAAIC/zczMvQAAAAAAAAAA"
        },
        {
            "byteLength": 48,
            "name": "mesh5_norm_buffer",
            "uri": "data:application/octet-stream;base64,AACAvzIxDaUyMY0kAACAvzIxDaUyMY0kAACAvzIxDaUyMY0kAACAvzIxDaUyMY0k"
        }
    ],
    "extensionsUsed": [
        "PTC_onshape_metadata"
    ],
    "materials": [
        {
            "doubleSided": true,
            "name": "0.513725_0.737255_0.407843_0.000000_0.000000",
            "pbrMetallicRoughness": {
                "baseColorFactor": [
                    0.5137255191802979,
                    0.7372549176216125,
                    0.40784314274787903,
                    1.0
                ],
                "metallicFactor": 0.0
            }
        }
    ],
    "meshes": [
        {
            "name": "mesh0_mesh",
            "primitives": [
                {
                    "attributes": {
                        "NORMAL": 2,
                        "POSITION": 1
                    },
                    "indices": 0,
                    "material": 0
                }
            ]
        },
        {
            "name": "mesh1_mesh",
            "primitives": [
                {
                    "attributes": {
                        "NORMAL": 5,
                        "POSITION": 4
                    },
                    "indices": 3,
                    "material": 0
                }
            ]
        },
        {
            "name": "mesh2_mesh",
            "primitives": [
                {
                    "attributes": {
                        "NORMAL": 8,
                        "POSITION": 7
                    },
                    "indices": 6,
                    "material": 0
                }
            ]
        },
        {
            "name": "mesh3_mesh",
            "primitives": [
                {
                    "attributes": {
                        "NORMAL": 11,
                        "POSITION": 10
                    },
                    "indices": 9,
                    "material": 0
                }
            ]
        },
        {
            "name": "mesh4_mesh",
            "primitives": [
                {
                    "attributes": {
                        "NORMAL": 14,
                        "POSITION": 13
                    },
                    "indices": 12,
                    "material": 0
                }
            ]
        },
        {
            "name": "mesh5_mesh",
            "primitives": [
                {
                    "attributes": {
                        "NORMAL": 17,
                        "POSITION": 16
                    },
                    "indices": 15,
                    "material": 0
                }
            ]
        }
    ],
    "nodes": [
        {
            "children": [
                1,
                3,
                5,
                7,
                9,
                11
            ],
            "extensions": {
                "PTC_onshape_metadata": {
                    "id": [
                        "JHD"
                    ]
                }
            },
            "name": "Part 1"
        },
        {
            "children": [
                2
            ],
            "extensions": {
                "PTC_onshape_metadata": {
                    "id": [
                        "JHC"
                    ]
                }
            },
            "name": "mesh0"
        },
        {
            "mesh": 0,
            "name": "mesh0_meshnode_0"
        },
        {
            "children": [
                4
            ],
            "extensions": {
                "PTC_onshape_metadata": {
                    "id": [
                        "JHS"
                    ]
                }
            },
            "name": "mesh1"
        },
        {
            "mesh": 1,
            "name": "mesh1_meshnode_1"
        },
        {
            "children": [
                6
            ],
            "extensions": {
                "PTC_onshape_metadata": {
                    "id": [
                        "JHO"
                    ]
                }
            },
            "name": "mesh2"
        },
        {
            "mesh": 2,
            "name": "mesh2_meshnode_2"
        },
        {
            "children": [
                8
            ],
            "extensions": {
                "PTC_onshape_metadata": {
                    "id": [
                        "JHW"
                    ]
                }
            },
            "name": "mesh3"
        },
        {
            "mesh": 3,
            "name": "mesh3_meshnode_3"
        },
        {
            "children": [
                10
            ],
            "extensions": {
                "PTC_onshape_metadata": {
                    "id": [
                        "JHK"
                    ]
                }
            },
            "name": "mesh4"
        },
        {
            "mesh": 4,
            "name": "mesh4_meshnode_4"
        },
        {
            "children": [
                12
            ],
            "extensions": {
                "PTC_onshape_metadata": {
                    "id": [
                        "JHG"
                    ]
                }
            },
            "name": "mesh5"
        },
        {
            "mesh": 5,
            "name": "mesh5_meshnode_5"
        }
    ],
    "scene": 0,
    "scenes": [
        {
            "name": "Root",
            "nodes": [
                0
            ]
        }
    ]
};

export default SurfComponent;
