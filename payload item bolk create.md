curl --location 'https://n29p4xri95.execute-api.us-east-1.amazonaws.com/dev/api/items/bulk-create/' \
--header 'x-api-key: G620jT6lwx3IbKQKFtmlw9zNYvqVZLQQ5HHCexBj' \
--header 'api-id: h7kbdchbl2' \
--header 'Content-Type: application/json' \
--data-raw '{
    "created_by_user_email": "globalfieldsETE@gmail.com",
    "name": "Test Item NG",
    "ERP_item_code": "ERP-ITEM-001",
    "description": "Item created via open API",
    "notes": "Testing taxes and additional costs",
    "internal_notes": "Internal testing item",
    "measurement_units": [
        "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    ],
    "item_type": "RAW_MATERIAL",
    "status": "ACTIVE",
    "attributes": [
        {
            "attribute_name": "Color",
            "attribute_type": "TEXT",
            "attribute_value": [
                {
                    "value": "Black"
                }
            ]
        }
    ],
    "is_buyer": true,
    "buyer_pricing_information": {
        "price": 1000,
        "currency_code_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "additional_costs": [
            {
                "name": "ADD cost % I IL",
                "value": 10
            },
            {
                "name": "NRE",
                "value": 5
            },
            {
                "name": "ADD cost PU I IL",
                "value": 7
            }
        ],
        "taxes": [
            {
                "name": "Item tax %",
                "value": 18
            },
            {
                "name": "Item tax OQ",
                "value": 12
            },
            {
                "name": "Item tax PU I OV",
                "value": 1
            }
        ]
    },
    "is_seller": true,
    "seller_pricing_information": {
        "price": 1200,
        "currency_code_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "additional_costs": [
            {
                "name": "ADD cost % I IL",
                "value": 10
            },
            {
                "name": "NRE",
                "value": 5
            },
            {
                "name": "ADD cost PU I IL",
                "value": 7
            }
        ],
        "taxes": [
            {
                "name": "Item tax %",
                "value": 18
            },
            {
                "name": "Item tax OQ",
                "value": 12
            },
            {
                "name": "Item tax PU I OV",
                "value": 1
            }
        ]
    },
    "custom_ids": [
        {
            "name": "HSN",
            "value": "8471"
        }
    ],
    "tags": [
        "API",
        "NG_TEST"
    ],
    "entities": [
        {
            "entity_name": "FactWise",
            "ERP_preferred_vendors": [],
            "factwise_preferred_vendors": [
                "MDvendorcreate7"
            ]
        }
    ],
    "custom_sections": [
        {
            "name": "NG Fields",
            "custom_fields": [
                {
                    "name": "Short NG",
                    "value": "Sample short text"
                },
                {
                    "name": "Number NG",
                    "value": "25"
                },
                {
                    "name": "Long NG",
                    "value": "This is a long text custom field value"
                },
                {
                    "name": "Date NG",
                    "value": "2026-02-10"
                },
                {
                    "name": "Checkbox NG",
                    "value": "true"
                },
                {
                    "name": "Select NG",
                    "value": "Yes"
                },
                {
                    "name": "Multi Select NG",
                    "value": "Yes"
                },
                {
                    "name": "Multi Select NG",
                    "value": "Maybe"
                }
            ]
        }
    ]
}'
 
 




