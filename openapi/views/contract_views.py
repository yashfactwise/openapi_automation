from backbone.states import IncotermAbbreviationType
from contract.states import ContractState
from custom.serializers import CustomSectionsOpenAPIInputSerializer
from django.urls import reverse
from drf_spectacular.utils import extend_schema
from openapi.serializers import (
    AdditionalCostInputSerializer,
    AddressSerializer,
    AttachmentSerializer,
    AttributeInputSerializer,
    DeliverablesPaymentTermsSerializer,
    PaymentTermsSerializer,
    PricingTierInputSerializer,
    TermsAndConditionsSerializer,
    VendorIdentificationSerializer,
)
from openapi.services import contract_services
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from factwise.openapi.service import normalize_serializer_errors
from factwise.states import PaymentType, PeriodType, states_as_list


class ContractItemSerializer(serializers.Serializer):
    ERP_item_code = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid ERP item code.",
            "blank": "ERP item code cannot be empty.",
        },
    )
    factwise_item_code = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid Factwise item code.",
            "blank": "Factwise item code cannot be empty.",
        },
    )
    currency_code_id = serializers.UUIDField(
        error_messages={
            "required": "Currency code ID is required.",
            "invalid": "Invalid currency code ID.",
        }
    )
    measurement_unit_id = serializers.UUIDField(
        error_messages={
            "required": "Measurement unit ID is required.",
            "invalid": "Invalid measurement unit ID.",
        }
    )
    attributes = AttributeInputSerializer(
        many=True,
        error_messages={
            "required": "At least one attribute is required.",
            "invalid": "Invalid attribute data.",
        },
    )
    prepayment_percentage = serializers.DecimalField(
        max_digits=7,
        decimal_places=4,
        min_value=0,
        max_value=100,
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid prepayment percentage.",
            "min_value": "Prepayment percentage cannot be less than 0.",
            "max_value": "Prepayment percentage cannot exceed 100.",
            "max_digits": "Prepayment percentage exceeds the maximum allowed digits.",
            "max_decimal_places": "Prepayment percentage exceeds the maximum allowed decimal places.",
        },
    )
    payment_type = serializers.ChoiceField(
        states_as_list(PaymentType),  # type: ignore
        allow_null=True,
        required=False,
        error_messages={
            "invalid_choice": "Invalid payment type.",
        },
    )
    payment_terms = PaymentTermsSerializer(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid payment terms.",
        },
    )
    deliverables_payment_terms = DeliverablesPaymentTermsSerializer(
        many=True,
        error_messages={
            "invalid": "Invalid deliverables payment terms.",
        },
    )
    incoterm = serializers.ChoiceField(
        choices=states_as_list(IncotermAbbreviationType),  # type: ignore
        error_messages={
            "required": "Incoterm is required.",
            "invalid_choice": "Invalid incoterm.",
        },
    )
    lead_time = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        allow_null=True,
        required=False,
        min_value=0,
        error_messages={
            "invalid": "Invalid lead time value.",
        },
    )
    lead_time_period = serializers.ChoiceField(
        choices=states_as_list(PeriodType),  # type: ignore
        allow_null=True,
        required=False,
        error_messages={
            "invalid_choice": "Invalid lead time period.",
        },
    )
    pricing_tiers = PricingTierInputSerializer(
        many=True,
        min_length=1,
        error_messages={
            "required": "At least one pricing tier is required.",
            "invalid": "Invalid pricing tier data.",
            "min_length": "At least one pricing tier is required.",
        },
    )
    attachments = AttachmentSerializer(
        many=True,
        error_messages={
            "invalid": "Invalid attachment data.",
        },
    )
    custom_sections = CustomSectionsOpenAPIInputSerializer(
        many=True,
        error_messages={
            "invalid": "Invalid custom section data.",
        },
    )


