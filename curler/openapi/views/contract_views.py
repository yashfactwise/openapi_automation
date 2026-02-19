from drf_spectacular.utils import extend_schema

from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from backbone.states import IncotermAbbreviationType
from contract.states import ContractState
from custom.serializers import CustomSectionsOpenAPIInputSerializer
from factwise.states import PaymentType, PeriodType, states_as_list
from openapi.services import contract_services
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


class ContractItemSerializer(serializers.Serializer):
    ERP_item_code = serializers.CharField(allow_null=True)
    factwise_item_code = serializers.CharField(allow_null=True)
    currency_code_id = serializers.UUIDField()
    measurement_unit_id = serializers.UUIDField()
    attributes = AttributeInputSerializer(many=True)
    # rate = serializers.DecimalField(
    #     max_digits=30, decimal_places=10, min_value=0, allow_null=True
    # )
    # quantity = serializers.DecimalField(
    #     max_digits=30, decimal_places=10, min_value=0, allow_null=True
    # )
    prepayment_percentage = serializers.DecimalField(
        max_digits=7, decimal_places=4, min_value=0, max_value=100, allow_null=True
    )
    payment_type = serializers.ChoiceField(states_as_list(PaymentType), allow_null=True)
    payment_terms = PaymentTermsSerializer(allow_null=True)
    deliverables_payment_terms = DeliverablesPaymentTermsSerializer(many=True)
    incoterm = serializers.ChoiceField(choices=states_as_list(IncotermAbbreviationType))
    lead_time = serializers.DecimalField(
        max_digits=30, decimal_places=10, allow_null=True
    )
    lead_time_period = serializers.ChoiceField(
        choices=states_as_list(PeriodType), allow_null=True
    )
    # additional_costs = AdditionalCostInputSerializer(many=True)
    # taxes = AdditionalCostInputSerializer(many=True)
    # discounts = AdditionalCostInputSerializer(many=True)
    pricing_tiers = PricingTierInputSerializer(many=True, min_length=1)
    attachments = AttachmentSerializer(many=True)
    custom_sections = CustomSectionsOpenAPIInputSerializer(many=True)


