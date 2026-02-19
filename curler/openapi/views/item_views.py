from attributes.states import AttributeType
from custom.serializers import CustomSectionsOpenAPIInputSerializer
from django.urls import reverse
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (
    OpenApiExample,
    extend_schema,
    extend_schema_serializer,
)
from openapi.services import item_services
from organization.org_models.item_master_model import EnterpriseItem
from organization.states import EnterpriseItemState, EnterpriseItemType
from organization.structures import ItemCustomId
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_dataclasses.serializers import DataclassSerializer

from factwise.states import states_as_list


class AttributeValueInputSerializer(serializers.Serializer):
    value = serializers.CharField(allow_null=True, allow_blank=True)


class AttributeInputSerializer(serializers.Serializer):
    attribute_name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            "required": "attribute_name is required.",
            "blank": "attribute_name cannot be blank.",
        },
    )
    attribute_type = serializers.ChoiceField(
        choices=states_as_list(AttributeType),  # type: ignore
        required=True,
        error_messages={
            "required": "attribute_type is required.",
            "invalid_choice": "Invalid attribute_type.",
        },
    )
    attribute_value = serializers.ListField(
        child=AttributeValueInputSerializer(),
        required=True,
        allow_empty=False,
        error_messages={
            "required": "attribute_value is required.",
            "empty": "attribute_value cannot be empty.",
        },
    )


class AdditionalCostInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    value = serializers.DecimalField(allow_null=True, max_digits=30, decimal_places=10)


class PricingInformationSerializer(serializers.Serializer):
    price = serializers.DecimalField(
        required=False,
        allow_null=True,
        max_digits=30,
        decimal_places=10,
        error_messages={
            "invalid": "price must be a valid decimal number.",
            "max_digits": "price exceeds maximum allowed digits.",
            "max_decimal_places": "price exceeds allowed decimal precision.",
        },
    )
    currency_code_id = serializers.UUIDField(
        required=False,
        allow_null=True,
        error_messages={
            "invalid": "currency_code_id must be a valid UUID.",
        },
    )
    additional_costs = serializers.ListField(
        child=AdditionalCostInputSerializer(),
        required=False,
        allow_null=True,
        default=list,
        error_messages={
            "not_a_list": "additional_costs must be a list.",
        },
    )
    taxes = serializers.ListField(
        child=AdditionalCostInputSerializer(),
        required=False,
        allow_null=True,
        default=list,
        error_messages={
            "not_a_list": "taxes must be a list.",
        },
    )


class CustomIdSerializer(DataclassSerializer):
    class Meta:
        dataclass = ItemCustomId


class EntityItemSerializer(serializers.Serializer):
    entity_name = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True,
        error_messages={
            "required": "entity_name is required.",
            "blank": "entity_name cannot be blank.",
        },
    )
    ERP_preferred_vendors = serializers.ListField(
        child=serializers.CharField(
            allow_blank=False,
            trim_whitespace=True,
            error_messages={
                "blank": "ERP vendor value cannot be blank.",
            },
        ),
        required=False,
        allow_null=True,
        default=list,
        error_messages={
            "not_a_list": "ERP_preferred_vendors must be a list.",
        },
    )
    factwise_preferred_vendors = serializers.ListField(
        child=serializers.CharField(
            allow_blank=False,
            trim_whitespace=True,
            error_messages={
                "blank": "factwise vendor value cannot be blank.",
            },
        ),
        required=False,
        allow_null=True,
        default=list,
        error_messages={
            "not_a_list": "factwise_preferred_vendors must be a list.",
        },
    )