class ContractCreateBaseInputSerializer(serializers.Serializer):
    created_by_user_email = serializers.EmailField(
        error_messages={
            "required": "Creator email is required.",
            "invalid": "Enter a valid email address.",
        }
    )
    contract_name = serializers.CharField(
        max_length=200,
        error_messages={
            "required": "Contract name is required.",
            "blank": "Contract name cannot be empty.",
            "max_length": "Contract name cannot exceed 200 characters.",
        },
    )
    factwise_contract_id = serializers.CharField(
        max_length=20,
        allow_null=True,
        required=False,
        error_messages={
            "blank": "factwise_contract_id cannot be empty.",
            "max_length": "factwise_contract_id cannot exceed 20 characters.",
            "invalid": "Invalid factwise_contract_id.",
        },
    )
    ERP_contract_id = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "blank": "ERP_contract_id cannot be empty.",
            "invalid": "Invalid ERP contract ID.",
        },
    )
    contract_start_date = serializers.DateField(
        error_messages={
            "required": "Contract start date is required.",
            "invalid": "Invalid start date format. Expected YYYY-MM-DD.",
        }
    )
    contract_end_date = serializers.DateField(
        error_messages={
            "required": "Contract end date is required.",
            "invalid": "Invalid end date format. Expected YYYY-MM-DD.",
        }
    )
    entity_name = serializers.CharField(
        error_messages={
            "required": "Entity name is required.",
            "blank": "Entity name cannot be empty.",
            "invalid": "Invalid entity name.",
        }
    )
    status = serializers.ChoiceField(
        choices=[
            (ContractState.CONTRACT_DRAFT.value, ContractState.CONTRACT_DRAFT.name),
            (
                ContractState.CONTRACT_SUBMITTED.value,
                ContractState.CONTRACT_SUBMITTED.name,
            ),
        ],
        error_messages={
            "required": "Contract status is required.",
            "invalid_choice": "Invalid contract status.",
        },
    )
    template_name = serializers.CharField(
        error_messages={
            "required": "Template name is required.",
            "blank": "Template name cannot be empty.",
            "invalid": "Invalid template name.",
        }
    )
    buyer_identifications = serializers.ListField(
        child=serializers.CharField(
            error_messages={
                "blank": "Buyer identification cannot be empty.",
                "invalid": "Invalid buyer identification.",
            }
        ),
        min_length=0,
        error_messages={
            "invalid": "Buyer identifications must be a list.",
            "not_a_list": "Buyer identifications must be a list.",
        },
    )
    buyer_address = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "blank": "Buyer address cannot be empty.",
            "invalid": "Invalid buyer address.",
        },
    )
    buyer_contact = serializers.EmailField(
        error_messages={
            "required": "Buyer contact email is required.",
            "invalid": "Enter a valid buyer contact email.",
        }
    )
    factwise_vendor_code = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "blank": "Factwise vendor code cannot be empty.",
            "invalid": "Invalid Factwise vendor code.",
        },
    )
    ERP_vendor_code = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "blank": "ERP vendor code cannot be empty.",
            "invalid": "Invalid ERP vendor code.",
        },
    )
    vendor_identifications = VendorIdentificationSerializer(
        many=True,
        error_messages={
            "required": "Vendor identifications are required.",
            "invalid": "Invalid vendor identification data.",
            "not_a_list": "Vendor identifications must be a list.",
        },
    )
    vendor_address = AddressSerializer(
        allow_null=True,
        required=False,
        error_messages={
            "blank": "Vendor address cannot be empty.",
            "invalid": "Invalid vendor address.",
        },
    )
    vendor_contact = serializers.EmailField(
        error_messages={
            "required": "Vendor contact email is required.",
            "invalid": "Enter a valid vendor contact email.",
        }
    )
    project = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "blank": "Project cannot be empty.",
            "invalid": "Invalid project value.",
        },
    )
    additional_costs = AdditionalCostInputSerializer(
        many=True,
        default=[],
        error_messages={
            "invalid": "Invalid additional cost entries.",
            "not_a_list": "Must be a list.",
        },
    )
    taxes = AdditionalCostInputSerializer(
        many=True,
        default=[],
        error_messages={
            "invalid": "Invalid tax entries.",
            "not_a_list": "Must be a list.",
        },
    )
    discounts = AdditionalCostInputSerializer(
        many=True,
        default=[],
        error_messages={
            "invalid": "Invalid discount entries.",
            "not_a_list": "Must be a list.",
        },
    )
    prepayment_percentage = serializers.DecimalField(
        max_digits=7,
        decimal_places=4,
        min_value=0,
        max_value=100,
        allow_null=True,
        error_messages={
            "invalid": "Invalid prepayment percentage.",
            "min_value": "Prepayment percentage cannot be less than 0.",
            "max_value": "Prepayment percentage cannot exceed 100.",
        },
    )
    payment_type = serializers.ChoiceField(
        states_as_list(PaymentType),  # type: ignore
        allow_null=True,
        required=False,
        error_messages={
            "invalid_choice": "Invalid payment type.",
        },
    )
    payment_terms = PaymentTermsSerializer(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid payment terms.",
        },
    )
    deliverables_payment_terms = DeliverablesPaymentTermsSerializer(
        many=True,
        error_messages={
            "invalid": "Invalid deliverables payment terms.",
            "not_a_list": "Deliverables payment terms must be a list.",
        },
    )
    incoterm = serializers.ChoiceField(
        choices=states_as_list(IncotermAbbreviationType),  # type: ignore
        error_messages={
            "required": "Incoterm is required.",
            "invalid_choice": "Invalid incoterm.",
        },
    )
    lead_time = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        allow_null=True,
        required=False,
        min_value=0,
        error_messages={
            "invalid": "Invalid lead time value.",
        },
    )
    lead_time_period = serializers.ChoiceField(
        choices=states_as_list(PeriodType),  # type: ignore
        allow_null=True,
        required=False,
        error_messages={
            "invalid_choice": "Invalid lead time period.",
        },
    )
    custom_sections = CustomSectionsOpenAPIInputSerializer(
        many=True,
        error_messages={
            "invalid": "Invalid custom section data.",
            "not_a_list": "Custom sections must be a list.",
        },
    )
    attachments = AttachmentSerializer(
        many=True,
        error_messages={
            "invalid": "Invalid attachment data.",
            "not_a_list": "Attachments must be a list.",
        },
    )
    terms_and_conditions = TermsAndConditionsSerializer(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid terms and conditions.",
        },
    )
    contract_items = ContractItemSerializer(
        many=True,
        required=True,
        allow_empty=False,
        error_messages={
            "required": "contract_items is required.",
            "empty": "At least one contract item is required.",
            "invalid": "Invalid contract item data.",
        },
    )

    def validate(self, data):  # type: ignore
        if not data.get("ERP_vendor_code") and not data.get("factwise_vendor_code"):
            raise ValidationError(
                "Either factwise_vendor_code or ERP_vendor_code is required"
            )

        start = data.get("contract_start_date")
        end = data.get("contract_end_date")

        if start and end and end <= start:
            raise ValidationError(
                {"contract_end_date": "Contract end date must be after start date."}
            )

        contract_items = data.get("contract_items")
        if contract_items:
            for contract_item in contract_items:
                attributes = contract_item.get("attributes", [])
                for index, attribute in enumerate(attributes):
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
                            f"attribute_name, attribute_type and attribute_value is required for contreact item {index}"
                        )

                pricing_tiers = contract_item.get("pricing_tiers", [])
                if pricing_tiers:
                    # sort by min_quantity
                    tiers = sorted(pricing_tiers, key=lambda t: t["min_quantity"])

                    expected_min = None

                    for i, tier in enumerate(tiers):
                        min_q = tier.get("min_quantity")
                        max_q = tier.get("max_quantity")

                        if min_q is None or max_q is None:
                            raise ValidationError(
                                f"min_quantity and max_quantity are required for pricing tier {i + 1}"
                            )

                        if min_q > max_q:
                            raise ValidationError(
                                f"min_quantity cannot be greater than max_quantity in pricing tier {i + 1}"
                            )

                        if i == 0:
                            expected_min = min_q
                        else:
                            # no overlap, no gap
                            if min_q != expected_min:
                                raise ValidationError(
                                    f"Pricing tiers must be continuous with no gaps or overlaps. Error at tier starting with quantity {int(min_q)}"
                                )
                        expected_min = max_q + 1
        return data