{
    "items": [
        {
            "created_by_user_email": "globalfieldsETE@gmail.com",
            "name": "Test Item NG",
            "ERP_item_code": "ERP-ITEM-01090928999",
            "factwise_item_code": "BKT-1088",
            "description": "Item created via open API",
            "notes": "Testing taxes and additional costs",
            "internal_notes": "Internal testing item",
            "measurement_units": [
                "66d42245-5a0d-4801-8cb2-43bf627f7cbe"
            ],
            "item_type": "RAW_MATERIAL",
            "status": "ACTIVE",
            "attributes": [
                {
                    "attribute_name": "color",
                    "attribute_type": "TEXT",
                    "attribute_value": [
                        {
                            "value": "Red"
                        }
                    ]
                }
            ],
            "is_buyer": true,
            "buyer_pricing_information": {
                "price": 1000,
                "currency_code_id": "0f6c64c3-0ec3-482e-9dc2-7e20b6431bda",
                "additional_costs": [
                    {
                        "name": "ADD cost % l IL",
                        "value": 10
                    },
                    {
                        "name": "NRE",
                        "value": 5
                    },
                    {
                        "name": "ADD cost PU | IL",
                        "value": 7
                    }
                ],
                "taxes": [
                    {
                        "name": "Item tax %",
                        "value": 18
                    },
                    {
                        "name": "Item tax OQ",
                        "value": 12
                    }
                ]
            },
            "is_seller": true,
            "seller_pricing_information": {
                "price": 1200,
                "currency_code_id": "0f6c64c3-0ec3-482e-9dc2-7e20b6431bda",
                "additional_costs": [
                    {
                        "name": "ADD cost % l IL",
                        "value": 10
                    },
                    {
                        "name": "NRE",
                        "value": 5
                    },
                    {
                        "name": "ADD cost PU | IL",
                        "value": 7
                    }
                ],
                "taxes": [
                    {
                        "name": "Item tax %",
                        "value": 18
                    },
                    {
                        "name": "Item tax OQ",
                        "value": 12
                    }
                ]
            },
            "custom_ids": [
                {
                    "name": "HSN",
                    "value": "8471"
                }
            ],
            "tags": [
                "API",
                "NG_TEST"
            ],
            "entities": [
                {
                    "entity_name": "FactWise",
                    "ERP_preferred_vendors": [],
                    "factwise_preferred_vendors": [
                        "V0029"
                    ]
                }
            ],
            "custom_sections": [
                {
                    "name": "Item Details",
                    "custom_fields": [
                        {
                            "name": "ST IL",
                            "value": "Testing"
                        },
                        {
                            "name": "LT IL",
                            "value": "This is a long text field used for testing bulk import API"
                        },
                        {
                            "name": "Number IL",
                            "value": 123.45
                        },
                        {
                            "name": "Date IL",
                            "value": "2026-02-12"
                        },
                        {
                            "name": "Checkbox IL",
                            "value": true
                        },
                        {
                            "name": "Select IL",
                            "value": "Yes"
                        },
                        {
                            "name": "Multi Select IL",
                            "value": [
                                "Yes",
                                "Maybe"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "created_by_user_email": "globalfieldsETE@gmail.com",
            "name": "Test Item SG",
            "ERP_item_code": "ERP-ITEM-1010199098",
            "factwise_item_code": "BKT-1090",
            "description": "Item created via open API",
            "notes": "Testing taxes and additional costs",
            "internal_notes": "Internal testing item",
            "measurement_units": [
                "66d42245-5a0d-4801-8cb2-43bf627f7cbe"
            ],
            "item_type": "RAW_MATERIAL",
            "status": "ACTIVE",
            "attributes": [
                {
                    "attribute_name": "color",
                    "attribute_type": "TEXT",
                    "attribute_value": [
                        {
                            "value": "Red"
                        }
                    ]
                }
            ],
            "is_buyer": true,
            "buyer_pricing_information": {
                "price": 1000,
                "currency_code_id": "0f6c64c3-0ec3-482e-9dc2-7e20b6431bda",
                "additional_costs": [
                    {
                        "name": "ADD cost % l IL",
                        "value": 10
                    },
                    {
                        "name": "NRE",
                        "value": 5
                    },
                    {
                        "name": "ADD cost PU | IL",
                        "value": 7
                    }
                ],
                "taxes": [
                    {
                        "name": "Item tax %",
                        "value": 18
                    },
                    {
                        "name": "Item tax OQ",
                        "value": 22
                    }
                ]
            },
            "is_seller": true,
            "seller_pricing_information": {
                "price": 1200,
                "currency_code_id": "0f6c64c3-0ec3-482e-9dc2-7e20b6431bda",
                "additional_costs": [
                    {
                        "name": "ADD cost % l IL",
                        "value": 1
                    },
                    {
                        "name": "NRE",
                        "value": 8
                    },
                    {
                        "name": "ADD cost PU | IL",
                        "value": 3
                    }
                ],
                "taxes": [
                    {
                        "name": "Item tax %",
                        "value": 18
                    },
                    {
                        "name": "Item tax OQ",
                        "value": 12
                    }
                ]
            },
            "custom_ids": [
                {
                    "name": "HSN",
                    "value": "8471"
                }
            ],
            "tags": [
                "API",
                "NG_TEST"
            ],
            "entities": [
                {
                    "entity_name": "FactWise",
                    "ERP_preferred_vendors": [],
                    "factwise_preferred_vendors": [
                        "V0029"
                    ]
                }
            ],
            "custom_sections": [
                {
                    "name": "Item Details",
                    "custom_fields": [
                        {
                            "name": "ST IL",
                            "value": "Testing"
                        },
                        {
                            "name": "LT IL",
                            "value": "This is a long text field used for testing bulk import API"
                        },
                        {
                            "name": "Number IL",
                            "value": 123.45
                        },
                        {
                            "name": "Date IL",
                            "value": "2026-02-12"
                        },
                        {
                            "name": "Checkbox IL",
                            "value": true
                        },
                        {
                            "name": "Select IL",
                            "value": "Yes"
                        },
                        {
                            "name": "Multi Select IL",
                            "value": [
                                "Yes",
                                "Maybe"
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}



script
const count = 302; // change if needed

function generateItem(i) {
    return {
        created_by_user_email: "globalfieldsETE@gmail.com",
        name: `Test Item Bulk ${i}`,
        ERP_item_code: `AA-ITEM-BULK-${Date.now()}-${i}`,
        factwise_item_code: `BKT-BULK-${Date.now()}-${i}`,
        description: "Item created via open API",
        notes: "Testing taxes and additional costs",
        internal_notes: "Internal testing item",
        measurement_units: [
            "66d42245-5a0d-4801-8cb2-43bf627f7cbe"
        ],
        item_type: "RAW_MATERIAL",
        status: "ACTIVE",
        attributes: [
            {
                attribute_name: "color",
                attribute_type: "TEXT",
                attribute_value: [
                    { value: "Red" }
                ]
            }
        ],
        is_buyer: true,
        buyer_pricing_information: {
            price: 1000,
            currency_code_id: "0f6c64c3-0ec3-482e-9dc2-7e20b6431bda",
            additional_costs: [
                { name: "ADD cost % l IL", value: 10 },
                { name: "NRE", value: 5 },
                { name: "ADD cost PU | IL", value: 7 }
            ],
            taxes: [
                { name: "Item tax %", value: 18 },
                { name: "Item tax OQ", value: 12 }
            ]
        },
        is_seller: true,
        seller_pricing_information: {
            price: 1200,
            currency_code_id: "0f6c64c3-0ec3-482e-9dc2-7e20b6431bda",
            additional_costs: [
                { name: "ADD cost % l IL", value: 10 },
                { name: "NRE", value: 5 },
                { name: "ADD cost PU | IL", value: 7 }
            ],
            taxes: [
                { name: "Item tax %", value: 18 },
                { name: "Item tax OQ", value: 12 }
            ]
        },
        custom_ids: [
            { name: "HSN", value: "8471" }
        ],
        tags: ["API", "NG_TEST"],
        entities: [
            {
                entity_name: "FactWise",
                ERP_preferred_vendors: [],
                factwise_preferred_vendors: ["V0029"]
            }
        ],
        custom_sections: [
            {
                name: "Item Details",
                custom_fields: [
                    { name: "ST IL", value: "Testing" },
                    { name: "LT IL", value: "This is a long text field used for testing bulk import API" },
                    { name: "Number IL", value: 123.45 },
                    { name: "Date IL", value: "2026-02-12" },
                    { name: "Checkbox IL", value: true },
                    { name: "Select IL", value: "Yes" },
                    { name: "Multi Select IL", value: ["Yes", "Maybe"] }
                ]
            }
        ]
    };
}

let items = [];

for (let i = 152; i <= count; i++) {
    items.push(generateItem(i));
}

pm.variables.set("bulkPayload", JSON.stringify({ items }, null, 2));