class ItemBaseInputSerializer(serializers.Serializer):
    created_by_user_email = serializers.EmailField(
        required=True,
        error_messages={
            "required": "created_by_user_email is required.",
            "invalid": "Enter a valid email address.",
        },
    )
    name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            "required": "name is required.",
            "blank": "name cannot be blank.",
        },
    )
    factwise_item_code = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    ERP_item_code = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    description = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    notes = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    internal_notes = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    measurement_units = serializers.ListField(
        child=serializers.UUIDField(),
        required=True,
        min_length=1,
        error_messages={
            "required": "measurement_units is required.",
            "min_length": "At least one measurement_unit is required.",
        },
    )
    item_type = serializers.ChoiceField(
        choices=states_as_list(EnterpriseItemType),  # type: ignore
        default=EnterpriseItemType.RAW_MATERIAL.value,
        error_messages={
            "invalid_choice": "Invalid item_type.",
        },
    )
    status = serializers.ChoiceField(
        choices=states_as_list(EnterpriseItemState),  # type: ignore
        default=EnterpriseItemState.ITEM_ACTIVE.value,
        error_messages={
            "invalid_choice": "Invalid status.",
        },
    )
    attributes = AttributeInputSerializer(
        many=True,
        required=False,
        default=[],
    )
    is_buyer = serializers.BooleanField(
        required=False,
        default=False,  # type: ignore
        error_messages={
            "invalid": "is_buyer must be true or false.",
        },
    )
    buyer_pricing_information = PricingInformationSerializer(
        required=False,
        allow_null=True,
    )
    is_seller = serializers.BooleanField(
        required=False,
        default=False,  # type: ignore
        error_messages={
            "invalid": "is_seller must be true or false.",
        },
    )
    seller_pricing_information = PricingInformationSerializer(
        required=False,
        allow_null=True,
    )
    custom_ids = CustomIdSerializer(
        many=True,
        required=False,
        default=list,
    )
    tags = serializers.ListField(
        child=serializers.CharField(
            allow_blank=False,
            trim_whitespace=True,
            error_messages={
                "blank": "Tag cannot be blank.",
            },
        ),
        required=False,
        default=list,
        error_messages={
            "not_a_list": "tags must be a list.",
        },
    )
    entities = EntityItemSerializer(
        many=True,
        required=False,
        default=list,
    )
    custom_sections = CustomSectionsOpenAPIInputSerializer(
        many=True,
        required=False,
        default=list,
    )

    def validate(self, data):  # type: ignore
        # Validate buyer pricing information
        buyer_pricing_info = data.get("buyer_pricing_information")
        if buyer_pricing_info:
            price = buyer_pricing_info.get("price")
            currency_code_id = buyer_pricing_info.get("currency_code_id")
            if price is not None and currency_code_id is None:
                raise ValidationError(
                    {
                        "buyer_pricing_information": "currency_code_id is required when price is specified."
                    }
                )

        # Validate seller pricing information
        seller_pricing_info = data.get("seller_pricing_information")
        if seller_pricing_info:
            price = seller_pricing_info.get("price")
            currency_code_id = seller_pricing_info.get("currency_code_id")
            if price is not None and currency_code_id is None:
                raise ValidationError(
                    {
                        "seller_pricing_information": "currency_code_id is required when price is specified."
                    }
                )

        attributes = data.get("attributes", [])
        for attribute in attributes:
            if (
                (
                    attribute.get("attribute_name")
                    and attribute.get("attribute_type")
                    and not attribute.get("attribute_value", [])
                )
                or (
                    not attribute.get("attribute_name")
                    and attribute.get("attribute_type")
                    and attribute.get("attribute_value", [])
                )
                or (
                    attribute.get("attribute_name")
                    and not attribute.get("attribute_type")
                    and attribute.get("attribute_value", [])
                )
            ):
                raise ValidationError(
                    "attribute_name, attribute_type and attribute_value is required"
                )
        return data