class ContractUpdateBaseInputSerializer(serializers.Serializer):
    modified_by_user_email = serializers.EmailField(
        error_messages={
            "required": "modified_by_user_email is required.",
            "invalid": "Enter a valid email address.",
        }
    )
    contract_name = serializers.CharField(
        max_length=200,
        error_messages={
            "required": "Contract name is required.",
            "blank": "Contract name cannot be empty.",
            "max_length": "Contract name cannot exceed 200 characters.",
        },
    )
    factwise_contract_id = serializers.CharField(
        max_length=20,
        allow_null=True,
        required=False,
        error_messages={
            "blank": "factwise_contract_id cannot be empty.",
            "max_length": "factwise_contract_id cannot exceed 20 characters.",
            "invalid": "Invalid factwise_contract_id.",
        },
    )
    ERP_contract_id = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "blank": "ERP_contract_id cannot be empty.",
            "invalid": "Invalid ERP contract ID.",
        },
    )
    contract_start_date = serializers.DateField(
        error_messages={
            "required": "Contract start date is required.",
            "invalid": "Invalid start date format. Expected YYYY-MM-DD.",
        }
    )
    contract_end_date = serializers.DateField(
        error_messages={
            "required": "Contract end date is required.",
            "invalid": "Invalid end date format. Expected YYYY-MM-DD.",
        }
    )
    status = serializers.ChoiceField(
        choices=[
            (ContractState.CONTRACT_DRAFT.value, ContractState.CONTRACT_DRAFT.name),
            (
                ContractState.CONTRACT_SUBMITTED.value,
                ContractState.CONTRACT_SUBMITTED.name,
            ),
        ],
        error_messages={
            "required": "Contract status is required.",
            "invalid_choice": "Invalid contract status.",
        },
    )
    buyer_identifications = serializers.ListField(
        child=serializers.CharField(
            error_messages={
                "blank": "Buyer identification cannot be empty.",
                "invalid": "Invalid buyer identification.",
            }
        ),
        min_length=0,
        error_messages={
            "invalid": "Buyer identifications must be a list.",
            "not_a_list": "Buyer identifications must be a list.",
        },
    )
    buyer_address = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "blank": "Buyer address cannot be empty.",
            "invalid": "Invalid buyer address.",
        },
    )
    buyer_contact = serializers.EmailField(
        error_messages={
            "required": "Buyer contact email is required.",
            "invalid": "Enter a valid buyer contact email.",
        }
    )
    factwise_vendor_code = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "blank": "Factwise vendor code cannot be empty.",
            "invalid": "Invalid Factwise vendor code.",
        },
    )
    ERP_vendor_code = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "blank": "ERP vendor code cannot be empty.",
            "invalid": "Invalid ERP vendor code.",
        },
    )
    vendor_identifications = VendorIdentificationSerializer(
        many=True,
        error_messages={
            "required": "Vendor identifications are required.",
            "invalid": "Invalid vendor identification data.",
            "not_a_list": "Vendor identifications must be a list.",
        },
    )
    vendor_address = AddressSerializer(
        allow_null=True,
        required=False,
        error_messages={
            "blank": "Vendor address cannot be empty.",
            "invalid": "Invalid vendor address.",
        },
    )
    vendor_contact = serializers.EmailField(
        error_messages={
            "required": "Vendor contact email is required.",
            "invalid": "Enter a valid vendor contact email.",
        }
    )
    project = serializers.CharField(
        allow_null=True,
        required=False,
        error_messages={
            "blank": "Project cannot be empty.",
            "invalid": "Invalid project value.",
        },
    )
    additional_costs = AdditionalCostInputSerializer(
        many=True,
        default=[],
        error_messages={
            "invalid": "Invalid additional cost entries.",
            "not_a_list": "Must be a list.",
        },
    )
    taxes = AdditionalCostInputSerializer(
        many=True,
        default=[],
        error_messages={
            "invalid": "Invalid tax entries.",
            "not_a_list": "Must be a list.",
        },
    )
    discounts = AdditionalCostInputSerializer(
        many=True,
        default=[],
        error_messages={
            "invalid": "Invalid discount entries.",
            "not_a_list": "Must be a list.",
        },
    )
    prepayment_percentage = serializers.DecimalField(
        max_digits=7,
        decimal_places=4,
        min_value=0,
        max_value=100,
        allow_null=True,
        error_messages={
            "invalid": "Invalid prepayment percentage.",
            "min_value": "Prepayment percentage cannot be less than 0.",
            "max_value": "Prepayment percentage cannot exceed 100.",
        },
    )
    payment_type = serializers.ChoiceField(
        states_as_list(PaymentType),  # type: ignore
        allow_null=True,
        required=False,
        error_messages={
            "invalid_choice": "Invalid payment type.",
        },
    )
    payment_terms = PaymentTermsSerializer(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid payment terms.",
        },
    )
    deliverables_payment_terms = DeliverablesPaymentTermsSerializer(
        many=True,
        error_messages={
            "invalid": "Invalid deliverables payment terms.",
            "not_a_list": "Deliverables payment terms must be a list.",
        },
    )
    incoterm = serializers.ChoiceField(
        choices=states_as_list(IncotermAbbreviationType),  # type: ignore
        error_messages={
            "required": "Incoterm is required.",
            "invalid_choice": "Invalid incoterm.",
        },
    )
    lead_time = serializers.DecimalField(
        max_digits=30,
        decimal_places=10,
        allow_null=True,
        required=False,
        min_value=0,
        error_messages={
            "invalid": "Invalid lead time value.",
        },
    )
    lead_time_period = serializers.ChoiceField(
        choices=states_as_list(PeriodType),  # type: ignore
        allow_null=True,
        required=False,
        error_messages={
            "invalid_choice": "Invalid lead time period.",
        },
    )
    custom_sections = CustomSectionsOpenAPIInputSerializer(
        many=True,
        error_messages={
            "invalid": "Invalid custom section data.",
            "not_a_list": "Custom sections must be a list.",
        },
    )
    attachments = AttachmentSerializer(
        many=True,
        error_messages={
            "invalid": "Invalid attachment data.",
            "not_a_list": "Attachments must be a list.",
        },
    )
    terms_and_conditions = TermsAndConditionsSerializer(
        allow_null=True,
        required=False,
        error_messages={
            "invalid": "Invalid terms and conditions.",
        },
    )
    contract_items = ContractItemSerializer(
        many=True,
        required=True,
        allow_empty=False,
        error_messages={
            "required": "contract_items is required.",
            "empty": "At least one contract item is required.",
            "invalid": "Invalid contract item data.",
        },
    )

    def validate(self, data):  # type: ignore
        if not data.get("ERP_contract_id") and not data.get("factwise_contract_id"):
            raise ValidationError(
                "Either factwise_contract_id or ERP_contract_id is required"
            )

        if not data.get("ERP_vendor_code") and not data.get("factwise_vendor_code"):
            raise ValidationError(
                "Either factwise_vendor_code or ERP_vendor_code is required"
            )

        start = data.get("contract_start_date")
        end = data.get("contract_end_date")

        if start and end and end <= start:
            raise ValidationError(
                {"contract_end_date": "Contract end date must be after start date."}
            )

        contract_items = data.get("contract_items")
        if contract_items:
            for contract_item in contract_items:
                if not contract_item.get("ERP_item_code") and not contract_item.get(
                    "factwise_item_code"
                ):
                    raise ValidationError(
                        "Either factwise_item_code or ERP_item_code is required"
                    )

                attributes = contract_item.get("attributes", [])
                for index, attribute in enumerate(attributes):
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
                            f"attribute_name, attribute_type and attribute_value is required for contreact item {index}"
                        )

                pricing_tiers = contract_item.get("pricing_tiers", [])
                if pricing_tiers:
                    # sort by min_quantity
                    tiers = sorted(pricing_tiers, key=lambda t: t["min_quantity"])

                    expected_min = None

                    for i, tier in enumerate(tiers):
                        min_q = tier.get("min_quantity")
                        max_q = tier.get("max_quantity")

                        if min_q is None or max_q is None:
                            raise ValidationError(
                                f"min_quantity and max_quantity are required for pricing tier {i + 1}"
                            )

                        if min_q > max_q:
                            raise ValidationError(
                                f"min_quantity cannot be greater than max_quantity in pricing tier {i + 1}"
                            )

                        if i == 0:
                            expected_min = min_q
                        else:
                            # no overlap, no gap
                            if min_q != expected_min:
                                raise ValidationError(
                                    f"Pricing tiers must be continuous with no gaps or overlaps. Error at tier starting with quantity {int(min_q)}"
                                )
                        expected_min = max_q + 1
        return data