class ContractCreateAPI(APIView):
    class InputSerializer(serializers.Serializer):
        enterprise_id = serializers.UUIDField()
        created_by_user_email = serializers.EmailField()
        contract_name = serializers.CharField(max_length=200)
        ERP_contract_id = serializers.CharField(allow_null=True)
        contract_start_date = serializers.DateField()
        contract_end_date = serializers.DateField()
        entity_name = serializers.CharField()
        status = serializers.ChoiceField(
            choices=[
                (ContractState.CONTRACT_DRAFT.value, ContractState.CONTRACT_DRAFT.name),
                (
                    ContractState.CONTRACT_SUBMITTED.value,
                    ContractState.CONTRACT_SUBMITTED.name,
                ),
            ]
        )
        template_name = serializers.CharField()
        buyer_identifications = serializers.ListField(
            child=serializers.CharField(), min_length=0
        )
        buyer_address = serializers.CharField(allow_null=True)
        buyer_contact = serializers.EmailField()
        factwise_vendor_code = serializers.CharField(allow_null=True)
        ERP_vendor_code = serializers.CharField(allow_null=True)
        vendor_identifications = VendorIdentificationSerializer(many=True)
        vendor_address = AddressSerializer(allow_null=True)
        vendor_contact = serializers.EmailField()
        project = serializers.CharField(allow_null=True)
        additional_costs = AdditionalCostInputSerializer(many=True, default=[])
        taxes = AdditionalCostInputSerializer(many=True, default=[])
        discounts = AdditionalCostInputSerializer(many=True, default=[])
        prepayment_percentage = serializers.DecimalField(
            max_digits=7, decimal_places=4, min_value=0, max_value=100, allow_null=True
        )
        payment_type = serializers.ChoiceField(
            states_as_list(PaymentType), allow_null=True
        )
        payment_terms = PaymentTermsSerializer(allow_null=True)
        deliverables_payment_terms = DeliverablesPaymentTermsSerializer(many=True)
        incoterm = serializers.ChoiceField(
            choices=states_as_list(IncotermAbbreviationType)
        )
        lead_time = serializers.DecimalField(
            max_digits=30, decimal_places=10, allow_null=True
        )
        lead_time_period = serializers.ChoiceField(
            choices=states_as_list(PeriodType), allow_null=True
        )
        custom_sections = CustomSectionsOpenAPIInputSerializer(many=True)
        attachments = AttachmentSerializer(many=True)
        terms_and_conditions = TermsAndConditionsSerializer(allow_null=True)
        contract_items = ContractItemSerializer(many=True)

        class Meta:
            ref_name = "CreateContractAPIInputSerializer"

        def validate(self, data):
            if not data.get("ERP_vendor_code") and not data.get("factwise_vendor_code"):
                raise ValidationError(
                    "Either factwise_vendor_code or ERP_vendor_code is required"
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

                # if not contract_item["rate"] and not contract_item["quantity"]:
                #     raise ValidationError(
                #         "Either rate or quantity is required for contract item"
                #     )

            return data

    @extend_schema(
        description="Create a Contract",
        request=InputSerializer,
        # responses={201: OpenApiTypes.STR},
    )
    def post(self, request):
        import sys
        print(f"[OPENAPI-VIEW] ContractCreateAPI.post HIT enterprise={request.enterprise_id}", flush=True)
        sys.stderr.write(f"[OPENAPI-VIEW] ContractCreateAPI.post HIT enterprise={request.enterprise_id}\n")
        request.data["enterprise_id"] = request.enterprise_id
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        custom_contract_id = contract_services.create_contract(
            **serializer.validated_data,
        )
        print(f"[OPENAPI-VIEW] ContractCreateAPI.post DONE contract={custom_contract_id}", flush=True)
        sys.stderr.write(f"[OPENAPI-VIEW] ContractCreateAPI.post DONE contract={custom_contract_id}\n")
        return Response(
            data={"custom_contract_id": custom_contract_id},
            status=status.HTTP_201_CREATED,
        )


class ContractUpdateAPI(APIView):
    class InputSerializer(serializers.Serializer):
        enterprise_id = serializers.UUIDField()
        modified_by_user_email = serializers.EmailField()
        contract_name = serializers.CharField(max_length=200)
        factwise_contract_id = serializers.CharField(allow_null=True)
        ERP_contract_id = serializers.CharField(allow_null=True)
        contract_start_date = serializers.DateField()
        contract_end_date = serializers.DateField()
        status = serializers.ChoiceField(
            choices=[
                (ContractState.CONTRACT_DRAFT.value, ContractState.CONTRACT_DRAFT.name),
                (
                    ContractState.CONTRACT_SUBMITTED.value,
                    ContractState.CONTRACT_SUBMITTED.name,
                ),
                (
                    ContractState.CONTRACT_TERMINATED.value,
                    ContractState.CONTRACT_TERMINATED.name,
                ),
            ]
        )
        buyer_identifications = serializers.ListField(
            child=serializers.CharField(), min_length=0
        )
        buyer_address = serializers.CharField(allow_null=True)
        buyer_contact = serializers.EmailField()
        factwise_vendor_code = serializers.CharField(allow_null=True)
        ERP_vendor_code = serializers.CharField(allow_null=True)
        vendor_identifications = VendorIdentificationSerializer(many=True)
        vendor_address = AddressSerializer(allow_null=True)
        vendor_contact = serializers.EmailField()
        project = serializers.CharField(allow_null=True)
        additional_costs = AdditionalCostInputSerializer(many=True, default=[])
        taxes = AdditionalCostInputSerializer(many=True, default=[])
        discounts = AdditionalCostInputSerializer(many=True, default=[])
        prepayment_percentage = serializers.DecimalField(
            max_digits=7, decimal_places=4, min_value=0, max_value=100, allow_null=True
        )
        payment_type = serializers.ChoiceField(
            states_as_list(PaymentType), allow_null=True
        )
        payment_terms = PaymentTermsSerializer(allow_null=True)
        deliverables_payment_terms = DeliverablesPaymentTermsSerializer(many=True)
        incoterm = serializers.ChoiceField(
            choices=states_as_list(IncotermAbbreviationType)
        )
        lead_time = serializers.DecimalField(
            max_digits=30, decimal_places=10, allow_null=True
        )
        lead_time_period = serializers.ChoiceField(
            choices=states_as_list(PeriodType), allow_null=True
        )
        custom_sections = CustomSectionsOpenAPIInputSerializer(many=True)
        attachments = AttachmentSerializer(many=True)
        terms_and_conditions = TermsAndConditionsSerializer(allow_null=True)
        contract_items = ContractItemSerializer(many=True)

        class Meta:
            ref_name = "UpdateContractAPIInputSerializer"

        def validate(self, data):
            if not data.get("ERP_contract_id") and not data.get("factwise_contract_id"):
                raise ValidationError(
                    "Either factwise_contract_id or ERP_contract_id is required"
                )

            if not data.get("ERP_vendor_code") and not data.get("factwise_vendor_code"):
                raise ValidationError(
                    "Either factwise_vendor_code or ERP_vendor_code is required"
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

                # if not contract_item["rate"] and not contract_item["quantity"]:
                #     raise ValidationError(
                #         "Either rate or quantity is required for contract item"
                #     )

            return data

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