class EnterpriseItemListAPI(APIView):
    @extend_schema_serializer(
        many=True,
    )
    class OutputSerializer(serializers.ModelSerializer):
        # entity_count = serializers.ReadOnlyField(source="_entity_count")
        # entities = EntityItemSerializer(many=True, read_only=True)

        class Meta:
            model = EnterpriseItem
            # fields = "__all__"
            fields = (
                "enterprise_item_id",
                "code",
                "name",
                "description",
                "notes",
                "internal_notes",
                "measurement_units",
                "buyer_pricing_information",
            )
            ref_name = "EnterpriseItemListAPIOutputSerializer"

    @extend_schema(
        description="Get list of items for an enterprise",
        responses=OutputSerializer(many=True),
        examples=[
            OpenApiExample(
                "Response",
                value=[
                    {
                        "enterprise_item_id": "014e1698-ab56-4406-a2a7-a1164ff1b679",
                        "code": "1002",
                        "name": "Justin Beiber",
                        "description": "",
                        "notes": "",
                        "internal_notes": "",
                        "measurement_units": {
                            "item_measurement_units": [
                                {
                                    "measurement_unit_id": "c275a911-2b74-4d57-bf4f-e9da089637c0",
                                    "measurement_unit_category": "UNITS",
                                    "measurement_unit_value_type": "INT",
                                    "measurement_unit_primary_name": "unit",
                                },
                                {
                                    "measurement_unit_id": "160b3242-27fe-4200-81cb-4f74e75f17fc",
                                    "measurement_unit_category": "OTHER",
                                    "measurement_unit_value_type": "DECIMAL",
                                    "measurement_unit_primary_name": "ssds",
                                },
                                {
                                    "measurement_unit_id": "2b2b739d-1138-47b4-ac77-6871ef7f1c65",
                                    "measurement_unit_category": "WEIGHT",
                                    "measurement_unit_value_type": "DECIMAL",
                                    "measurement_unit_primary_name": "kg",
                                },
                            ]
                        },
                        "buyer_pricing_information": {
                            "price": 100.0,
                            "currency_name": "United States Dollar",
                            "currency_symbol": "$",
                            "currency_code_id": "7bcfbe2e-51c6-45fd-89a8-ebf815f38d0e",
                            "currency_code_abbreviation": "USD",
                        },
                    },
                    {
                        "enterprise_item_id": "0171bff3-56ff-419a-ba50-04f8c8f48430",
                        "code": "MW1011",
                        "name": "BENZENE ACS, ISO",
                        "description": "",
                        "notes": "500 ML",
                        "internal_notes": "Volume",
                        "measurement_units": {
                            "item_measurement_units": [
                                {
                                    "measurement_unit_id": "d062a132-647f-479d-a4ba-5b5fbdd314a4",
                                    "measurement_unit_category": "OTHER",
                                    "measurement_unit_value_type": "DECIMAL",
                                    "measurement_unit_primary_name": "ml",
                                }
                            ]
                        },
                        "buyer_pricing_information": None,
                    },
                ],
            )
        ],
    )
    def get(self, request):
        item = item_services.list_enterprise_items(enterprise_id=request.enterprise_id)
        response_data = self.OutputSerializer(item, many=True).data
        return Response(data=response_data, status=status.HTTP_200_OK)