class ContractCreateAPI(APIView):
    class InputSerializer(ContractCreateBaseInputSerializer):
        class Meta:
            ref_name = "CreateContractAPIInputSerializer"

    @extend_schema(
        description="Create a Contract",
        request=InputSerializer,
        # responses={201: OpenApiTypes.STR},
    )
    def post(self, request):
        import sys

        print(
            f"[OPENAPI-VIEW] ContractCreateAPI.post HIT enterprise={request.enterprise_id}",
            flush=True,
        )
        sys.stderr.write(
            f"[OPENAPI-VIEW] ContractCreateAPI.post HIT enterprise={request.enterprise_id}\n"
        )
        request.data["enterprise_id"] = request.enterprise_id
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        custom_contract_id = contract_services.create_contract(
            enterprise_id=request.enterprise_id,
            **serializer.validated_data,
        )
        print(
            f"[OPENAPI-VIEW] ContractCreateAPI.post DONE contract={custom_contract_id}",
            flush=True,
        )
        sys.stderr.write(
            f"[OPENAPI-VIEW] ContractCreateAPI.post DONE contract={custom_contract_id}\n"
        )
        return Response(
            data={"custom_contract_id": custom_contract_id},
            status=status.HTTP_201_CREATED,
        )


class ContractBulkCreateAPI(APIView):
    def post(self, request):
        if not isinstance(request.data, dict) or "contracts" not in request.data:
            raise ValidationError("'contracts' must be provided")

        contracts = request.data["contracts"]
        if not isinstance(contracts, list):
            raise ValidationError("'contracts' must be a list")

        validated_contracts = []
        validation_errors = []

        for index, contract_data in enumerate(contracts):
            serializer = ContractCreateBaseInputSerializer(data=contract_data)
            if serializer.is_valid():
                validated_contracts.append(
                    {
                        "index": index,
                        "data": serializer.validated_data,
                    }
                )
            else:
                errors = normalize_serializer_errors(serializer.errors)  # type: ignore
                validation_errors.append(
                    {
                        "index": index,
                        "erp_contract_code": contract_data.get("ERP_contract_id"),
                        "error": "; ".join(
                            f"{field}: {', '.join(map(str, msgs)) if isinstance(msgs, list) else msgs}"
                            for field, msgs in errors.items()
                        ),
                    }
                )

        service_result = contract_services.create_contracts_bulk(
            enterprise_id=request.enterprise_id,
            contracts_payload=[p["data"] for p in validated_contracts],
            total_len=len(contracts),
            validation_errors=validation_errors,
        )

        if service_result.get("mode") == "async":
            return Response(
                {
                    "mode": "async",
                    "status": "accepted",
                    "task_id": service_result["task_id"],
                    "total_contracts": len(contracts),
                    "message": "Contract count exceeds synchronous limit. Processing asynchronously.",
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
                "erp_contract_code": r.get("erp_contract_code"),  # type: ignore
                "error": r["error"],  # type: ignore
            }
            for r in results
            if r["status"] == "failed"  # type: ignore
        ]

        return Response(
            {
                "total": len(contracts),
                "successful_count": service_result["success"],
                "failed_count": len(final_failed),
                "successful": [
                    {
                        "erp_contract_code": str(r.get("erp_contract_code", "")),  # type: ignore
                        "contract_code": str(r.get("contract_code", "")),  # type: ignore
                        "contract_id": str(r.get("contract_id", "")),  # type: ignore
                    }
                    for r in results
                    if r["status"] == "success"  # type: ignore
                ],
                "failed": final_failed,
            },
            status=status.HTTP_207_MULTI_STATUS,
        )


class ContractUpdateAPI(APIView):
    class InputSerializer(ContractUpdateBaseInputSerializer):
        class Meta:
            ref_name = "UpdateContractAPIInputSerializer"

    @extend_schema(
        description="Update a Contract",
        request=InputSerializer,
    )
    def put(self, request):
        request.data["enterprise_id"] = request.enterprise_id
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contract_services.update_contract(
            **serializer.validated_data,
        )
        return Response(status=status.HTTP_200_OK)


class ContractBulkUpdateAPI(APIView):
    def put(self, request):
        if not isinstance(request.data, dict) or "contracts" not in request.data:
            raise ValidationError("'contracts' must be provided")

        contracts = request.data["contracts"]
        if not isinstance(contracts, list):
            raise ValidationError("'contracts' must be a list")

        validated_contracts = []
        validation_errors = []

        for index, contract_data in enumerate(contracts):
            serializer = ContractUpdateBaseInputSerializer(data=contract_data)
            if serializer.is_valid():
                validated_contracts.append(
                    {
                        "index": index,
                        "data": serializer.validated_data,
                    }
                )
            else:
                errors = normalize_serializer_errors(serializer.errors)  # type: ignore
                validation_errors.append(
                    {
                        "index": index,
                        "erp_contract_code": contract_data.get("ERP_contract_id"),
                        "error": "; ".join(
                            f"{field}: {', '.join(map(str, msgs)) if isinstance(msgs, list) else msgs}"
                            for field, msgs in errors.items()
                        ),
                    }
                )

        service_result = contract_services.update_contracts_bulk(
            enterprise_id=request.enterprise_id,
            contracts_payload=[i["data"] for i in validated_contracts],
            total_len=len(contracts),
            validation_errors=validation_errors,
        )

        if service_result.get("mode") == "async":
            return Response(
                {
                    "mode": "async",
                    "status": "accepted",
                    "task_id": service_result["task_id"],
                    "total_contracts": len(contracts),
                    "message": "Contract count exceeds synchronous limit. Processing asynchronously.",
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
                "erp_contract_code": r.get("erp_contract_code"),  # type: ignore
                "error": r["error"],  # type: ignore
            }
            for r in results
            if r["status"] == "failed"  # type: ignore
        ]

        return Response(
            {
                "total": len(contracts),
                "successful_count": service_result["success"],
                "failed_count": len(final_failed),
                "successful": [
                    {
                        "erp_contract_code": str(r.get("erp_contract_code", "")),  # type: ignore
                        "contract_code": str(r.get("contract_code", "")),  # type: ignore
                        "contract_id": str(r.get("contract_id", "")),  # type: ignore
                    }
                    for r in results
                    if r["status"] == "success"  # type: ignore
                ],
                "failed": final_failed,
            },
            status=status.HTTP_207_MULTI_STATUS,
        )


class ContractStatusAPI(APIView):
    class InputSerializer(serializers.Serializer):
        enterprise_id = serializers.UUIDField()
        modified_by_user_email = serializers.EmailField()
        factwise_contract_id = serializers.CharField(allow_null=True)
        ERP_contract_id = serializers.CharField(allow_null=True)
        status = serializers.ChoiceField(
            choices=[
                (
                    ContractState.CONTRACT_TERMINATED.value,
                    ContractState.CONTRACT_TERMINATED.name,
                ),
            ]
        )
        notes = serializers.CharField(allow_null=True)

        class Meta:
            ref_name = "ContractStatueAPIInputSerializer"

        def validate(self, data):
            if not data.get("ERP_contract_id") and not data.get("factwise_contract_id"):
                raise ValidationError(
                    "Either factwise_contract_id or ERP_contract_id is required"
                )
            return data

    @extend_schema(
        description="Update contract status",
        request=InputSerializer,
    )
    def put(self, request):
        request.data["enterprise_id"] = request.enterprise_id
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contract_services.update_contract_status(
            **serializer.validated_data,
        )
        return Response(status=status.HTTP_200_OK)