class CreateItemAPI(APIView):
    class InputSerializer(ItemBaseInputSerializer):
        class Meta:
            ref_name = "CreateEnterpriseItemAPIInputSerializer"

    @extend_schema(
        description="Create an item for an enterprise",
        request=InputSerializer,
        responses={201: OpenApiTypes.STR},
    )
    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = item_services.create_enterprise_item(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        response_data = {"factwise_item_code": code}
        return Response(data=response_data, status=status.HTTP_201_CREATED)


class BulkCreateItemAPI(APIView):
    def post(self, request):
        if not isinstance(request.data, dict) or "items" not in request.data:
            raise ValidationError("'items' must be provided")

        items = request.data["items"]
        if not isinstance(items, list):
            raise ValidationError("'items' must be a list")

        validated_items = []
        validation_errors = []

        for index, item_data in enumerate(items):
            serializer = ItemBaseInputSerializer(data=item_data)
            if serializer.is_valid():
                validated_items.append(
                    {"index": index, "data": serializer.validated_data}
                )
            else:
                validation_errors.append(
                    {
                        "index": index,
                        "erp_item_code": item_data.get("ERP_item_code"),
                        "error": "; ".join(
                            f"{field}: {', '.join(map(str, msgs))}"
                            for field, msgs in serializer.errors.items()  # type: ignore
                        ),
                    }
                )

        service_result = item_services.create_items_bulk(
            enterprise_id=request.enterprise_id,
            items_payload=[i["data"] for i in validated_items],
            total_len=len(items),
            validation_errors=validation_errors,
        )

        if service_result.get("mode") == "async":
            return Response(
                {
                    "mode": "async",
                    "status": "accepted",
                    "task_id": service_result["task_id"],
                    "total_items": len(items),
                    "message": "Item count exceeds synchronous limit. Processing asynchronously.",
                    "status_url": request.build_absolute_uri(
                        reverse(
                            "openapi:bulk_task_status",
                            kwargs={"task_id": service_result["task_id"]},
                        )
                    ),
                },
                status=status.HTTP_202_ACCEPTED,
            )

        results = service_result["results"]

        final_failed = validation_errors + [
            {
                "index": r["index"],  # type: ignore
                "erp_item_code": r.get("erp_item_code"),  # type: ignore
                "error": r["error"],  # type: ignore
            }
            for r in results
            if r["status"] == "failed"  # type: ignore
        ]

        return Response(
            {
                "total": len(items),
                "successful_count": service_result["success"],
                "failed_count": len(final_failed),
                "successful": [
                    {
                        "erp_item_code": str(r.get("erp_item_code", "")),  # type: ignore
                        "item_code": str(r.get("item_code", "")),  # type: ignore
                        "item_id": str(r.get("item_id", "")),  # type: ignore
                    }
                    for r in results
                    if r["status"] == "success"  # type: ignore
                ],
                "failed": final_failed,
            },
            status=status.HTTP_207_MULTI_STATUS,
        )


class UpdateItemAPI(APIView):
    class InputSerializer(serializers.Serializer):
        modified_by_user_email = serializers.EmailField()
        name = serializers.CharField()
        ERP_item_code = serializers.CharField(
            allow_null=True, default=None, required=False
        )
        factwise_item_code = serializers.CharField(
            allow_null=True, default=None, required=False
        )
        description = serializers.CharField(
            allow_blank=True, allow_null=True, default=None
        )
        notes = serializers.CharField(allow_blank=True, allow_null=True, default=None)
        internal_notes = serializers.CharField(
            allow_blank=True, allow_null=True, default=None
        )
        measurement_units = serializers.ListSerializer(
            child=serializers.UUIDField(), min_length=1
        )
        item_type = serializers.ChoiceField(
            choices=states_as_list(EnterpriseItemType),
            default=EnterpriseItemType.RAW_MATERIAL.value,
        )
        attributes = AttributeInputSerializer(many=True)
        is_buyer = serializers.BooleanField()
        buyer_pricing_information = PricingInformationSerializer(allow_null=True)
        is_seller = serializers.BooleanField()
        seller_pricing_information = PricingInformationSerializer(allow_null=True)
        custom_ids = CustomIdSerializer(
            allow_null=True, required=False, default=[], many=True
        )
        tags = serializers.ListField(
            child=serializers.CharField(), min_length=0, default=[]
        )
        entities = EntityItemSerializer(many=True, default=[])
        custom_sections = CustomSectionsOpenAPIInputSerializer(many=True)

        class Meta:
            ref_name = "UpdateItemAPIInputSerializer"

        def validate(self, data):
            # Validate buyer pricing information
            buyer_pricing_info = data.get("buyer_pricing_information")
            if buyer_pricing_info:
                price = buyer_pricing_info.get("price")
                currency_code_id = buyer_pricing_info.get("currency_code_id")
                if price is not None and currency_code_id is None:
                    raise ValidationError(
                        {
                            "buyer_pricing_information": "currency_code_id is required when price is specified."
                        }
                    )

            # Validate seller pricing information
            seller_pricing_info = data.get("seller_pricing_information")
            if seller_pricing_info:
                price = seller_pricing_info.get("price")
                currency_code_id = seller_pricing_info.get("currency_code_id")
                if price is not None and currency_code_id is None:
                    raise ValidationError(
                        {
                            "seller_pricing_information": "currency_code_id is required when price is specified."
                        }
                    )

            attributes = data.get("attributes", [])
            for attribute in attributes:
                if (
                    (
                        attribute.get("attribute_name")
                        and attribute.get("attribute_type")
                        and not attribute.get("attribute_value", [])
                    )
                    or (
                        not attribute.get("attribute_name")
                        and attribute.get("attribute_type")
                        and attribute.get("attribute_value", [])
                    )
                    or (
                        attribute.get("attribute_name")
                        and not attribute.get("attribute_type")
                        and attribute.get("attribute_value", [])
                    )
                ):
                    raise ValidationError(
                        "attribute_name, attribute_type and attribute_value is required"
                    )

            return data

    @extend_schema(
        description="Update an item for an enterprise",
        request=InputSerializer,
        responses={200: OpenApiTypes.STR},
    )
    def put(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        item_services.update_item(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        return Response(status=status.HTTP_200_OK)


class UpdateItemStateAPI(APIView):
    class InputSerializer(serializers.Serializer):
        modified_by_user_email = serializers.EmailField()
        # code = serializers.CharField()
        ERP_item_code = serializers.CharField(
            allow_null=True, default=None, required=False
        )
        factwise_item_code = serializers.CharField(
            allow_null=True, default=None, required=False
        )
        status = serializers.ChoiceField(choices=states_as_list(EnterpriseItemState))

    def put(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        item_services.update_item_status(
            enterprise_id=request.enterprise_id, **serializer.validated_data
        )
        return Response(status=status.HTTP_200_OK)
